import { Link } from "react-router-dom";

function RetroButton({
  children,
  to,
  type = "button",
  variant = "default",
  className = "",
  ...props
}) {
  const variantClass =
    variant === "primary"
      ? "retro-button-primary"
      : variant === "dark"
        ? "retro-button-dark"
        : "";
  const classes = `retro-button retro-press ${variantClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default RetroButton;
