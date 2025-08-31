import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Upload, Trash2, RefreshCw } from "lucide-react";

interface DataManagementProps {
  onExport: () => void;
  onImport: () => void;
  onClearAll: () => void;
}

export const DataManagement = ({ onExport, onImport, onClearAll }: DataManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Backup, restore, and manage your prompt data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onImport}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Settings
          </Button>
        </div>

        <div className="pt-4 border-t border-red-200">
          <h4 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h4>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onClearAll}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Data
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This action cannot be undone. All your prompts and settings will be permanently deleted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
