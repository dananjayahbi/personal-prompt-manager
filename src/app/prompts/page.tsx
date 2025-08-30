"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Star, 
  StarOff,
  Copy,
  Eye,
  FileText
} from "lucide-react"
import { Prompt } from "@prisma/client"
import Link from "next/link"

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFavorites, setShowFavorites] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchPrompts()
  }, [])

  useEffect(() => {
    filterPrompts()
  }, [prompts, searchTerm, showFavorites])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (showFavorites) params.append("favorites", "true")
      
      const response = await fetch(`/api/prompts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)
      }
    } catch (error) {
      console.error("Error fetching prompts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPrompts = () => {
    let filtered = prompts

    if (searchTerm) {
      filtered = filtered.filter(
        prompt =>
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPrompts(filtered)
  }

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !isFavorite })
      })

      if (response.ok) {
        await fetchPrompts()
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const deletePrompt = async () => {
    if (!promptToDelete) return

    try {
      const response = await fetch(`/api/prompts/${promptToDelete}`, {
        method: "DELETE"
      })

      if (response.ok) {
        await fetchPrompts()
        setDeleteDialogOpen(false)
        setPromptToDelete(null)
      }
    } catch (error) {
      console.error("Error deleting prompt:", error)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading prompts...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section with Gradient */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl opacity-10"></div>
          <div className="relative p-8 rounded-2xl border border-blue-200/20">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Prompt Library
                </h1>
                <p className="text-xl text-muted-foreground">
                  {filteredPrompts.length} of {prompts.length} prompts
                </p>
                <p className="text-sm text-muted-foreground">
                  Manage, organize, and optimize your AI prompt templates
                </p>
              </div>
              <Link href="/prompts/new">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Plus className="mr-2 h-5 w-5" />
                  New Prompt
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search prompts by title, content, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant={showFavorites ? "default" : "outline"}
                  onClick={() => setShowFavorites(!showFavorites)}
                  className="h-12 px-6"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredPrompts.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">No prompts found</h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                {prompts.length === 0
                  ? "Get started by creating your first prompt template to boost your AI interactions"
                  : "Try adjusting your search terms or filters to find what you're looking for"}
              </p>
              {prompts.length === 0 && (
                <Link href="/prompts/new">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Prompt
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {prompt.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {prompt.isFavorite && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Favorite
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/prompts/${prompt.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(prompt.content)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Content
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/preview?prompt=${prompt.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => toggleFavorite(prompt.id, prompt.isFavorite)}
                        >
                          {prompt.isFavorite ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              Remove from Favorites
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Add to Favorites
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setPromptToDelete(prompt.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-gray-600 line-clamp-3 mb-4 flex-1">
                    {prompt.description || "No description provided"}
                  </CardDescription>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      Updated {new Date(prompt.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(prompt.content)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleFavorite(prompt.id, prompt.isFavorite)}
                        className={prompt.isFavorite ? "text-yellow-500" : ""}
                      >
                        {prompt.isFavorite ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
            <Button variant="destructive" onClick={deletePrompt}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}