"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, MapPin, Phone, Mail } from "lucide-react";
import { PageTransition } from "../components/page-transition";
import { SocialLinks } from "../components/social-links";
import { TypingEffect } from "../components/typing-effect";
import { ScrollAnimation } from "../components/scroll-animation";
import { PageSkeleton } from "../components/loading-skeleton";

export default function HomePage() {
  const roles = [
    "Fullstack Developer",
    "ASP.NET Core Expert",
    "React Developer",
    "JavaScript Enthusiast",
    "C# Developer",
  ];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <PageSkeleton>
      <PageTransition>
        <div
          className="gradient-bg min-h-screen relative overflow-hidden"
          ref={containerRef}
        >
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-primary/20"
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                }}
                animate={{
                  y: [0, Math.random() * -100 - 50],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <motion.div style={{ y, opacity }}>
            <div className="container mx-auto px-4 pt-24 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <ScrollAnimation
                  direction="left"
                  className="md:col-span-5 lg:col-span-4"
                >
                  <div className="relative rounded-3xl overflow-hidden glass-card p-6 border border-primary/10 hover:border-primary/30 transition-all duration-500">
                    <motion.div
                      className="aspect-square relative rounded-3xl overflow-hidden mb-6"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src="{../imgs/me.png}"
                        alt="Samir Habibov"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    <SocialLinks />

                    <motion.div className="mt-6 space-y-4">
                      <motion.div
                        className="flex items-center gap-3 hover-element p-2 rounded-lg hover:bg-black/30"
                        whileHover={{ x: 5 }}
                      >
                        <Calendar className="text-primary" size={18} />
                        <span className="text-sm text-gray-300">
                          19.03.1988
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-3 hover-element p-2 rounded-lg hover:bg-black/30"
                        whileHover={{ x: 5 }}
                      >
                        <Phone className="text-primary" size={18} />
                        <span className="text-sm text-gray-300">
                          +994 50 622 93 28
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-3 hover-element p-2 rounded-lg hover:bg-black/30"
                        whileHover={{ x: 5 }}
                      >
                        <Mail className="text-primary" size={18} />
                        <span className="text-sm text-gray-300">
                          hebibovsamir26@gmail.com
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-3 hover-element p-2 rounded-lg hover:bg-black/30"
                        whileHover={{ x: 5 }}
                      >
                        <MapPin className="text-primary" size={18} />
                        <span className="text-sm text-gray-300">
                          Baku, Azerbaijan
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation
                  direction="right"
                  delay={0.3}
                  className="md:col-span-7 lg:col-span-8"
                >
                  <motion.h2
                    className="text-xl mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Hello Everyone 👋
                  </motion.h2>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-glow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    I&apos;m Samir Habibov
                  </motion.h1>

                  <motion.h2
                    className="text-2xl md:text-3xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    I am a <TypingEffect texts={roles} />
                  </motion.h2>

                  <motion.div
                    className="h-px w-full bg-gradient-to-r from-primary/50 to-transparent my-8"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />

                  <motion.p
                    className="text-lg text-gray-300 mb-8 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    Aspiring full-stack developer with expertise in ASP.NET
                    Core, C#, React, JavaScript, and database management (MS
                    SQL, PostgreSQL). Passionate about building scalable web
                    applications and continuously improving my technical skills.
                    Actively contributing to personal projects and open-source
                    platforms to grow as a professional in the software
                    development field.
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <Link
                      to="/projects"
                      className="hover-element button-like bg-primary text-black px-8 py-4 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                    >
                      View Projects
                    </Link>

                    <Link
                      to="/resume"
                      className="hover-element button-like border border-primary text-primary px-8 py-4 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
                    >
                      Download CV
                    </Link>
                  </motion.div>
                </ScrollAnimation>
              </div>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </PageSkeleton>
  );
}
