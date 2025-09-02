import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, Zap, Archive, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DraftState, Draft } from "../types";
import { getTabTheme, getWordCount, getTimeAgo, copyToClipboard } from "../utils";

interface DraftEditorProps {
  draft: DraftState;
  index: number;
  onUpdate: (id: string, field: keyof Draft, value: string) => void;
  onDelete: (id: string) => void;
}

export const DraftEditor = ({ draft, index, onUpdate, onDelete }: DraftEditorProps) => {
  const theme = getTabTheme(index);
  const wordCount = getWordCount(draft.content);
  const { toast } = useToast();

  const handleCopyContent = async () => {
    const success = await copyToClipboard(draft.content);
    if (success) {
      toast({
        title: "Copied!",
        description: "Draft content copied to clipboard",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  return (
    <TabsContent key={draft.id} value={draft.id} className="mt-6">
      <Card className={`${theme.border} ${theme.bg} backdrop-blur-sm`}>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
              <span className={theme.text}>Draft Details</span>
              {draft.hasChanges && (
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 text-xs">
                  Modified
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                className="h-8 px-3 text-xs"
                disabled={!draft.content}
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-2 border-dashed border-[#ff8888] text-[#ff0000] hover:bg-[#ffe5e5] hover:text-[#ff0000]"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{draft.title || "Untitled"}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(draft.id)}
                      className="bg-slate-600 hover:bg-slate-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 mt-[-20px]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-0">
              <label className={`text-sm font-medium ${theme.text}`}>
                Title
              </label>
              <Input
                value={draft.title}
                onChange={(e) => onUpdate(draft.id, "title", e.target.value)}
                placeholder="Enter draft title..."
                className={`${theme.border} focus:${theme.ring} transition-all duration-200`}
              />
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-medium ${theme.text}`}>
                Description
              </label>
              <Input
                value={draft.description}
                onChange={(e) => onUpdate(draft.id, "description", e.target.value)}
                placeholder="Brief description..."
                className={`${theme.border} focus:${theme.ring} transition-all duration-200`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${theme.text}`}>
                Content
              </label>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Archive className="h-3 w-3" />
                  <span>Updated {getTimeAgo(draft.updatedAt)}</span>
                </div>
              </div>
            </div>
            <Textarea
              value={draft.content}
              onChange={(e) => onUpdate(draft.id, "content", e.target.value)}
              placeholder="Start writing your draft content here..."
              className={`min-h-[400px] resize-none ${theme.border} focus:${theme.ring} transition-all duration-200`}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
