"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Code, Bot, Layout, ArrowRight } from "lucide-react"

export default function Services() {
  const pricingTiers = [
    {
      name: "Basic",
      description: "Perfect for small projects and simple scripts",
      price: "$50",
      features: [
        "Python Scripts (up to 500 lines)",
        "Simple Discord/Telegram Bot",
        "Basic GUI Application",
        "Simple Web Scraping",
        "1 Revision",
        "Delivery: 2-3 days",
      ],
      icon: <Code className="h-6 w-6" />,
      popular: false,
    },
    {
      name: "Standard",
      description: "Ideal for medium-sized projects with more complexity",
      price: "$150",
      features: [
        "Python Scripts (up to 1500 lines)",
        "Advanced Discord/Telegram Bot",
        "Complex GUI Application",
        "Advanced Web Scraping",
        "EXE Conversion & Obfuscation",
        "Simple Next.js Landing Page",
        "3 Revisions",
        "Delivery: 4-7 days",
      ],
      icon: <Bot className="h-6 w-6" />,
      popular: true,
    },
    {
      name: "Premium",
      description: "For complex projects requiring extensive development",
      price: "$300+",
      features: [
        "Python Scripts (unlimited lines)",
        "Enterprise Discord/Telegram Bot",
        "Advanced GUI with Database",
        "Complex Web Scraping & Analysis",
        "EXE Conversion & Obfuscation",
        "Full Next.js Website",
        "Unlimited Revisions",
        "Priority Support",
        "Delivery: 7-14 days",
      ],
      icon: <Layout className="h-6 w-6" />,
      popular: false,
    },
  ]

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Services & Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I offer a range of development services tailored to your needs, from simple scripts to complex applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative ${tier.popular ? "border-primary shadow-lg" : "border-border shadow-md"}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {tier.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{tier.price}</span>
                    {tier.name !== "Premium" && <span className="text-muted-foreground"> / project</span>}
                  </div>
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

