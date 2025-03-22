import { type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const fadeInUp = {
  initial: {
    y: 20,
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    y: -20,
    opacity: 0,
    scale: 0.98,
  },
  transition: {
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1],
  },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={stagger}
      >
        <motion.div
          variants={fadeInUp}
          style={{
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Optional components for more granular animations
export const TransitionItem = motion.div

export const FadeIn = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1],
    }}
  >
    {children}
  </motion.div>
)

export const SlideIn = ({ children, delay = 0, direction = "right", className }: {
  children: ReactNode;
  delay?: number;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}) => {
  const directionMap = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: -20 },
    down: { x: 0, y: 20 },
  }

  const initial = directionMap[direction]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initial }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  )
}