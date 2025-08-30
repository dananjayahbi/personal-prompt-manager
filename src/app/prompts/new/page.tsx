"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewPromptPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    isFavorite: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push("/prompts")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create prompt")
      }
    } catch (error) {
      console.error("Error creating prompt:", error)
      setError("Failed to create prompt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/prompts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Prompts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Prompt</h1>
            <p className="text-muted-foreground">
              Create a new AI prompt template
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details for your prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter prompt title"
                    required
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the prompt"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="favorite"
                    checked={formData.isFavorite}
                    onCheckedChange={(checked) => handleInputChange("isFavorite", checked)}
                  />
                  <Label htmlFor="favorite">Add to favorites</Label>
                </div>
              </CardContent>
            </Card>

            {/* Content Card - Much Larger */}
            <Card>
              <CardHeader>
                <CardTitle>Prompt Content</CardTitle>
                <CardDescription>
                  Write your AI prompt content here. Use {"{variable_name}"} for placeholders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Enter your AI prompt content here..."
                    rows={20}
                    required
                    className="min-h-[500px] resize-y"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button type="submit" disabled={loading} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Creating..." : "Create Prompt"}
                </Button>
                <Link href="/prompts">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  )
}