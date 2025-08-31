import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import type { SettingsData } from './types'

interface EditorSettingsProps {
  settings: SettingsData
  updateSetting: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => void
}

export function EditorSettings({ settings, updateSetting }: EditorSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor</CardTitle>
        <CardDescription>
          Configure editor behavior and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tabSize">Tab Size: {settings.tabSize} spaces</Label>
          <Slider
            id="tabSize"
            min={2}
            max={8}
            step={1}
            value={[settings.tabSize]}
            onValueChange={(value) => updateSetting('tabSize', value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Number of spaces per tab indentation
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="bracketMatching">Bracket Matching</Label>
            <p className="text-sm text-muted-foreground">
              Highlight matching brackets when cursor is nearby
            </p>
          </div>
          <Switch
            id="bracketMatching"
            checked={settings.bracketMatching}
            onCheckedChange={(checked) => updateSetting('bracketMatching', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">Auto Save</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save changes as you type
            </p>
          </div>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={(checked) => updateSetting('autoSave', checked)}
          />
        </div>

        {settings.autoSave && (
          <div className="space-y-2">
            <Label htmlFor="autoSaveInterval">
              Auto Save Interval: {settings.autoSaveInterval}ms
            </Label>
            <Slider
              id="autoSaveInterval"
              min={500}
              max={5000}
              step={100}
              value={[settings.autoSaveInterval]}
              onValueChange={(value) => updateSetting('autoSaveInterval', value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Time to wait before auto-saving changes
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="defaultCategory">Default Category</Label>
          <Select
            value={settings.defaultCategory}
            onValueChange={(value) => updateSetting('defaultCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exportFormat">Default Export Format</Label>
          <Select
            value={settings.exportFormat}
            onValueChange={(value) => updateSetting('exportFormat', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="txt">Plain Text</SelectItem>
              <SelectItem value="md">Markdown</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
