"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "Economy",
  "Technology",
  "Nigeria News",
  "Global News",
  "Opportunities",
  "AI",
  "Startups",
  "Security",
  "Jobs",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleContinue = () => {
    if (selected.length < 3) return
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-accent/30 blur-[100px] rounded-full opacity-50" />
      
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Briefly.</h1>
        </div>
        
        <Card className="glass-panel shadow-lg border-border/60 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold tracking-tight">What are you interested in?</CardTitle>
            <CardDescription className="text-base text-muted-foreground/80">
              Select at least 3 topics to personalize your daily brief.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((category) => (
                <div
                  key={category}
                  className={cn(
                    "group flex items-center space-x-3 rounded-xl border border-border/50 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20",
                    selected.includes(category) 
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/10" 
                      : "bg-background/50 hover:bg-background"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  <Checkbox
                    id={category}
                    checked={selected.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
                  />
                  <Label htmlFor={category} className="cursor-pointer font-medium text-sm group-hover:text-primary transition-colors">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-border/40">
              <Button
                className="w-full h-12 text-base rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                disabled={selected.length < 3}
                onClick={handleContinue}
              >
                {selected.length < 3 
                  ? `Select ${3 - selected.length} more to continue` 
                  : `Continue with ${selected.length} topics`
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
