"use client"

import { useEffect, useState } from "react"

export const MouseTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverType, setHoverType] = useState<"text" | "button" | null>(null)

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })

      const elementUnderCursor = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement

      if (elementUnderCursor) {
        if (
          elementUnderCursor.tagName === "P" ||
          elementUnderCursor.tagName === "H1" ||
          elementUnderCursor.tagName === "H2" ||
          elementUnderCursor.tagName === "H3" ||
          elementUnderCursor.tagName === "SPAN" ||
          elementUnderCursor.tagName === "A"
        ) {
          setHoverType("text")
          setIsHovering(true)
        }
        else if (elementUnderCursor.tagName === "BUTTON" || elementUnderCursor.classList.contains("button-like")) {
          setHoverType("button")
          setIsHovering(true)
        } else {
          setIsHovering(false)
          setHoverType(null)
        }
      }
    }

    const mouseEnterHandler = () => setIsVisible(true)
    const mouseLeaveHandler = () => setIsVisible(false)

    document.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("mouseenter", mouseEnterHandler)
    document.addEventListener("mouseleave", mouseLeaveHandler)

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler)
      document.removeEventListener("mouseenter", mouseEnterHandler)
      document.removeEventListener("mouseleave", mouseLeaveHandler)
    }
  }, [])

  return (
    <div
      className={`pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
        hoverType === "text" ? "mix-blend-difference" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isVisible ? 0.8 : 0,
        width: isHovering ? (hoverType === "button" ? "120px" : "60px") : "20px",
        height: isHovering ? (hoverType === "button" ? "120px" : "60px") : "20px",
        backgroundColor: "#fff",
        transform: `translate(-50%, -50%) ${isHovering && hoverType === "button" ? "scale(1.3)" : "scale(1)"}`,
      }}
    />
  )
}

