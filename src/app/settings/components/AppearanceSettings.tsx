import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";
import { SettingsData } from "../types";

interface AppearanceSettingsProps {
  settings: SettingsData;
  onSettingChange: (key: string, value: any) => void;
}

export const AppearanceSettings = ({ settings, onSettingChange }: AppearanceSettingsProps) => {
  return (
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
                onClick={() => onSettingChange("theme", theme)}
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
              onChange={(e) => onSettingChange("fontSize", parseInt(e.target.value))}
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
                onClick={() => onSettingChange("fontFamily", font)}
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
            onCheckedChange={(checked) => onSettingChange("wordWrap", checked)}
          />
          <Label htmlFor="word-wrap">Word Wrap</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="line-numbers"
            checked={settings.showLineNumbers}
            onCheckedChange={(checked) => onSettingChange("showLineNumbers", checked)}
          />
          <Label htmlFor="line-numbers">Show Line Numbers</Label>
        </div>
      </CardContent>
    </Card>
  );
};
