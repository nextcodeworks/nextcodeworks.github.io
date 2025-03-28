"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Terminal, Zap } from "lucide-react"

export default function Hero() {
  return (
    <section id="about" className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Self-taught Developer
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Python & Next.js <br />
              <span className="text-primary">Development Specialist</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              I'm a passionate self-taught developer with expertise in Python scripting, GUI development, and Next.js
              landing pages. I pride myself on quick turnaround times and clear code documentation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                View My Work
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <span>Python Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <span>Next.js Developer</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                <div className="text-6xl font-bold text-primary">{"</>"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

