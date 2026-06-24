import { Link } from "react-router-dom";
import { FaArrowRight, FaStore } from "react-icons/fa";
import { getImageUrl } from "../../utils/getImageUrl";

function RestaurantCard({ name, image, category, count }) {
  return (
    <Link to={`/search?q=${encodeURIComponent(name)}`} className="retro-window retro-card-hover group flex min-h-52 flex-col sm:flex-row">
      <div className="retro-titlebar flex items-center gap-2 px-2 sm:hidden">
        <span className="h-3 w-3 border-2 border-[#281712]" />
        <span className="flex-1 text-center retro-system-copy">{name}</span>
        <span className="h-3 w-3 border-2 border-[#281712]" />
      </div>
      <div className="retro-photo-frame m-3 min-h-40 bg-[#e0e0e0] sm:w-2/5">
        <img
          src={getImageUrl(image, 600)}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <span className="mb-4 grid h-12 w-12 place-items-center border-2 border-[#281712] bg-[#aa3000] text-white retro-shadow-small">
            <FaStore />
          </span>
          <p className="retro-system-copy text-[#5c4037]">{category || "Restoran"}</p>
          <h3 className="retro-headline mt-2 text-2xl text-[#281712]">{name}</h3>
          <p className="mt-3 text-sm leading-6 text-[#5c4037]">
            {count} menu tersedia untuk dijelajahi dari partner ini.
          </p>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 retro-system-copy text-[#aa3000]">
          Lihat menu <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default RestaurantCard;
