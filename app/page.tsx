import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Skills from "@/components/skills"
import Services from "@/components/services"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggle />
      </div>
    </div>
  )
}

