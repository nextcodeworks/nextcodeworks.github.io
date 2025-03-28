import { Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-xl font-bold text-primary mb-2">DevPortfolio</div>
            <p className="text-muted-foreground max-w-md">
              Self-taught developer specializing in Python scripting, GUI development, and Next.js landing pages.
            </p>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} DevPortfolio. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

