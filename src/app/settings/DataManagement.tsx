import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

export function DataManagement() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      // Get settings from API
      const settingsResponse = await fetch('/api/settings')
      let settingsData = null
      
      if (settingsResponse.ok) {
        settingsData = await settingsResponse.json()
      } else {
        // Fallback to localStorage
        const localSettings = localStorage.getItem('app-settings')
        settingsData = localSettings ? JSON.parse(localSettings) : null
      }
      
      // Get drafts from API
      const draftsResponse = await fetch('/api/drafts')
      let draftsData: any[] = []
      
      if (draftsResponse.ok) {
        draftsData = await draftsResponse.json()
      }
      
      const data = {
        settings: settingsData,
        drafts: draftsData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prompt-manager-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Export successful',
        description: `Your data has been exported successfully. ${draftsData.length} drafts included.`
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your data',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validate the imported data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid file format')
      }
      
      let importedCount = 0
      
      // Import settings if available
      if (data.settings) {
        // Save to database
        try {
          const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.settings)
          })
          if (response.ok) {
            localStorage.setItem('app-settings', JSON.stringify(data.settings))
          }
        } catch (error) {
          console.error('Error importing settings to database:', error)
          // Fallback to localStorage only
          localStorage.setItem('app-settings', JSON.stringify(data.settings))
        }
      }
      
      // Import drafts if available
      if (data.drafts && Array.isArray(data.drafts)) {
        // First, clear existing drafts
        const existingDraftsResponse = await fetch('/api/drafts')
        if (existingDraftsResponse.ok) {
          const existingDrafts = await existingDraftsResponse.json()
          
          // Delete existing drafts
          for (const draft of existingDrafts) {
            await fetch(`/api/drafts/${draft.id}`, { method: 'DELETE' })
          }
        }
        
        // Import new drafts
        for (const draft of data.drafts) {
          const { id, createdAt, updatedAt, ...draftData } = draft
          try {
            const response = await fetch('/api/drafts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(draftData)
            })
            if (response.ok) {
              importedCount++
            }
          } catch (error) {
            console.error('Error importing draft:', error)
          }
        }
      }
      
      toast({
        title: 'Import successful',
        description: `Your data has been imported successfully. ${importedCount} drafts imported.`
      })
      
      // Reload page to apply imported settings
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: 'Import failed',
        description: 'There was an error importing your data. Please check the file format.',
        variant: 'destructive'
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleClearData = async () => {
    setIsClearing(true)
    try {
      // Clear localStorage settings
      localStorage.removeItem('app-settings')
      
      // Clear database settings
      try {
        const settingsResponse = await fetch('/api/settings')
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json()
          if (settings.id) {
            // Reset settings to defaults instead of deleting
            await fetch('/api/settings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                theme: "light",
                autoSave: true,
                autoSaveInterval: 2000,
                defaultCategory: "general",
                exportFormat: "json",
                showLineNumbers: true,
                fontSize: 14,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                wordWrap: true,
                lineHeight: 1.5,
                tabSize: 2,
                bracketMatching: true,
                highlightActiveLine: true,
                showInvisibles: false,
                copyableCommand: "npm run dev"
              })
            })
          }
        }
      } catch (error) {
        console.error('Error resetting database settings:', error)
      }
      
      // Clear all drafts via API
      const draftsResponse = await fetch('/api/drafts')
      if (draftsResponse.ok) {
        const drafts = await draftsResponse.json()
        
        // Delete each draft
        const deletePromises = drafts.map((draft: any) =>
          fetch(`/api/drafts/${draft.id}`, { method: 'DELETE' })
        )
        
        await Promise.all(deletePromises)
      }
      
      toast({
        title: 'Data cleared',
        description: 'All data has been reset to defaults and drafts have been cleared'
      })
      
      // Reload page to reset state
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Clear data error:', error)
      toast({
        title: 'Clear failed',
        description: 'There was an error clearing your data',
        variant: 'destructive'
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Manage your application data and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Export Data</h4>
          <p className="text-sm text-muted-foreground">
            Download a backup of all your settings and drafts
          </p>
          <Button onClick={handleExportData} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Import Data</h4>
          <p className="text-sm text-muted-foreground">
            Restore your settings and drafts from a backup file
          </p>
          <div className="flex gap-2">
            <Button onClick={triggerFileInput} disabled={isImporting}>
              {isImporting ? 'Importing...' : 'Import Data'}
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Clear All Data</h4>
          <p className="text-sm text-muted-foreground">
            This will permanently delete all your local settings and drafts
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isClearing}>
                {isClearing ? 'Clearing...' : 'Clear All Data'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your
                  settings, drafts, and other local data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>
                  Yes, clear all data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
