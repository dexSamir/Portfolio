import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Plus,
  Star,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { AdminGuard } from "@/components/admin-guard";
import {
  addProject,
  addTestimonial,
  updateProject,
} from "@/services/localDataService";
import { getProjectById } from "@/services/apiService";
import type { Project } from "@/types/data-types";

export default function AdminCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") || "project";
  const isEdit = searchParams.get("edit") === "true";

  return (
    <AdminGuard>
      <div className="min-h-screen gradient-bg p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 bg-black/30 rounded-lg hover:bg-black/40 transition-colors mr-4"
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isEdit ? "Edit" : "Create New"}{" "}
              {type === "project" ? "Project" : "Testimonial"}
            </h1>
          </div>

          {type === "project" ? (
            <ProjectForm isEdit={isEdit} />
          ) : (
            <TestimonialForm />
          )}
        </div>
      </div>
    </AdminGuard>
  );
}

const ProjectForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<
    Omit<Project, "createdAt"> & { _id?: string; createdAt?: string }
  >({
    _id: "",
    name: "",
    description: "",
    image: "",
    technologies: [""],
    githubUrl: "",
    liveUrl: "",
    createdAt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTech, setNewTech] = useState("");
  const [availableTechs, setAvailableTechs] = useState([
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Firebase",
    "AWS",
    "Docker",
    "GraphQL",
    "Redux",
    "Framer Motion",
    "ASP.NET Core",
    "C#",
  ]);

  useEffect(() => {
    if (isEdit) {
      const editingProjectJson = localStorage.getItem("editingProject");
      if (editingProjectJson) {
        try {
          const editingProject = JSON.parse(editingProjectJson);
          const fetchProject = async () => {
            try {
              const projectData = await getProjectById(editingProject._id);
              setFormData(projectData);

              const newTechs = projectData.technologies.filter(
                (tech: string) => !availableTechs.includes(tech)
              );

              if (newTechs.length > 0) {
                setAvailableTechs((prev) => [...prev, ...newTechs]);
              }
            } catch (err) {
              console.error("Error fetching project for edit:", err);
              setError(
                "Failed to load project data for editing. Please try again."
              );
            }
          };
          fetchProject();
        } catch (error) {
          console.error(
            "Error parsing editing project from local storage:",
            error
          );
          setError("Failed to load project data for editing");
        }
      }
    }
  }, [isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          image: event.target?.result as string,
        }));
        setError(null);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleTechSelect = (tech: string) => {
    if (formData.technologies.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        technologies: prev.technologies.filter((t) => t !== tech),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        technologies: [
          ...prev.technologies.filter((t) => t.trim() !== ""),
          tech,
        ],
      }));
    }
    setError(null);
  };

  const addNewTechnology = () => {
    if (!newTech.trim()) return;

    if (
      availableTechs.includes(newTech) ||
      formData.technologies.includes(newTech)
    ) {
      setError("This technology already exists");
      return;
    }

    setAvailableTechs((prev) => [...prev, newTech]);

    setFormData((prev) => ({
      ...prev,
      technologies: [
        ...prev.technologies.filter((t) => t.trim() !== ""),
        newTech,
      ],
    }));

    setNewTech("");
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Project title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Project description is required");
      return false;
    }

    if (
      formData.technologies.filter((tech) => tech.trim() !== "").length === 0
    ) {
      setError("At least one technology must be selected");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEdit && formData._id) {
        await updateProject({
          _id: formData._id,
          name: formData.name,
          description: formData.description,
          image: formData.image || undefined,
          technologies: formData.technologies.filter(
            (tech) => tech.trim() !== ""
          ),
          githubUrl: formData.githubUrl || undefined,
          liveUrl: formData.liveUrl || undefined,
          createdAt: formData.createdAt || new Date().toISOString(),
        });

        setSuccess("Project updated successfully!");
      } else {
        await addProject({
          name: formData.name,
          description: formData.description,
          image: formData.image || undefined,
          technologies: formData.technologies.filter(
            (tech) => tech.trim() !== ""
          ),
          githubUrl: formData.githubUrl || undefined,
          liveUrl: formData.liveUrl || undefined,
        });

        setSuccess("Project created successfully!");
      }

      localStorage.removeItem("editingProject");

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} project:`,
        error
      );
      setError(
        `Failed to ${isEdit ? "update" : "create"} project. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card rounded-xl p-6 sm:p-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {" "}
              Project Title *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Describe your project in detail..."
            ></textarea>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Image
            </label>
            <div className="flex gap-4 mb-2">
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="flex-1 px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://example.com/image.jpg"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors cursor-pointer"
              >
                <Upload size={18} className="text-primary" />
                <span>Upload</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mb-4">
              You can enter an image URL or upload an image from your computer.
            </p>
            {formData.image && (
              <div className="mt-4 relative w-full max-w-xs">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                    setError(
                      "Failed to load image. Please check the URL or upload another image."
                    );
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Technologies *
            </label>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                className="flex-1 px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Add new technology..."
              />
              <button
                type="button"
                onClick={addNewTechnology}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
              >
                <Plus size={18} className="text-primary" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {availableTechs.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechSelect(tech)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    formData.technologies.includes(tech)
                      ? "bg-primary text-black font-medium"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Click on technologies to select/deselect them. Selected
              technologies:{" "}
              {formData.technologies
                .filter((t) => t.trim() !== "")
                .join(", ") || "None"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium mb-2"
              >
                GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label
                htmlFor="liveUrl"
                className="block text-sm font-medium mb-2"
              >
                Live Demo URL
              </label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://myproject.com"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
              ) : (
                <>
                  <Save size={18} />
                  <span>{isEdit ? "Update" : "Save"} Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const TestimonialForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    avatar: "",
    content: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target?.result as string,
        }));
        setError(null);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Client name is required");
      return false;
    }
    if (!formData.position.trim()) {
      setError("Position is required");
      return false;
    }
    if (!formData.company.trim()) {
      setError("Company is required");
      return false;
    }
    if (!formData.content.trim()) {
      setError("Testimonial content is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await addTestimonial({
        name: formData.name,
        position: formData.position,
        company: formData.company,
        avatar: formData.avatar || undefined,
        content: formData.content,
        rating: formData.rating,
      });

      setSuccess("Testimonial created successfully!");

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      setError("Failed to create testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card rounded-xl p-6 sm:p-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Client Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium mb-2"
              >
                Avatar
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="https://example.com/avatar.jpg"
                />
                <label
                  htmlFor="avatar-upload"
                  className="p-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors cursor-pointer"
                >
                  <Upload size={18} className="text-primary" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400 mb-4">
                You can enter an avatar URL or upload an image from your
                computer.
              </p>
              {formData.avatar && (
                <div className="mt-2 relative w-16 h-16">
                  <img
                    src={formData.avatar || "/placeholder.svg"}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                      setError(
                        "Failed to load avatar image. Please check the URL or upload another image."
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium mb-2"
              >
                Position *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="CEO"
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium mb-2"
              >
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Testimonial Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Write the client's testimonial here..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={
                      star <= formData.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Testimonial</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
