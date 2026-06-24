import { FaSearch } from "react-icons/fa";

function RetroInput({ className = "", icon = true, ...props }) {
  return (
    <div className={`retro-input flex h-12 items-center gap-3 px-3 ${className}`}>
      {icon && <FaSearch className="shrink-0 text-[#281712]" />}
      <input
        className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[#281712] placeholder:text-[#5c4037] focus:shadow-none"
        {...props}
      />
      <span className="retro-caret h-5 w-2 bg-[#281712]" />
    </div>
  );
}

export default RetroInput;
