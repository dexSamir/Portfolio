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
  createProject,
  updateProject,
  getProjectById,
  getTechnologies,
  createTechnology,
  createTestimonial,
} from "@/services/apiService";
import type { Technology } from "@/types/data-types";


// const _addTechnology = createTechnology;
// const _addProject = createProject;
// const _addTestimonial = createTestimonial;

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
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    createdTime?: string;
  }>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    technologies: [],
    githubUrl: "",
    liveUrl: "",
    createdTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availableTechs, setAvailableTechs] = useState<Technology[]>([]);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
  const [isLoadingTechs, setIsLoadingTechs] = useState(false);
  const [newTechName, setNewTechName] = useState<string>("");
  const [isAddingTech, setIsAddingTech] = useState(false);

  const handleAddNewTechnology = async () => {
    if (!newTechName.trim()) {
      setError("Technology name is required");
      return;
    }

    try {
      setIsAddingTech(true);
      // Call API to create new technology
      const newTech = await createTechnology({ name: newTechName });

      // Add to available techs
      setAvailableTechs((prev) => [...prev, newTech]);

      // Select the new technology
      setSelectedTechIds((prev) => [...prev, newTech.id]);

      // Clear input
      setNewTechName("");
      setError(null);
    } catch (error) {
      console.error("Error adding technology:", error);
      setError("Failed to add new technology. Please try again.");
    } finally {
      setIsAddingTech(false);
    }
  };

  useEffect(() => {
    const fetchTechnologies = async () => {
      setIsLoadingTechs(true);
      try {
        const techs = await getTechnologies();
        setAvailableTechs(techs);
      } catch (err) {
        console.error("Error fetching technologies:", err);
        setError("Failed to load technologies from server");
      } finally {
        setIsLoadingTechs(false);
      }
    };

    fetchTechnologies();

    if (isEdit) {
      const editingProjectJson = localStorage.getItem("editingProject");
      if (editingProjectJson) {
        try {
          const editingProject = JSON.parse(editingProjectJson);
          const fetchProject = async () => {
            try {
              const projectData = await getProjectById(editingProject.id);
              setFormData({
                id: projectData.id,
                title: projectData.title,
                description: projectData.description,
                imageUrl: projectData.imageUrl || "",
                technologies: projectData.technologies.map((t) => t.id),
                githubUrl: projectData.githubUrl || "",
                liveUrl: projectData.liveUrl || "",
                createdTime: projectData.createdTime,
              });
              setSelectedTechIds(projectData.technologies.map((t) => t.id));
            } catch (err) {
              console.error("Error fetching project for edit:", err);
              setError(
                "Failed to load project data for editing. Please try again.",
              );
            }
          };
          fetchProject();
        } catch (error) {
          console.error(
            "Error parsing editing project from local storage:",
            error,
          );
          setError("Failed to load project data for editing");
        }
      }
    }
  }, [isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string>("");
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    setProjectImage(file);
    setFormData((prev) => ({
      ...prev,
      imageUrl: file.name,
    }));
    // Create preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setProjectImagePreview(previewUrl);
    setError(null);
  };

  const handleTechSelect = (techId: string) => {
    if (selectedTechIds.includes(techId)) {
      setSelectedTechIds((prev) => prev.filter((id) => id !== techId));
    } else {
      setSelectedTechIds((prev) => [...prev, techId]);
    }
    setError(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Project title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Project description is required");
      return false;
    }

    if (selectedTechIds.length === 0) {
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
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      if (projectImage) {
        formDataObj.append("imageUrl", projectImage);
      }
      formDataObj.append("githubUrl", formData.githubUrl || "");
      formDataObj.append("liveUrl", formData.liveUrl || "");

      // Append technology IDs
      selectedTechIds.forEach((id) => {
        formDataObj.append("technologyIds", id);
      });

      if (isEdit && formData.id) {
        await updateProject(formData.id, formDataObj);
        setSuccess("Project updated successfully!");
      } else {
        await createProject(formDataObj);
        setSuccess("Project created successfully!");
      }

      localStorage.removeItem("editingProject");

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} project:`,
        error,
      );
      setError(
        `Failed to ${isEdit ? "update" : "create"} project. Please try again.`,
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
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              {" "}
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
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
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium mb-2"
            >
              Image
            </label>
            <div className="flex gap-4 mb-2">
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
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
            {(projectImagePreview || formData.imageUrl) && (
              <div className="mt-4 relative w-full max-w-xs">
                <img
                  src={
                    projectImagePreview ||
                    formData.imageUrl ||
                    "/placeholder.svg"
                  }
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                    setError(
                      "Failed to load image. Please check the URL or upload another image.",
                    );
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Technologies *{" "}
              {isLoadingTechs && (
                <span className="text-gray-400">(Loading...)</span>
              )}
            </label>

            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewTechnology();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Add new technology..."
                  disabled={isAddingTech}
                />
                <button
                  type="button"
                  onClick={handleAddNewTechnology}
                  disabled={isAddingTech || !newTechName.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {availableTechs.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => handleTechSelect(tech.id)}
                    disabled={isLoadingTechs}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedTechIds.includes(tech.id)
                        ? "bg-primary text-black font-medium"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                    }`}
                  >
                    {tech.name}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Click on technologies to select/deselect them. Selected
              technologies:{" "}
              {selectedTechIds.length > 0
                ? availableTechs
                    .filter((t) => selectedTechIds.includes(t.id))
                    .map((t) => t.name)
                    .join(", ")
                : "None"}
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
    fullName: "",
    position: "",
    company: "",
    message: "",
    rating: 5,
  });
  const [testimonialImage, setTestimonialImage] = useState<File | null>(null);
  const [testimonialImagePreview, setTestimonialImagePreview] =
    useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    setTestimonialImage(file);
    const previewUrl = URL.createObjectURL(file);
    setTestimonialImagePreview(previewUrl);
    setError(null);
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
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
    if (!formData.message.trim()) {
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
      const formDataObj = new FormData();
      formDataObj.append("fullName", formData.fullName);
      formDataObj.append("position", formData.position);
      formDataObj.append("company", formData.company);
      formDataObj.append("message", formData.message);
      formDataObj.append("rating", String(formData.rating));
      if (testimonialImage) {
        formDataObj.append("profileImage", testimonialImage);
      }

      await createTestimonial(formDataObj);

      setSuccess(
        "Testimonial created successfully! It is awaiting admin approval.",
      );

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
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
              >
                Client Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium mb-2"
              >
                Avatar
              </label>
              <div className="flex gap-2 mb-2">
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
                Upload your profile image.
              </p>
              {(testimonialImagePreview || testimonialImage) && (
                <div className="mt-2 relative w-16 h-16">
                  <img
                    src={testimonialImagePreview || "/placeholder.svg"}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
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
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Testimonial Content *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
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
