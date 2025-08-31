import { TabsTrigger } from "@/components/ui/tabs";
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
import { X, Edit3 } from "lucide-react";
import { DraftState } from "../types";
import { getTabTheme } from "../utils";

interface DraftTabProps {
  draft: DraftState;
  index: number;
  onDelete: (id: string) => void;
}

export const DraftTab = ({ draft, index, onDelete }: DraftTabProps) => {
  const theme = getTabTheme(index);

  return (
    <TabsTrigger 
      key={draft.id} 
      value={draft.id}
      className={`
        relative group data-[state=active]:${theme.bg} data-[state=active]:${theme.border} 
        data-[state=active]:${theme.text} data-[state=active]:shadow-sm
        hover:${theme.hover} transition-all duration-200 px-4 py-2.5 rounded-lg
        min-w-[120px] max-w-[200px]
      `}
    >
      <div className="flex items-center gap-2 w-full">
        <Edit3 className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate font-medium text-sm">
          {draft.title || "Untitled"}
        </span>
        {draft.hasChanges && (
          <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={(e) => e.stopPropagation()}
            >
              <X className="h-3 w-3" />
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
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TabsTrigger>
  );
};
