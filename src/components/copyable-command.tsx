'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CopyableCommandProps {
  className?: string
}

export function CopyableCommand({ className = "" }: CopyableCommandProps) {
  const [command, setCommand] = useState('')
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Load command from settings
  useEffect(() => {
    const loadCommand = () => {
      try {
        const savedSettings = localStorage.getItem('app-settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setCommand(settings.copyableCommand || 'npm run dev')
        } else {
          setCommand('npm run dev')
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        setCommand('npm run dev')
      }
    }

    loadCommand()

    // Listen for storage changes to update command when settings change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app-settings') {
        loadCommand()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events from settings page
    const handleSettingsUpdate = () => {
      loadCommand()
    }
    
    window.addEventListener('settings-updated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('settings-updated', handleSettingsUpdate)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Command copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy command",
        variant: "destructive",
      })
    }
  }

  if (!command) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        value={command}
        readOnly
        className="font-mono text-sm bg-gray-50 border-gray-200 text-gray-700 cursor-pointer select-all"
        onClick={(e) => e.currentTarget.select()}
      />
      <Button
        onClick={handleCopy}
        variant="outline"
        size="sm"
        className="flex-shrink-0 px-3"
        disabled={copied}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
