"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Star, Clock, TrendingUp, Brain, Zap, Users, Target } from "lucide-react"
import Link from "next/link"

interface PromptStats {
  total: number
  favorites: number
  recent: number
  categories: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<PromptStats>({
    total: 0,
    favorites: 0,
    recent: 0,
    categories: 0
  })

  const [recentPrompts, setRecentPrompts] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    fetchRecentPrompts()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }
      const prompts = await response.json()
      
      // Ensure prompts is an array
      if (!Array.isArray(prompts)) {
        console.error('Expected array but got:', typeof prompts)
        return
      }
      
      const favoriteCount = prompts.filter((p: any) => p.isFavorite).length
      const recentCount = prompts.filter((p: any) => {
        const createdAt = new Date(p.createdAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return createdAt > weekAgo
      }).length
      
      const categories = new Set(prompts.map((p: any) => p.category).filter(Boolean))
      
      setStats({
        total: prompts.length,
        favorites: favoriteCount,
        recent: recentCount,
        categories: categories.size
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }
      const prompts = await response.json()
      
      // Ensure prompts is an array
      if (Array.isArray(prompts)) {
        setRecentPrompts(prompts.slice(0, 5))
      } else {
        console.error('Expected array but got:', typeof prompts)
        setRecentPrompts([])
      }
    } catch (error) {
      console.error('Error fetching recent prompts:', error)
      setRecentPrompts([])
    }
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
                  Good morning! 👋
                </h1>
                <p className="text-xl text-muted-foreground">
                  You have <span className="font-semibold text-blue-600">{stats.total} prompts</span> ready for use today.
                </p>
                <p className="text-sm text-muted-foreground">
                  Manage your AI prompts efficiently and boost your productivity
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/prompts/new">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Plus className="mr-2 h-5 w-5" />
                    New Prompt
                  </Button>
                </Link>
                <Link href="/prompts">
                  <Button variant="outline" size="lg" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <FileText className="mr-2 h-5 w-5" />
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Prompts</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? '+7.2% from last week' : 'Start creating your first prompt'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Favorites</CardTitle>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.favorites}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.favorites > 0 ? 'Bookmarked prompts' : 'Mark prompts as favorites'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Recent</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.recent}</div>
              <p className="text-xs text-gray-500 mt-1">
                Last 7 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.categories}</div>
              <p className="text-xs text-gray-500 mt-1">
                Organize your prompts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with your prompt management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/prompts/new">
                  <Button variant="outline" className="w-full justify-start h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                    <Plus className="mr-3 h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Create New Prompt</div>
                      <div className="text-xs text-muted-foreground">Build your AI template</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/prompts">
                  <Button variant="outline" className="w-full justify-start h-12 border-green-200 hover:bg-green-50 hover:border-green-300">
                    <FileText className="mr-3 h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Browse Prompts</div>
                      <div className="text-xs text-muted-foreground">View all templates</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/preview">
                  <Button variant="outline" className="w-full justify-start h-12 border-purple-200 hover:bg-purple-50 hover:border-purple-300">
                    <Star className="mr-3 h-5 w-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Preview Mode</div>
                      <div className="text-xs text-muted-foreground">Test your prompts</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start h-12 border-orange-200 hover:bg-orange-50 hover:border-orange-300">
                    <Target className="mr-3 h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Settings</div>
                      <div className="text-xs text-muted-foreground">Configure your workspace</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest prompt updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrompts.length > 0 ? (
                  recentPrompts.map((prompt, index) => (
                    <div key={prompt.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none text-gray-900 truncate">
                          {prompt.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {prompt.description || 'No description'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(prompt.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No prompts yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Create your first prompt to get started
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}