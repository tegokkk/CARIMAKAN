const prisma = require('../config/prisma');

const DELIVERY_FEE = 10000;
const SERVICE_FEE = 2000;

const toNumber = (value) => Number(value || 0);

const mapOrderItem = (item) => ({
  id: item.id,
  order_id: item.orderId,
  menu_id: item.menuId,
  quantity: item.quantity,
  price: toNumber(item.price),
  subtotal: toNumber(item.subtotal),
  created_at: item.createdAt,
  updated_at: item.updatedAt,
  menu_name: item.menu?.name,
  menu_image: item.menu?.image,
  restaurant_name: item.menu?.restaurant?.name,
  Menu: item.menu
    ? {
        id: item.menu.id,
        name: item.menu.name,
        image: item.menu.image,
        restaurant_name: item.menu.restaurant?.name,
      }
    : null,
});

const mapOrder = (order) => ({
  id: order.id,
  user_id: order.userId,
  order_code: order.orderCode,
  total_price: toNumber(order.totalPrice),
  status: order.status,
  payment_method: order.paymentMethod,
  customer_name: order.customerName,
  customer_phone: order.customerPhone,
  delivery_address: order.deliveryAddress,
  notes: order.notes,
  created_at: order.createdAt,
  updated_at: order.updatedAt,
  user_name: order.user?.name,
  user_email: order.user?.email,
  OrderItems: order.items?.map(mapOrderItem) || [],
  items: order.items?.map(mapOrderItem) || [],
});

const orderInclude = {
  items: {
    include: {
      menu: {
        include: {
          restaurant: true,
        },
      },
    },
  },
};

class OrderService {
  static async checkout(userId, checkoutData) {
    const { customer_name, customer_phone, delivery_address, payment_method, notes } = checkoutData;
    const normalizedPaymentMethod = payment_method || 'COD';
    const orderStatus = normalizedPaymentMethod === 'FAKEPAY' ? 'paid' : 'pending';

    return prisma.$transaction(async (tx) => {
      const cartItems = await tx.cart.findMany({
        where: { userId },
        include: { menu: true },
      });

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      let total_price = 0;
      for (const item of cartItems) {
        if (!item.menu?.isActive) {
          throw new Error(`Menu item '${item.menu?.name || item.menuId}' is no longer active`);
        }
        if (item.menu.stock < item.quantity) {
          throw new Error(`Insufficient stock for '${item.menu.name}'. Available: ${item.menu.stock}`);
        }
        total_price += toNumber(item.menu.price) * item.quantity;
      }

      total_price += DELIVERY_FEE + SERVICE_FEE;

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randHex = Math.floor(1000 + Math.random() * 9000);
      const order_code = `CM-${dateStr}-${randHex}`;

      const order = await tx.order.create({
        data: {
          userId,
          orderCode: order_code,
          totalPrice: total_price,
          status: orderStatus,
          paymentMethod: normalizedPaymentMethod,
          customerName: customer_name,
          customerPhone: customer_phone,
          deliveryAddress: delivery_address,
          notes: notes || null,
        },
      });

      for (const item of cartItems) {
        const itemPrice = toNumber(item.menu.price);
        const subtotal = itemPrice * item.quantity;

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            menuId: item.menuId,
            quantity: item.quantity,
            price: itemPrice,
            subtotal,
          },
        });

        await tx.menu.update({
          where: { id: item.menuId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cart.deleteMany({ where: { userId } });

      return {
        id: order.id,
        order_code,
        total_price,
        status: orderStatus,
        payment_method: normalizedPaymentMethod
      };
    });
  }

  static async getUserOrders(userId) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    });

    return orders.map(mapOrder);
  }

  static async getAllOrders() {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        ...orderInclude,
      },
    });

    return orders.map(mapOrder);
  }

  static async getOrderById(id, requester) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        ...orderInclude,
      },
    });

    if (!order) return null;
    if (requester.role !== 'admin' && order.userId !== requester.id) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }

    return mapOrder(order);
  }

  static async updateOrderStatus(id, status) {
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return null;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return mapOrder(order);
  }
}

module.exports = OrderService;
