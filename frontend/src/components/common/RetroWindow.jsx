function RetroWindow({
  title = "Window",
  children,
  className = "",
  bodyClassName = "",
  dark = false,
  controls = true,
  action,
}) {
  return (
    <section className={`${dark ? "retro-window-dark" : "retro-window"} ${className}`}>
      <div className={dark ? "retro-titlebar-dark flex items-center gap-2 px-2" : "retro-titlebar flex items-center gap-2 px-2"}>
        {controls && (
          <span className={`grid h-4 w-4 place-items-center border ${dark ? "border-[#fff8f6] bg-[#fff8f6] text-[#281712]" : "border-[#281712] bg-white text-[#281712]"}`}>
            <span className="h-1.5 w-1.5 bg-current" />
          </span>
        )}
        <div className="retro-stripes h-4 flex-1" />
        <div className={`retro-system-copy shrink-0 border-2 px-3 py-0.5 ${dark ? "border-[#fff8f6] bg-[#281712] text-[#fff8f6]" : "border-[#281712] bg-white text-[#281712]"}`}>
          {title}
        </div>
        <div className="retro-stripes h-4 flex-1" />
        {action || (controls && <span className={`h-4 w-4 border-2 ${dark ? "border-[#fff8f6]" : "border-[#281712] bg-white"}`} />)}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export default RetroWindow;
