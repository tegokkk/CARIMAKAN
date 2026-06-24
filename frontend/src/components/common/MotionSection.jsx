import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../animations/gsapConfig";

function MotionSection({ children, className = "", animate = true, staggerSelector = null }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      if (!animate) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const target = staggerSelector
        ? sectionRef.current.querySelectorAll(staggerSelector)
        : sectionRef.current;

      if (!target || (target.length !== undefined && target.length === 0)) return;

      gsap.fromTo(
        target,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.74,
          stagger: staggerSelector ? 0.075 : 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );

      ScrollTrigger.refresh();
    },
    { scope: sectionRef, dependencies: [animate, staggerSelector] }
  );

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}

export default MotionSection;
