"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  Palette,
  Database,
  Keyboard
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "system",
    autoSave: true,
    autoSaveInterval: 30,
    defaultCategory: "Other",
    exportFormat: "json",
    showLineNumbers: true,
    fontSize: 14,
    fontFamily: "mono",
    wordWrap: true
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const exportData = () => {
    // This would typically fetch all prompts and export them
    console.log("Exporting data...")
  }

  const importData = () => {
    // This would handle file import
    console.log("Importing data...")
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      console.log("Clearing all data...")
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Customize your prompt management experience
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  {["light", "dark", "system"].map((theme) => (
                    <Button
                      key={theme}
                      variant={settings.theme === theme ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange("theme", theme)}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="12"
                    max="20"
                    value={settings.fontSize}
                    onChange={(e) => handleSettingChange("fontSize", parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Badge variant="outline">{settings.fontSize}px</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <div className="flex gap-2">
                  {["mono", "sans", "serif"].map((font) => (
                    <Button
                      key={font}
                      variant={settings.fontFamily === font ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange("fontFamily", font)}
                    >
                      {font.charAt(0).toUpperCase() + font.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="word-wrap"
                  checked={settings.wordWrap}
                  onCheckedChange={(checked) => handleSettingChange("wordWrap", checked)}
                />
                <Label htmlFor="word-wrap">Word Wrap</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="line-numbers"
                  checked={settings.showLineNumbers}
                  onCheckedChange={(checked) => handleSettingChange("showLineNumbers", checked)}
                />
                <Label htmlFor="line-numbers">Show Line Numbers</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your prompt data and backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Auto Save</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-save"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                  />
                  <Label htmlFor="auto-save">Enable auto-save</Label>
                </div>
                {settings.autoSave && (
                  <div className="flex items-center gap-2 mt-2">
                    <Label>Interval (seconds)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="300"
                      value={settings.autoSaveInterval}
                      onChange={(e) => handleSettingChange("autoSaveInterval", parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Default Category</Label>
                <Input
                  value={settings.defaultCategory}
                  onChange={(e) => handleSettingChange("defaultCategory", e.target.value)}
                  placeholder="Enter default category"
                />
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <div className="flex gap-2">
                  {["json", "csv", "markdown"].map((format) => (
                    <Button
                      key={format}
                      variant={settings.exportFormat === format ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange("exportFormat", format)}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Data Operations</Label>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={exportData} className="justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                  <Button variant="outline" onClick={importData} className="justify-start">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={clearAllData}
                    className="justify-start"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Editor Settings
              </CardTitle>
              <CardDescription>
                Configure the prompt editor behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tab Size</Label>
                <div className="flex gap-2">
                  {[2, 4, 8].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSettingChange("tabSize", size)}
                    >
                      {size} spaces
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Editor Shortcuts</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl+S</kbd> - Save prompt</div>
                  <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl+F</kbd> - Find in prompt</div>
                  <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl+D</kbd> - Duplicate line</div>
                  <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl+/</kbd> - Toggle comment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                Information about the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Version</span>
                  <Badge variant="secondary">1.0.0</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">Just now</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Environment</span>
                  <Badge variant="outline">Development</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Support</Label>
                <div className="text-sm text-muted-foreground">
                  <p>For support and feature requests, please visit the documentation or contact the development team.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}