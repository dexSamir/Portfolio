import { useEffect, useState, useRef } from "react";
import { useTheme } from "./theme-provider";
import { useMediaQuery } from "../hooks/use-media-query";

export const MouseTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [, setHoverElement] = useState<HTMLElement | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
  };

  useEffect(() => {
    if (!isDesktop) return;

    let animationFrameId: number;

    const mouseMoveHandler = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });

      const elementUnderCursor = document.elementFromPoint(
        event.clientX,
        event.clientY
      ) as HTMLElement;

      if (elementUnderCursor) {
        if (
          elementUnderCursor.tagName === "BUTTON" ||
          elementUnderCursor.classList.contains("button-like") ||
          elementUnderCursor.tagName === "P" ||
          elementUnderCursor.tagName === "H1" ||
          elementUnderCursor.tagName === "H2" ||
          elementUnderCursor.tagName === "H3" ||
          elementUnderCursor.tagName === "SPAN" ||
          elementUnderCursor.tagName === "A" ||
          elementUnderCursor.tagName === "SVG" ||
          elementUnderCursor.tagName === "PATH" ||
          elementUnderCursor.closest("a") ||
          elementUnderCursor.closest("i") ||
          elementUnderCursor.closest("button") ||
          elementUnderCursor.closest("h3") ||
          elementUnderCursor.closest("span")
        ) {
          setIsHovering(true);
          setHoverElement(elementUnderCursor);
        } else {
          setIsHovering(false);
          setHoverElement(null);
        }
      }
    };

    const mouseEnterHandler = () => setIsVisible(true);
    const mouseLeaveHandler = () => setIsVisible(false);

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseenter", mouseEnterHandler);
    document.addEventListener("mouseleave", mouseLeaveHandler);

    const animate = () => {
      setDotPosition((prev) => ({
        x: lerp(prev.x, position.x, 0.10),
        y: lerp(prev.y, position.y, 0.10),
      }));
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseenter", mouseEnterHandler);
      document.removeEventListener("mouseleave", mouseLeaveHandler);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [position, isDesktop]);

  if (typeof window === "undefined" || !isDesktop) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed z-[999] mix-blend-difference"
      style={{
        left: `${dotPosition.x}px`,
        top: `${dotPosition.y}px`,
        opacity: isVisible ? 1 : 0,
        width: isHovering ? "60px" : "20px",
        height: isHovering ? "60px" : "20px",
        backgroundColor: theme === "dark" ? "#fff" : "#000",
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
        transition:
          "transform 1s ease-out, opacity .5s ease, width .5s ease-out, height .5s ease-out, background-color 0.5s ease",
        borderRadius: "50%",
      }}
    />
  );
};
