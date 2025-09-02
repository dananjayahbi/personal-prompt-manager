'use client'

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppearanceSettings } from './AppearanceSettings'
import { EditorSettings } from './EditorSettings'
import { DataManagement } from './DataManagement'
import type { SettingsData } from './types'

const defaultSettings: SettingsData = {
  theme: 'light', // Always light theme
  fontSize: 14,
  lineHeight: 1.5,
  showLineNumbers: true,
  wordWrap: true,
  autoSave: true,
  autoSaveInterval: 2000,
  defaultCategory: 'general',
  exportFormat: 'json',
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
  tabSize: 2,
  bracketMatching: true,
  highlightActiveLine: true,
  showInvisibles: false,
  copyableCommand: 'npm run dev'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const dbSettings = await response.json()
        setSettings(dbSettings)
        // Also save to localStorage for quick access
        localStorage.setItem('app-settings', JSON.stringify(dbSettings))
      } else {
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('app-settings')
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      // Fallback to localStorage
      const savedSettings = localStorage.getItem('app-settings')
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      }
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    try {
      // Save to database
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
      
      if (response.ok) {
        // Also update localStorage for quick access
        localStorage.setItem('app-settings', JSON.stringify(newSettings))
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('settings-updated'))
      } else {
        console.error('Failed to save settings to database')
        // Fallback to localStorage only
        localStorage.setItem('app-settings', JSON.stringify(newSettings))
        window.dispatchEvent(new Event('settings-updated'))
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      // Fallback to localStorage only
      localStorage.setItem('app-settings', JSON.stringify(newSettings))
      window.dispatchEvent(new Event('settings-updated'))
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
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
    </MainLayout>
  )
}
