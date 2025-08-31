import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Clock } from "lucide-react";

interface HeaderSectionProps {
  draftsCount: number;
  hasChanges: boolean;
  loading: boolean;
  lastAutoSave: Date;
  onCreateNew: () => void;
  onSaveAll: () => void;
}

export const HeaderSection = ({
  draftsCount,
  hasChanges,
  loading,
  lastAutoSave,
  onCreateNew,
  onSaveAll,
}: HeaderSectionProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Multi Drafts
          </h1>
          {draftsCount > 0 && (
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700"
            >
              {draftsCount} {draftsCount === 1 ? 'draft' : 'drafts'}
            </Badge>
          )}
          {hasChanges && (
            <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
              Unsaved changes
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last auto-save: {lastAutoSave.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Draft
        </Button>
        
        <Button
          onClick={onSaveAll}
          disabled={loading || !hasChanges}
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Save className="mr-2 h-4 w-4" />
          Save All
        </Button>
      </div>
    </div>
  );
};
