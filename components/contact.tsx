"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Send, ExternalLink } from "lucide-react"

export default function Contact() {
  const contactMethods = [
    {
      name: "Email",
      value: "developer@example.com",
      icon: <Mail className="h-5 w-5" />,
      link: "mailto:developer@example.com",
    },
    {
      name: "Telegram",
      value: "@devusername",
      icon: <MessageSquare className="h-5 w-5" />,
      link: "https://t.me/devusername",
    },
    {
      name: "Fiverr",
      value: "fiverr.com/devusername",
      icon: <ExternalLink className="h-5 w-5" />,
      link: "https://fiverr.com/devusername",
    },
    {
      name: "Upwork",
      value: "upwork.com/devusername",
      icon: <ExternalLink className="h-5 w-5" />,
      link: "https://upwork.com/devusername",
    },
  ]

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Send Me a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Your Email
                  </label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="Project Inquiry" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Tell me about your project..." rows={6} required />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="border-none shadow-md">
                  <CardContent className="p-6">
                    <a
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-center hover:text-primary transition-colors"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        {method.icon}
                      </div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-muted-foreground">{method.value}</p>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-6">Let's Work Together</h3>
              <Card className="border-none shadow-md bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <p className="mb-4">
                    Looking for a developer who can bring your ideas to life? I'm currently available for freelance work
                    and new projects.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View My Services
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

