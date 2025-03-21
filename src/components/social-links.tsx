import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export const SocialLinks = () => {
  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={30} />, url: "https://facebook.com" },
    { name: "Twitter", icon: <Twitter size={30} />, url: "https://twitter.com" },
    { name: "Instagram", icon: <Instagram size={30} />, url: "https://instagram.com" },
    { name: "LinkedIn", icon: <Linkedin size={30} />, url: "https://github.com/dexSamir" },
    { name: "GitHub", icon: <Github size={30} />, url: "https://github.com/dexSamir" },
  ]

  return (
    <div className="flex space-x-2 mt-4">
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white mix-blend-difference hover:text-white transition-colors duration-200"
          whileHover={{ scale: 1.2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
          aria-label={link.name}
        >
          {link.icon}
        </motion.a>
      ))}
    </div>
  )
}