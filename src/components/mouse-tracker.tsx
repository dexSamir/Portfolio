"use client"

import { useEffect, useState, useRef } from "react"

export const MouseTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverElement, setHoverElement] = useState<HTMLElement | null>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t
  }

  useEffect(() => {
    let animationFrameId: number

    const mouseMoveHandler = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })

      const elementUnderCursor = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement

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
          elementUnderCursor.tagName === "PATH"
        ) {
          setIsHovering(true)
          setHoverElement(elementUnderCursor)
        } else {
          setIsHovering(false)
          setHoverElement(null)
        }
      }
    }

    const mouseEnterHandler = () => setIsVisible(true)
    const mouseLeaveHandler = () => setIsVisible(false)

    document.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("mouseenter", mouseEnterHandler)
    document.addEventListener("mouseleave", mouseLeaveHandler)

    const animate = () => {
      setDotPosition((prev) => ({
        x: lerp(prev.x, position.x, 0.05),
        y: lerp(prev.y, position.y, 0.05),
      }))
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler)
      document.removeEventListener("mouseenter", mouseEnterHandler)
      document.removeEventListener("mouseleave", mouseLeaveHandler)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [position])

  useEffect(() => {
    if (hoverElement && dotRef.current && overlayRef.current) {
      const dotRect = dotRef.current.getBoundingClientRect()
      const elementRect = hoverElement.getBoundingClientRect()
      
      overlayRef.current.style.left = `${elementRect.left}px`
      overlayRef.current.style.top = `${elementRect.top}px`
      overlayRef.current.style.width = `${elementRect.width}px`
      overlayRef.current.style.height = `${elementRect.height}px`

      const clipPath = `circle(${dotRect.width / 2}px at ${dotRect.left - elementRect.left + dotRect.width / 2}px ${dotRect.top - elementRect.top + dotRect.height / 2}px)`
      overlayRef.current.style.clipPath = clipPath
      overlayRef.current.style.webkitClipPath = clipPath
      overlayRef.current.style.display = "block"
    } else if (overlayRef.current) {
      overlayRef.current.style.display = "none"
    }
  }, [hoverElement, dotPosition])

  if (typeof window === "undefined") return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[998] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          opacity: isVisible ? 1 : 0,
          width: isHovering ? "60px" : "20px",
          height: isHovering ? "60px" : "20px",
          backgroundColor: "#fff",
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
          transition: "transform 1s ease-out, opacity .5s ease, width .5s ease-out, height .5s ease-out",
        }}
      />
      <div
        ref={overlayRef}
        className="pointer-events-none fixed z-[999] bg-black mix-blend-difference"
        style={{
          display: "none",
        }}
      />
    </>
  )
}