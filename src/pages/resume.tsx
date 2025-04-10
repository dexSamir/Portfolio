"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Code, Languages, FileDown } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { ScrollAnimation } from "@/components/scroll-animation";
import { PageSkeleton } from "@/components/loading-skeleton";

export default function ResumePage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "samir-habibov-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
    }, 1500);
  };

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              <div>
                <ScrollAnimation direction="up">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    My Resume
                  </h1>
                  <div className="h-1 w-20 bg-primary mb-4"></div>
                  <p className="text-xl text-gray-300 max-w-2xl">
                    Here's a summary of my education, work experience, and
                    skills. Feel free to download my full resume.
                  </p>
                </ScrollAnimation>
              </div>
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                className="hover-element button-like mt-6 md:mt-0 flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isDownloading
                    ? {
                        y: [0, -5, 0],
                        transition: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 0.5,
                        },
                      }
                    : {}
                }
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={20} />
                    <span>Download CV</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ScrollAnimation direction="left">
                  <div className="glass-card rounded-xl p-8 mb-8">
                    <div className="flex items-center mb-8">
                      <div className="bg-primary/20 p-3 rounded-full mr-3">
                        <Code className="text-primary" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold">Skills</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">React</span>
                          <span>90%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "90%" }}
                            transition={{ duration: 1, delay: 0.1 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">JavaScript</span>
                          <span>85%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">TypeScript</span>
                          <span>80%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "80%" }}
                            transition={{ duration: 1, delay: 0.3 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">C#</span>
                          <span>85%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">ASP.NET Core</span>
                          <span>80%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "80%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">SQL</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "75%" }}
                            transition={{ duration: 1, delay: 0.6 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">HTML/CSS</span>
                          <span>95%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "95%" }}
                            transition={{ duration: 1, delay: 0.7 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Tailwind CSS</span>
                          <span>90%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "90%" }}
                            transition={{ duration: 1, delay: 0.8 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-8">
                    <div className="flex items-center mb-8">
                      <div className="bg-primary/20 p-3 rounded-full mr-3">
                        <Languages className="text-primary" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold">Languages</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">English</span>
                          <span>B1</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "90%" }}
                            transition={{ duration: 1, delay: 0.1 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Azerbaijani</span>
                          <span>Native</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Russian</span>
                          <span>A2</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "70%" }}
                            transition={{ duration: 1, delay: 0.3 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Turkish</span>
                          <span>C1</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: "65%" }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>

              <div className="lg:col-span-2">
                <ScrollAnimation direction="right">
                  <div className="glass-card rounded-xl p-8 mb-8">
                    <div className="flex items-center mb-8">
                      <div className="bg-primary/20 p-3 rounded-full mr-3">
                        <GraduationCap className="text-primary" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold">Education</h2>
                    </div>

                    <div className="space-y-8">
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
                        <h3 className="text-xl font-semibold">
                          Bachelor of Computer Science
                        </h3>
                        <p className="text-lg text-gray-300">
                          Baku State University
                        </p>
                        <div className="flex flex-wrap justify-between text-gray-400 mt-2">
                          <span>Baku, Azerbaijan</span>
                          <span>2022 - Present</span>
                        </div>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
                        <h3 className="text-xl font-semibold">
                          Bachelor of Computer Science
                        </h3>
                        <p className="text-lg text-gray-300">SABAH Groups</p>
                        <div className="flex flex-wrap justify-between text-gray-400 mt-2">
                          <span>Baku, Azerbaijan</span>
                          <span>2023 - Present</span>
                        </div>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
                        <h3 className="text-xl font-semibold">
                          Full-stack Backend Oriented
                        </h3>
                        <p className="text-lg text-gray-300">Udemy</p>
                        <div className="flex flex-wrap justify-between text-gray-400 mt-2">
                          <span>Online</span>
                          <span>2024 - 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="glass-card rounded-xl p-8 mb-8">
                    <div className="flex items-center mb-8">
                      <div className="bg-primary/20 p-3 rounded-full mr-3">
                        <Briefcase className="text-primary" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold">Experience</h2>
                    </div>

                    <div className="space-y-8">
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
                        <h3 className="text-xl font-semibold">Junior Web Developer</h3>
                        <p className="text-lg text-gray-300">Freelance</p>
                        <div className="flex flex-wrap justify-between text-gray-400 mt-2">
                          <span>Remote</span>
                          <span>2022 - Present</span>
                        </div>
                        <p className="text-gray-300 mt-3">
                          Developing responsive websites and web applications for clients using React, Next.js, and
                          ASP.NET Core. Implementing modern UI designs with Tailwind CSS and Framer Motion.
                        </p>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
                        <h3 className="text-xl font-semibold">Web Development Intern</h3>
                        <p className="text-lg text-gray-300">Tech Solutions LLC</p>
                        <div className="flex flex-wrap justify-between text-gray-400 mt-2">
                          <span>Baku, Azerbaijan</span>
                          <span>Summer 2021</span>
                        </div>
                        <p className="text-gray-300 mt-3">
                          Assisted in developing and maintaining client websites. Worked with HTML, CSS, JavaScript, and
                          WordPress. Collaborated with senior developers to implement new features and fix bugs.
                        </p>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="glass-card rounded-xl p-8">
                    <div className="flex items-center mb-8">
                      <div className="bg-primary/20 p-3 rounded-full mr-3">
                        <Award className="text-primary" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold">Certifications & Awards</h2>
                    </div>

                    <StaggerContainer>
                      <StaggerItem className="flex items-start mb-4 p-4 bg-black/30 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full mr-3"></div>
                        </div>
                        <p className="text-gray-300">React Developer Certification - Udemy (2022)</p>
                      </StaggerItem>

                      <StaggerItem className="flex items-start mb-4 p-4 bg-black/30 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full mr-3"></div>
                        </div>
                        <p className="text-gray-300">ASP.NET Core MVC Certification - Microsoft (2022)</p>
                      </StaggerItem>

                      <StaggerItem className="flex items-start mb-4 p-4 bg-black/30 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full mr-3"></div>
                        </div>
                        <p className="text-gray-300">JavaScript Algorithms and Data Structures - freeCodeCamp (2021)</p>
                      </StaggerItem>

                      <StaggerItem className="flex items-start mb-4 p-4 bg-black/30 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full mr-3"></div>
                        </div>
                        <p className="text-gray-300">
                          3rd Place - National Programming Competition for Students (2020)
                        </p>
                      </StaggerItem>

                      <StaggerItem className="flex items-start p-4 bg-black/30 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full mr-3"></div>
                        </div>
                        <p className="text-gray-300">Responsive Web Design Certification - freeCodeCamp (2020)</p>
                      </StaggerItem>
                    </StaggerContainer>
                  </div> */}
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  );
}
