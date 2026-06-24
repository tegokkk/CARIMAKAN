import { useRef } from "react";
import { useGSAP, gsap } from "../../animations/gsapConfig";

function PageWrapper({ children, className = "", animate = true }) {
  const pageRef = useRef(null);

  useGSAP(
    () => {
      if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.58, clearProps: "transform" }
      );
    },
    { scope: pageRef, dependencies: [animate] }
  );

  return (
    <main ref={pageRef} className={`retro-canvas w-full max-w-full overflow-x-hidden pb-10 pt-10 ${className}`}>
      {children}
    </main>
  );
}

export default PageWrapper;
