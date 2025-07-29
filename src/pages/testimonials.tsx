import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { PageSkeleton } from "@/components/loading-skeleton";
import { AddTestimonialDialog } from "@/components/add-testimonial-dialog";
import { getTestimonials } from "@/services/localDataService";
import type { Testimonial } from "@/types/data-types";
import { ScrollAnimation } from "@/components/scroll-animation";

const MAX_CONTENT_LENGTH = 200;

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTestimonialDialogOpen, setIsAddTestimonialDialogOpen] =
    useState(false);
  const [showFullContent, setShowFullContent] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data.filter((t) => t.status === "approved"));
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      setError("Failed to load testimonials. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleTestimonialAdded = () => {
    setIsAddTestimonialDialogOpen(false);
    fetchTestimonials();
  };

  const toggleShowFullContent = (id: string) => {
    setShowFullContent((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <PageSkeleton children />;
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center text-red-400">
            <h2 className="text-2xl font-bold mb-4">
              Error Loading Testimonials
            </h2>
            <p>{error}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="gradient-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <div>
              <ScrollAnimation direction="up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Client Testimonials
                </h1>
                <div className="h-1 w-20 bg-primary mb-4"></div>
                <p className="text-xl text-gray-300 max-w-2xl">
                  Hear what my clients and colleagues have to say about working
                  with me.
                </p>
              </ScrollAnimation>
            </div>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="text-xl">No testimonials available yet.</p>
              <p className="mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  className="glass-card rounded-xl p-6 shadow-lg hover:shadow-primary/30 transition-all duration-300 border border-primary/10 hover:border-primary/30 flex flex-col"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar || "./imgs/default-avatar.jpg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-primary/50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder.svg?height=64&width=64";
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 flex-grow">
                    {showFullContent[testimonial._id] ||
                    testimonial.content.length <= MAX_CONTENT_LENGTH
                      ? testimonial.content
                      : `${testimonial.content.substring(
                          0,
                          MAX_CONTENT_LENGTH
                        )}...`}
                  </p>
                  {testimonial.content.length > MAX_CONTENT_LENGTH && (
                    <button
                      onClick={() => toggleShowFullContent(testimonial._id)}
                      className="text-primary hover:underline mt-2 self-start text-sm"
                    >
                      {showFullContent[testimonial._id]
                        ? "Show Less"
                        : "Show More"}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <motion.button
        onClick={() => setIsAddTestimonialDialogOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-full text-lg font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={20} />
        <span>Add Your Testimonial</span>
      </motion.button>
      <AddTestimonialDialog
        isOpen={isAddTestimonialDialogOpen}
        onClose={() => setIsAddTestimonialDialogOpen(false)}
        onTestimonialAdded={handleTestimonialAdded}
      />
    </PageTransition>
  );
}
