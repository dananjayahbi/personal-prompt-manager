import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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
          Customize the visual appearance of the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) => updateSetting('theme', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
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
      </CardContent>
    </Card>
  )
}
