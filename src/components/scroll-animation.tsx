"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { motion, useInView, useAnimation, type Variant } from "framer-motion"

type FadeDirections = "up" | "down" | "left" | "right" | "none"

interface ScrollAnimationProps {
  children: ReactNode
  direction?: FadeDirections
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  once?: boolean
}

const variants = {
  hidden: (direction: FadeDirections): Variant => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 50 }
      case "down":
        return { opacity: 0, y: -50 }
      case "left":
        return { opacity: 0, x: 50 }
      case "right":
        return { opacity: 0, x: -50 }
      default:
        return { opacity: 0 }
    }
  },
  visible: { opacity: 1, y: 0, x: 0 },
}

export const ScrollAnimation = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = "",
  once = true,
}: ScrollAnimationProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { threshold, once })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [controls, inView, once])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      custom={direction}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const StaggerContainer = ({
  children,
  delay = 0.15,
  staggerDelay = 0.1,
  className = "",
}: {
  children: ReactNode
  delay?: number
  staggerDelay?: number
  className?: string
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

