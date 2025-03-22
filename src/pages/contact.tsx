import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { PageTransition } from "../components/page-transition"
import { ScrollAnimation, StaggerItem } from "../components/scroll-animation"
import { PageSkeleton } from "../components/loading-skeleton"

export default function ContactPage() {
  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen">
          <div className="container mx-auto px-4 pt-24 pb-16">
            <ScrollAnimation>
              <h1 className="text-4xl md:text-6xl font-bold mb-3">Contact Me</h1>
              <div className="h-1 w-20 bg-primary mb-4"></div>
              <p className="text-xl text-gray-300 mb-12">Get in touch for collaborations or inquiries</p>
            </ScrollAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ScrollAnimation direction="left" className="lg:col-span-1 space-y-6">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 hover-element transition-all duration-500 hover:scale-105 hover:border-primary border border-transparent group">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-full group-hover:bg-primary/40 transition-all duration-300">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Phone</h3>
                      <p className="text-gray-300">+994 50 622 93 28</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 hover-element transition-all duration-500 hover:scale-105 hover:border-primary border border-transparent group">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-full group-hover:bg-primary/40 transition-all duration-300">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Email</h3>
                      <p className="text-gray-300">hebibovsamir26@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 hover-element transition-all duration-500 hover:scale-105 hover:border-primary border border-transparent group">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-full group-hover:bg-primary/40 transition-all duration-300">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Location</h3>
                      <p className="text-gray-300">Baku, Azerbaijan 1063</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" delay={0.3} className="lg:col-span-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-primary/10">
                  <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <StaggerItem>
                        <div className="space-y-2">
                          <label htmlFor="name" className="block text-sm font-medium">
                            Your Name
                          </label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="bg-black/30 border-gray-700 focus:border-primary transition-all duration-300"
                          />
                        </div>
                      </StaggerItem>

                      <StaggerItem>
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium">
                            Your Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="bg-black/30 border-gray-700 focus:border-primary transition-all duration-300"
                          />
                        </div>
                      </StaggerItem>
                    </div>

                    <StaggerItem>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="block text-sm font-medium">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          placeholder="Project Inquiry"
                          className="bg-black/30 border-gray-700 focus:border-primary transition-all duration-300"
                        />
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-medium">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Your message here..."
                          rows={6}
                          className="bg-black/30 border-gray-700 focus:border-primary resize-none transition-all duration-300"
                        />
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <Button
                        type="submit"
                        className="hover-element w-full bg-primary text-black hover:bg-primary/80 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                      >
                        Send Message
                      </Button>
                    </StaggerItem>
                  </form>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  )
}

