"use client";
import { motion } from "framer-motion";
import { Download, Award, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "../components/ui/button";
import { PageTransition } from "../components/page-transition";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "../components/scroll-animation";
import { PageSkeleton } from "../components/loading-skeleton";

export default function ResumePage() {
  const cvUrl = "/imgs/resume/Samir_Habibov_CV.pdf";
  const skills = [
    { name: "ASP.NET Core MVC", level: 90 },
    { name: "ASP.NET Web API", level: 85 },
    { name: "C#", level: 90 },
    { name: "Entity Framework Core", level: 80 },
    { name: "JavaScript", level: 85 },
    { name: "React", level: 80 },
    { name: "HTML/CSS", level: 90 },
    { name: "SQL (MS SQL, PostgreSQL)", level: 85 },
    { name: "Git/GitHub", level: 80 },
    { name: "Tailwind CSS", level: 75 },
  ];

  const education = [
    {
      institution: "Baku State University",
      degree: "Bachelor of Arts: Computer Science",
      period: "09/2022 - Current",
      location: "Baku, Azerbaijan",
    },
    {
      institution: "SABAH Groups",
      degree: "Bachelor of Arts: Computer Science",
      period: "09/2023 - Current",
      location: "Baku, Azerbaijan",
    },
    {
      institution: "Code Academy",
      degree: "Fullstack Backend Oriented",
      period: "09/2024 - 01/2025",
      location: "Baku, Azerbaijan",
    },
  ];

  const experience = [
    {
      position: "Faculty Administration Board Member",
      company: "Baku State University",
      period: "November 2024 - Present",
      description: "Serving as a student representative in faculty management.",
    },
    {
      position: "Volunteer",
      company: "Baku State University Volunteer Program",
      period: "March 2023 - Present",
      description:
        "Actively participating in university events, contributing to organization and coordination processes.",
    },
  ];

  const awards = [
    'NP-3 (Newbie Programmers - "Yeni Başlayan Proqramçılar") · 1st place (champion)',
    "ICPC 2024-25 Azerbaijan Qualification (13.10.2024)",
    '"Hand in Hand for Karabakh" ASAN Innovative Solutions Hackathon (08 - 09.11.2023)',
    '"GeoPark Innovate" Hackathon (05 - 06.10.2024)',
    '"Code8 2024" Hackathon (06.12.2024)',
  ];

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen">
          <div className="container mx-auto px-4 pt-24 pb-16">
            <ScrollAnimation>
              <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-3">
                    My Resume
                  </h1>
                  <div className="h-1 w-20 bg-primary mb-4"></div>
                  <p className="text-xl text-gray-300">
                    Professional background and skills
                  </p>
                </div>

                <Button
                  className="hover-element button-like mt-4 md:mt-0 bg-primary text-black hover:bg-primary/80 transition-all duration-300"
                  size="lg"
                >
                  <a href={cvUrl} download>
                    <Download className="mr-2 h-5 w-5 " />
                    Download CV
                  </a>
                </Button>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ScrollAnimation direction="left" className="lg:col-span-1">
                <div className="glass-card rounded-xl p-8 mb-8 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <h2 className="text-2xl font-bold mb-8 flex items-center">
                    <span className="bg-primary/20 p-2 rounded-lg mr-3">
                      <Award className="h-5 w-5 text-primary" />
                    </span>
                    <span>Skills</span>
                  </h2>

                  <div className="space-y-6">
                    {skills.map((skill, index) => (
                      <StaggerItem key={index}>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-primary font-semibold">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-3 backdrop-blur-sm">
                            <motion.div
                              className="bg-gradient-to-r from-primary/80 to-primary h-3 rounded-full relative overflow-hidden"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{
                                duration: 1,
                                delay: 0.2 + index * 0.1,
                              }}
                              viewport={{ once: true }}
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite]"></div>
                            </motion.div>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-8 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <h2 className="text-2xl font-bold mb-8 flex items-center">
                    <span className="bg-primary/20 p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12h5m10 0h5" />
                        <path d="M12 2v20" />
                        <path d="M9 9h6" />
                        <path d="M9 15h6" />
                      </svg>
                    </span>
                    <span>Languages</span>
                  </h2>

                  <StaggerContainer>
                    <StaggerItem>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Azerbaijani</span>
                          <span className="text-primary font-medium">
                            Native
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-primary/80 to-primary h-3 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Turkish</span>
                          <span className="text-primary font-medium">
                            Fluent
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-primary/80 to-primary h-3 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "95%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">English</span>
                          <span className="text-primary font-medium">
                            B1 (Intermediate)
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-primary/80 to-primary h-3 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "65%" }}
                            transition={{ duration: 1, delay: 0.4 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Russian</span>
                          <span className="text-primary font-medium">
                            Intermediate
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-primary/80 to-primary h-3 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "60%" }}
                            transition={{ duration: 1, delay: 0.6 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    </StaggerItem>
                  </StaggerContainer>
                </div>
              </ScrollAnimation>

              <ScrollAnimation
                direction="right"
                delay={0.3}
                className="lg:col-span-2"
              >
                <div className="glass-card rounded-xl p-8 mb-8 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <h2 className="text-2xl font-bold mb-8 flex items-center">
                    <span className="bg-primary/20 p-2 rounded-lg mr-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </span>
                    <span>Education</span>
                  </h2>

                  <StaggerContainer>
                    {education.map((edu, index) => (
                      <StaggerItem key={index}>
                        <div className="relative pl-8 pb-8 hover-element">
                          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                          <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,0,0.5)]"></div>

                          <h3 className="text-2xl font-semibold mb-1">
                            {edu.institution}
                          </h3>
                          <p className="text-primary font-medium text-lg mb-2">
                            {edu.degree}
                          </p>
                          <div className="flex flex-wrap justify-between text-sm text-gray-400">
                            <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                              {edu.period}
                            </span>
                            <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                              {edu.location}
                            </span>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>

                <div className="glass-card rounded-xl p-8 mb-8 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <h2 className="text-2xl font-bold mb-8 flex items-center">
                    <span className="bg-primary/20 p-2 rounded-lg mr-3">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </span>
                    <span>Experience</span>
                  </h2>

                  <StaggerContainer>
                    {experience.map((exp, index) => (
                      <StaggerItem key={index}>
                        <div className="relative pl-8 pb-8 hover-element">
                          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                          <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,0,0.5)]"></div>

                          <h3 className="text-2xl font-semibold mb-1">
                            {exp.position}
                          </h3>
                          <p className="text-primary font-medium text-lg mb-2">
                            {exp.company}
                          </p>
                          <p className="bg-black/30 inline-block px-3 py-1 rounded-full backdrop-blur-sm text-sm text-gray-400 mb-3">
                            {exp.period}
                          </p>
                          <p className="text-gray-300">{exp.description}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>

                <div className="glass-card rounded-xl p-8 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <h2 className="text-2xl font-bold mb-8 flex items-center">
                    <span className="bg-primary/20 p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v6.5l3-3" />
                        <path d="M12 8.5V15l-3-3" />
                        <path d="M17 8l-5 5" />
                        <path d="M19 9a7 7 0 1 1-14 0a7 7 0 0 1 14 0z" />
                        <path d="M12 16v6" />
                      </svg>
                    </span>
                    <span>Awards & Honors</span>
                  </h2>

                  <StaggerContainer>
                    {awards.map((award, index) => (
                      <StaggerItem key={index}>
                        <div className="flex items-start mb-4 p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300 hover-element">
                          <div className="flex-shrink-0 mt-1">
                            <span className="inline-block w-2.5 h-2.5 bg-primary rounded-full mr-3 animate-pulse"></span>
                          </div>
                          <p>{award}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  );
}
