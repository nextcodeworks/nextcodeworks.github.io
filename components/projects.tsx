import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function Projects() {
  const projects = [
    {
      title: "Advanced Task Manager",
      description:
        "A feature-rich desktop task management application built with PyQt5. Includes task categorization, priority levels, due dates, and data visualization.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "PyQt5", "SQLite", "Data Visualization"],
      github: "https://github.com/username/advanced-task-manager",
      demo: "#",
    },
    {
      title: "Web Scraping Price Chart Generator",
      description:
        "A tool that scrapes product prices from multiple e-commerce websites and generates comparative price charts using Matplotlib.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "BeautifulSoup", "Selenium", "Matplotlib"],
      github: "https://github.com/username/price-chart-generator",
      demo: "#",
    },
    {
      title: "Stock Price Tracker",
      description:
        "A real-time stock price tracking application with customizable alerts and historical data visualization built with Tkinter.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "Tkinter", "APIs", "Pandas"],
      github: "https://github.com/username/stock-price-tracker",
      demo: "#",
    },
    {
      title: "Discord Trading Bot",
      description:
        "An automated trading bot for Discord that provides real-time market data, trading signals, and portfolio management.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "Discord.py", "APIs", "Financial Analysis"],
      github: "https://github.com/username/discord-trading-bot",
      demo: "#",
    },
    {
      title: "E-commerce Landing Page",
      description:
        "A responsive, high-conversion landing page for an e-commerce store built with Next.js and TailwindCSS.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Next.js", "React", "TailwindCSS", "Responsive Design"],
      github: "https://github.com/username/ecommerce-landing",
      demo: "#",
    },
    {
      title: "Data Analysis Dashboard",
      description:
        "An interactive dashboard for visualizing and analyzing complex datasets, built with Python and deployed as a web application.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "Flask", "Pandas", "D3.js"],
      github: "https://github.com/username/data-dashboard",
      demo: "#",
    },
  ]

  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects showcasing my skills and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-6">
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-2">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

