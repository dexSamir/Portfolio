import { useEffect, useState } from "react";
import { safeExternalUrl } from "@/lib/safe-url";
import { errorMessage } from "@/services/http";
import { invalidatePublicCache } from "@/services/public-cache";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { ProjectsPageSkeleton } from "@/components/loading-skeleton";
import { getProjects } from "@/services/apiService";
import { getProjectImageUrl } from "@/lib/image-utils";
import type { Project } from "@/types/data-types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const projectsData = await getProjects();
        if (active) setProjects(projectsData);
      } catch (err) {
        if (active) setError(errorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => { active = false; };
  }, [attempt]);

  if (loading) {
    return <ProjectsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-red-400">
          <h2 className="text-2xl font-bold mb-4">Error Loading Projects</h2>
          <p role="alert">{error}</p>
          <button className="mt-4 text-primary" onClick={() => { invalidatePublicCache(); setAttempt(n => n + 1); }}>Try again</button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-center mb-12 text-glow"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Projects
          </motion.h1>

          {projects.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="text-xl">No projects available yet.</p>
              <p className="mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 border border-primary/10 hover:border-primary/30"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      src={
                        getProjectImageUrl(project.imageUrl) ||
                        "/placeholder.svg"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "/placeholder.svg?height=192&width=384";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                      {project.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech.id}
                          className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {safeExternalUrl(project.githubUrl) && (
                        <a
                          href={safeExternalUrl(project.githubUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Github size={18} />
                          <span>GitHub</span>
                        </a>
                      )}
                      {safeExternalUrl(project.liveUrl) && (
                        <a
                          href={safeExternalUrl(project.liveUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <ExternalLink size={18} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
