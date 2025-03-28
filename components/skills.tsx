import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Bot, LineChart, Layout, Monitor, Server, Cpu } from "lucide-react"

export default function Skills() {
  const skillCategories = [
    {
      title: "Python Development",
      icon: <Code className="h-6 w-6 text-primary" />,
      skills: ["Python", "Flask", "SQLite", "NumPy", "Pandas", "Matplotlib"],
    },
    {
      title: "Bot Development",
      icon: <Bot className="h-6 w-6 text-primary" />,
      skills: ["Discord Bots", "Telegram Bots", "API Integration", "Automation"],
    },
    {
      title: "GUI Applications",
      icon: <Monitor className="h-6 w-6 text-primary" />,
      skills: ["Tkinter", "PyQt5", "Desktop Applications", "Cross-platform"],
    },
    {
      title: "Web Scraping",
      icon: <LineChart className="h-6 w-6 text-primary" />,
      skills: ["BeautifulSoup", "Selenium", "Data Extraction", "Automation"],
    },
    {
      title: "Web Development",
      icon: <Layout className="h-6 w-6 text-primary" />,
      skills: ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "TailwindCSS"],
    },
    {
      title: "Database",
      icon: <Database className="h-6 w-6 text-primary" />,
      skills: ["SQLite", "MongoDB", "Data Modeling", "CRUD Operations"],
    },
    {
      title: "Backend",
      icon: <Server className="h-6 w-6 text-primary" />,
      skills: ["Node.js", "Express", "API Development", "Authentication"],
    },
    {
      title: "Tools & Technologies",
      icon: <Cpu className="h-6 w-6 text-primary" />,
      skills: ["Git", "GitHub", "VS Code", "PyCharm", "Docker", "CI/CD"],
    },
  ]

  return (
    <section id="skills" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills & Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            As a self-taught developer, I've acquired a diverse set of skills across various technologies and domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {category.icon}
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

