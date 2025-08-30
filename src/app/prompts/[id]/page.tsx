"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Prompt } from "@prisma/client"

export default function EditPromptPage() {
  const params = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    isFavorite: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchPrompt()
  }, [params.id])

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrompt(data)
        setFormData({
          title: data.title,
          content: data.content,
          description: data.description || "",
          isFavorite: data.isFavorite
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

  const handleDelete = async () => {
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
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/prompts">
              <Button className="mt-4">Back to Prompts</Button>
            </Link>
          </div>
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
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {/* Basic Information Card */}
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
                <Button type="submit" disabled={saving} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
