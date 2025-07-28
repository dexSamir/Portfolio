import type React from "react"
import { Bell, CheckCircle, Star, XCircle } from "lucide-react"
import type { PendingTestimonial } from "@/types/data-types"

interface PendingTestimonialsProps {
  pendingTestimonials: PendingTestimonial[]
  handleApproveTestimonial: (id: string) => Promise<void>
  handleDeleteClick: (id: string, type: "project" | "testimonial" | "pendingTestimonial", name: string) => void
}

export const PendingTestimonials: React.FC<PendingTestimonialsProps> = ({
  pendingTestimonials,
  handleApproveTestimonial,
  handleDeleteClick,
}) => {
  if (pendingTestimonials.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Bell className="text-red-400 mr-2" size={20} />
        <h3 className="text-xl font-semibold">Pending Reviews ({pendingTestimonials.length})</h3>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-red-500/30">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {pendingTestimonials.map((testimonial) => (
                <tr key={testimonial._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">
                          {testimonial.position}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 truncate max-w-xs">{testimonial.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        testimonial.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : testimonial.status === "approved"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="text-green-400 hover:text-green-300 mr-3"
                      onClick={() => handleApproveTestimonial(testimonial._id)}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteClick(testimonial._id, "pendingTestimonial", testimonial.name)}
                    >
                      <XCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 p-4">
          {pendingTestimonials.map((testimonial) => (
            <div key={testimonial._id} className="bg-black/30 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center mb-3">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3 line-clamp-3">{testimonial.content}</p>

              <div className="mb-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    testimonial.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : testimonial.status === "approved"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                    />
                  ))}
                </div>
                <div className="flex">
                  <button
                    className="text-green-400 hover:text-green-300 mr-3 p-1"
                    onClick={() => handleApproveTestimonial(testimonial._id)}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 p-1"
                    onClick={() => handleDeleteClick(testimonial._id, "pendingTestimonial", testimonial.name)}
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
