"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ArrowLeft, Save, Plus, X, Trash2 } from "lucide-react"
import Link from "next/link"

interface PromptData {
  id: string
  title: string
  content: string
  description: string | null
  category: string | null
  tags: string[] | null
  isFavorite: boolean
}

export default function EditPromptPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<PromptData | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    category: "",
    tags: [] as string[],
    isFavorite: false
  })
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    "Code Generation",
    "Content Creation",
    "Analysis",
    "Translation",
    "Summarization",
    "Creative Writing",
    "Technical Writing",
    "Research",
    "Other"
  ]

  useEffect(() => {
    fetchPrompt()
  }, [params.id])

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        const promptData: PromptData = {
          ...data,
          tags: data.tags ? JSON.parse(data.tags) : null
        }
        setPrompt(promptData)
        setFormData({
          title: promptData.title,
          content: promptData.content,
          description: promptData.description || "",
          category: promptData.category || "",
          tags: promptData.tags || [],
          isFavorite: promptData.isFavorite
        })
      } else {
        setError("Prompt not found")
      }
    } catch (error) {
      console.error("Error fetching prompt:", error)
      setError("Failed to fetch prompt")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/prompts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push("/prompts")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update prompt")
      }
    } catch (error) {
      console.error("Error updating prompt:", error)
      setError("Failed to update prompt")
    } finally {
      setSaving(false)
    }
  }

  const deletePrompt = async () => {
    if (!confirm("Are you sure you want to delete this prompt? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/prompts/${params.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        router.push("/prompts")
      } else {
        setError("Failed to delete prompt")
      }
    } catch (error) {
      console.error("Error deleting prompt:", error)
      setError("Failed to delete prompt")
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading prompt...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error && !prompt) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
              <Link href="/prompts" className="mt-4 inline-block">
                <Button variant="outline">Back to Prompts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prompts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Prompts
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Prompt</h1>
              <p className="text-muted-foreground">
                Update your AI prompt template
              </p>
            </div>
          </div>
          <Button variant="destructive" onClick={deletePrompt}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the basic details for your prompt
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
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <Card>
              <CardHeader>
                <CardTitle>Content & Tags</CardTitle>
                <CardDescription>
                  Update the prompt content and tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">Prompt Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Enter your AI prompt content here..."
                    rows={10}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
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
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/prompts">
                  <Button type="button" variant="outline">
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