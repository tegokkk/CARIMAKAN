const OrderService = require('../services/order.service');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const checkoutSchema = z.object({
  body: z.object({
    customer_name: z.string().min(1, 'Customer name is required'),
    customer_phone: z.string().min(1, 'Customer phone number is required'),
    delivery_address: z.string().min(1, 'Delivery address is required'),
    payment_method: z.string().optional().default('COD'),
    notes: z.string().optional()
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'paid', 'process', 'done', 'cancelled'], {
      errorMap: () => ({ message: 'Invalid status. Must be pending, paid, process, done, or cancelled' })
    })
  })
});

class OrderController {
  static get checkoutSchema() {
    return checkoutSchema;
  }

  static get updateStatusSchema() {
    return updateStatusSchema;
  }

  static async checkout(req, res, next) {
    try {
      const userId = req.user.id;
      const order = await OrderService.checkout(userId, req.body);
      return sendSuccess(res, 'Checkout completed successfully', order, null, 201);
    } catch (error) {
      if (error.message === 'Cart is empty' || error.message.includes('Insufficient stock') || error.message.includes('not found')) {
        return sendError(res, error.message, [], 400);
      }
      next(error);
    }
  }

  static async getMyOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const orders = await OrderService.getUserOrders(userId);
      return sendSuccess(res, 'User orders fetched successfully', orders);
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req, res, next) {
    try {
      const orders = await OrderService.getAllOrders();
      return sendSuccess(res, 'All orders fetched successfully', orders);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const order = await OrderService.getOrderById(Number(id), { id: userId, role: userRole });
      if (!order) {
        return sendError(res, 'Order not found', [], 404);
      }

      return sendSuccess(res, 'Order details fetched successfully', order);
    } catch (error) {
      if (error.statusCode === 403) {
        return sendError(res, error.message, [], 403);
      }
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await OrderService.updateOrderStatus(Number(id), status);
      if (!updatedOrder) {
        return sendError(res, 'Order not found', [], 404);
      }

      return sendSuccess(res, 'Order status updated successfully', updatedOrder);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
