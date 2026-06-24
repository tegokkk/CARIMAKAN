import { useRef } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingBag, FaStar } from "react-icons/fa";
import { gsap, useGSAP } from "../../animations/gsapConfig";
import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/getImageUrl";

function FoodCard({ menu, onAddToCart, onFavorite, favoriteActive = false, className = "" }) {
  const cardRef = useRef(null);
  const addButtonRef = useRef(null);
  const favoriteButtonRef = useRef(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const enter = () => gsap.to(card, { x: -2, y: -2, duration: 0.16, ease: "steps(2)", overwrite: true });
      const leave = () => gsap.to(card, { x: 0, y: 0, duration: 0.16, ease: "steps(2)", overwrite: true });

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      return () => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      };
    },
    { scope: cardRef }
  );

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToCart?.(menu, event);

    if (addButtonRef.current) {
      gsap.fromTo(addButtonRef.current, { x: 3, y: 3 }, { x: 0, y: 0, duration: 0.2, ease: "steps(3)" });
    }
  };

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onFavorite?.(menu, event);

    if (favoriteButtonRef.current) {
      gsap.fromTo(favoriteButtonRef.current, { scale: 0.82 }, { scale: 1, duration: 0.22, ease: "steps(3)" });
    }
  };

  return (
    <Link ref={cardRef} to={`/menu/${menu.id}`} className={`retro-window retro-card-hover group block ${className}`}>
      <div className="retro-titlebar flex items-center gap-2 px-2">
        <span className="h-3 w-3 border-2 border-[#281712] bg-white" />
        <p className="min-w-0 flex-1 truncate text-center retro-system-copy">
          {menu.category_name || menu.restaurant_name || "Menu"}
        </p>
        <span className="h-3 w-3 border-2 border-[#281712] bg-white" />
      </div>

      <div className="p-3">
        <div className="retro-photo-frame relative aspect-[5/4] overflow-hidden">
          {menu.image ? (
            <img
              src={getImageUrl(menu.image, 500)}
              alt={menu.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center border-2 border-[#281712] retro-dither retro-system-copy text-[#aa3000]">
              CariMakan
            </div>
          )}
          {Number(menu.rating) > 0 && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 border-2 border-[#281712] bg-white px-2 py-1 text-xs font-black">
              <FaStar className="text-[#aa3000]" />
              {menu.rating}
            </span>
          )}
          {onFavorite && (
            <button
              ref={favoriteButtonRef}
              type="button"
              onClick={handleFavorite}
              className="absolute left-3 top-3 grid h-9 w-9 place-items-center border-2 border-[#281712] bg-white text-[#aa3000] retro-shadow-small retro-press"
              title="Favorit"
            >
              {favoriteActive ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>

        <div className="px-1 py-4">
          <p className="mb-2 truncate retro-system-copy text-[#5c4037]">
            {menu.restaurant_name || "CariMakan Partner"}
          </p>
          <h3 className="retro-headline line-clamp-1 text-2xl text-[#281712]">{menu.name}</h3>
          <p className="mt-3 min-h-10 text-sm leading-6 text-[#5c4037] line-clamp-2">
            {menu.description || "Menu pilihan dengan rasa yang siap jadi favorit baru."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t-2 border-[#281712] px-1 pt-4">
          <div className="min-w-0">
            <span className="block retro-system-copy text-[#5c4037]">Harga</span>
            <span className="block truncate text-lg font-black text-[#aa3000]">{formatCurrency(menu.price)}</span>
          </div>
          <button
            ref={addButtonRef}
            type="button"
            onClick={handleAdd}
            className="retro-button retro-button-primary retro-press h-11 w-11 p-0"
            title="Tambah ke keranjang"
          >
            <FaShoppingBag />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default FoodCard;
