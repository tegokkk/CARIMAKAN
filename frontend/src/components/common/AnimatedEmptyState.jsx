import { FaClipboardList, FaShoppingBasket } from "react-icons/fa";

const icons = {
  cart: FaShoppingBasket,
  orders: FaClipboardList,
};

function AnimatedEmptyState({
  type = "cart",
  title,
  description,
  children,
  className = "",
}) {
  const Icon = icons[type] || FaShoppingBasket;

  return (
    <div className={`retro-window p-8 text-center md:p-12 ${className}`}>
      <div className="retro-dither mx-auto grid h-28 w-28 place-items-center border-2 border-[#281712] shadow-[4px_4px_0_#281712]">
        <Icon className="text-5xl text-[#aa3000]" aria-hidden="true" />
      </div>
      <h1 className="retro-headline mt-8 text-4xl text-[#281712]">{title}</h1>
      <p className="mx-auto mt-4 max-w-sm leading-8 text-[#5c4037]">{description}</p>
      {children}
    </div>
  );
}

export default AnimatedEmptyState;
