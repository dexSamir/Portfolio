import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { PageSkeleton } from "@/components/loading-skeleton";
import { AddTestimonialDialog } from "@/components/add-testimonial-dialog";
import { getTestimonials } from "@/services/localDataService";
import type { Testimonial } from "@/types/data-types";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTestimonialDialogOpen, setIsAddTestimonialDialogOpen] =
    useState(false);

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
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-center mb-12 text-glow"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Client Testimonials
          </motion.h1>

          <div className="flex justify-center mb-12">
            <motion.button
              onClick={() => setIsAddTestimonialDialogOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-full text-lg font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>Add Your Testimonial</span>
            </motion.button>
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
                      src={
                        testimonial.avatar ||
                        "/placeholder.svg?height=64&width=64&query=user avatar"
                      }
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
                    {testimonial.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AddTestimonialDialog
        isOpen={isAddTestimonialDialogOpen}
        onClose={() => setIsAddTestimonialDialogOpen(false)}
        onTestimonialAdded={handleTestimonialAdded}
      />
    </PageTransition>
  );
}
