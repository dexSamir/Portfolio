import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypingEffectProps {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenTexts?: number
}

export const TypingEffect = ({
  texts,
  typingSpeed = 150,
  deletingSpeed = 50,
  delayBetweenTexts = 1500,
}: TypingEffectProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = texts[currentTextIndex]

        setCurrentText((prev) =>
          isDeleting ? prev.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1),
        )

        if (!isDeleting && currentText === fullText) {
          setTimeout(() => setIsDeleting(true), delayBetweenTexts)
        }
        else if (isDeleting && currentText === "") {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => clearTimeout(timeout)
  }, [currentText, currentTextIndex, isDeleting, texts, typingSpeed, deletingSpeed, delayBetweenTexts])

  return (
    <div className="inline-flex">
      <span className="text-primary">{currentText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
        className="ml-1 w-[2px] h-8 bg-primary inline-block"
      />
    </div>
  )
}

