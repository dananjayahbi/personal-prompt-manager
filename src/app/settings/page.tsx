'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppearanceSettings } from './AppearanceSettings'
import { EditorSettings } from './EditorSettings'
import { DataManagement } from './DataManagement'
import type { SettingsData } from './types'

const defaultSettings: SettingsData = {
  theme: 'system',
  fontSize: 14,
  showLineNumbers: true,
  wordWrap: true,
  autoSave: true,
  autoSaveInterval: 2000,
  defaultCategory: 'general',
  exportFormat: 'json',
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('app-settings')
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    try {
      localStorage.setItem('app-settings', JSON.stringify(newSettings))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <AppearanceSettings 
            settings={settings} 
            updateSetting={updateSetting} 
          />
        </TabsContent>

        <TabsContent value="editor">
          <EditorSettings 
            settings={settings} 
            updateSetting={updateSetting} 
          />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
