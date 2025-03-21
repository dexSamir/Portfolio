import { Quote, Star } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { PageTransition } from "../components/page-transition"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "../components/scroll-animation"
import { PageSkeleton } from "../components/loading-skeleton"

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Alex Johnson",
      position: "Project Manager",
      company: "TechCorp",
      image: "/placeholder.svg?height=100&width=100",
      testimonial:
        "Samir is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are impressive.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      position: "UI/UX Designer",
      company: "DesignHub",
      image: "/placeholder.svg?height=100&width=100",
      testimonial:
        "Working with Samir was a pleasure. He transformed my designs into flawless code and added thoughtful interactions that enhanced the user experience.",
      rating: 5,
    },
    {
      name: "David Kim",
      position: "CTO",
      company: "StartupX",
      image: "/placeholder.svg?height=100&width=100",
      testimonial:
        "Samir's technical expertise and ability to quickly learn new technologies made him an invaluable asset to our team. He consistently exceeded our expectations.",
      rating: 4,
    },
    {
      name: "Sarah Williams",
      position: "Product Owner",
      company: "InnovateTech",
      image: "/placeholder.svg?height=100&width=100",
      testimonial:
        "Samir not only writes excellent code but also understands business requirements deeply. He suggests improvements that add real value to the product.",
      rating: 5,
    },
    {
      name: "Michael Brown",
      position: "Senior Developer",
      company: "CodeMasters",
      image: "/placeholder.svg?height=100&width=100",
      testimonial:
        "As a fellow developer, I'm impressed by Samir's clean code and thoughtful architecture decisions. He's a great collaborator and elevates the entire team.",
      rating: 4,
    },
    {
      name: "Emily Chen",
      position: "Startup Founder",
      company: "WebSolutions",
      image: "/placeholder.svg?height=100&width=100",
      testimonial:
        "Samir helped bring my startup idea to life with his technical skills. He was responsive, professional, and delivered exactly what we needed on time.",
      rating: 5,
    },
  ]

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen">
          <div className="container mx-auto px-4 pt-24 pb-16">
            <ScrollAnimation>
              <h1 className="text-4xl md:text-6xl font-bold mb-3 text-glow">Client Testimonials</h1>
              <div className="h-1 w-20 bg-primary mb-4"></div>
              <p className="text-xl text-gray-300 mb-12">What my clients have to say about working with me</p>
            </ScrollAnimation>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <StaggerItem key={index}>
                  <Card className="hover-element bg-black/50 backdrop-blur-sm border-primary/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-primary h-full">
                    <CardContent className="p-6 relative">
                      {/* Decorative quote symbol in background */}
                      <div className="absolute top-3 right-3 opacity-5 text-8xl font-serif">"</div>

                      <Quote className="h-10 w-10 text-primary/70 mb-4" />

                      <p className="text-gray-200 mb-6 italic relative z-10">"{testimonial.testimonial}"</p>

                      {/* Rating stars */}
                      <div className="flex mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                            } mr-1`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary/30">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                          <p className="text-sm text-primary">
                            {testimonial.position}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  )
}

