import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";
import { SettingsData } from "../types";

interface EditorSettingsProps {
  settings: SettingsData;
  onSettingChange: (key: string, value: any) => void;
}

export const EditorSettings = ({ settings, onSettingChange }: EditorSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Editor Preferences
        </CardTitle>
        <CardDescription>
          Configure auto-save and editing behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-save"
            checked={settings.autoSave}
            onCheckedChange={(checked) => onSettingChange("autoSave", checked)}
          />
          <Label htmlFor="auto-save">Enable Auto-Save</Label>
        </div>

        {settings.autoSave && (
          <div className="space-y-2">
            <Label>Auto-Save Interval (seconds)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="range"
                min="10"
                max="300"
                step="10"
                value={settings.autoSaveInterval}
                onChange={(e) => onSettingChange("autoSaveInterval", parseInt(e.target.value))}
                className="flex-1"
              />
              <Badge variant="outline">{settings.autoSaveInterval}s</Badge>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="default-category">Default Category</Label>
          <Input
            id="default-category"
            value={settings.defaultCategory}
            onChange={(e) => onSettingChange("defaultCategory", e.target.value)}
            placeholder="Enter default category..."
          />
        </div>

        <div className="space-y-2">
          <Label>Export Format</Label>
          <div className="flex gap-2">
            {["json", "txt", "csv"].map((format) => (
              <Badge
                key={format}
                variant={settings.exportFormat === format ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onSettingChange("exportFormat", format)}
              >
                {format.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
