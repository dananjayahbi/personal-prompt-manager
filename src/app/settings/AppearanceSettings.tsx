import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import type { SettingsData } from './types'

interface AppearanceSettingsProps {
  settings: SettingsData
  updateSetting: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => void
}

export function AppearanceSettings({ settings, updateSetting }: AppearanceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the visual appearance of the application (Light theme only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 rounded text-sm text-gray-600">
              ☀️ Light Theme (Fixed)
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            This application uses a light theme for optimal readability
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size: {settings.fontSize}px</Label>
          <Slider
            id="fontSize"
            min={10}
            max={24}
            step={1}
            value={[settings.fontSize]}
            onValueChange={(value) => updateSetting('fontSize', value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lineHeight">Line Height: {settings.lineHeight}</Label>
          <Slider
            id="lineHeight"
            min={1.0}
            max={2.5}
            step={0.1}
            value={[settings.lineHeight]}
            onValueChange={(value) => updateSetting('lineHeight', value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={settings.fontFamily}
            onValueChange={(value) => updateSetting('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monaco, Menlo, 'Ubuntu Mono', monospace">Monaco</SelectItem>
              <SelectItem value="'Fira Code', monospace">Fira Code</SelectItem>
              <SelectItem value="'JetBrains Mono', monospace">JetBrains Mono</SelectItem>
              <SelectItem value="'Consolas', monospace">Consolas</SelectItem>
              <SelectItem value="'Source Code Pro', monospace">Source Code Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showLineNumbers">Show Line Numbers</Label>
            <p className="text-sm text-muted-foreground">
              Display line numbers in code editors
            </p>
          </div>
          <Switch
            id="showLineNumbers"
            checked={settings.showLineNumbers}
            onCheckedChange={(checked) => updateSetting('showLineNumbers', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="wordWrap">Word Wrap</Label>
            <p className="text-sm text-muted-foreground">
              Wrap long lines in editors
            </p>
          </div>
          <Switch
            id="wordWrap"
            checked={settings.wordWrap}
            onCheckedChange={(checked) => updateSetting('wordWrap', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="highlightActiveLine">Highlight Active Line</Label>
            <p className="text-sm text-muted-foreground">
              Highlight the current line in editors
            </p>
          </div>
          <Switch
            id="highlightActiveLine"
            checked={settings.highlightActiveLine}
            onCheckedChange={(checked) => updateSetting('highlightActiveLine', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showInvisibles">Show Invisible Characters</Label>
            <p className="text-sm text-muted-foreground">
              Display spaces, tabs, and line breaks
            </p>
          </div>
          <Switch
            id="showInvisibles"
            checked={settings.showInvisibles}
            onCheckedChange={(checked) => updateSetting('showInvisibles', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="copyableCommand">Copyable Command</Label>
          <Input
            id="copyableCommand"
            value={settings.copyableCommand}
            onChange={(e) => updateSetting('copyableCommand', e.target.value)}
            placeholder="Enter command to display in header..."
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This command will appear in the header with a copy button for easy access
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
