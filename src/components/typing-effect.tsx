import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

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
  const reducedMotion = useReducedMotion();
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fullText = texts[currentTextIndex] ?? "";
    if (!texts.length || reducedMotion) return;
    const finished = !isDeleting && currentText === fullText;
    const timeout = setTimeout(() => {
      if (finished) setIsDeleting(true);
      else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        setCurrentText(isDeleting ? currentText.slice(0, -1) : fullText.slice(0, currentText.length + 1));
      }
    }, finished ? delayBetweenTexts : isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [reducedMotion, currentText, currentTextIndex, isDeleting, texts, typingSpeed, deletingSpeed, delayBetweenTexts])

  if (reducedMotion) return <span className="text-primary">{texts[0] || ""}</span>;
  return (
    <span className="inline-flex max-w-full"><span className="sr-only">{texts[0]}</span>
      <span aria-hidden="true" className="text-primary">{currentText}</span>
      <motion.span aria-hidden="true"
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
        className="ml-1 w-[2px] h-8 bg-primary inline-block"
      />
    </span>
  )
}

