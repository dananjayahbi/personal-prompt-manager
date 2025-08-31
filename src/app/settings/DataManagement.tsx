import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

export function DataManagement() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const data = {
        settings: localStorage.getItem('app-settings'),
        drafts: localStorage.getItem('drafts'),
        exportDate: new Date().toISOString()
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
        description: 'Your data has been exported successfully'
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your data',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearData = async () => {
    setIsClearing(true)
    try {
      localStorage.removeItem('app-settings')
      localStorage.removeItem('drafts')
      
      toast({
        title: 'Data cleared',
        description: 'All local data has been cleared successfully'
      })
      
      // Reload page to reset state
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
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
