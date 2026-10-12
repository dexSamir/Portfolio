import { useEffect, useRef } from "react";
import { useMediaQuery } from "../hooks/use-media-query";

const DOT_SIZE = 20;

export const MouseTracker = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

  useEffect(() => {
    const dot = dotRef.current;
    if (!enabled || !dot) return;
    let frame = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    let visible = false;
    const animate = () => {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      // Individual translate is applied before scale, so hover scaling cannot move the cursor center.
      dot.style.translate = `${x - DOT_SIZE / 2}px ${y - DOT_SIZE / 2}px`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };
    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) { x = targetX; y = targetY; visible = true; }
      dot.style.opacity = "1";
      const hovering = event.target instanceof Element && event.target.closest("a, button, input, textarea, .button-like");
      dot.style.scale = hovering ? "2" : "1";
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      cancelAnimationFrame(frame);
      frame = 0;
    };
    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  return enabled ? <div ref={dotRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[999] rounded-full bg-white mix-blend-difference" style={{ width: DOT_SIZE, height: DOT_SIZE, opacity: 0, transition: "opacity .2s, scale .2s" }} /> : null;
};
