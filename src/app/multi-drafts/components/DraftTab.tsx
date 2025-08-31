import { TabsTrigger } from "@/components/ui/tabs";
import { Edit3 } from "lucide-react";
import { DraftState } from "../types";

interface DraftTabProps {
  draft: DraftState;
  index: number;
}

export const DraftTab = ({ draft, index }: DraftTabProps) => {
  return (
    <TabsTrigger 
      key={draft.id} 
      value={draft.id}
      className={`
        relative data-[state=active]:bg-blue-50 data-[state=active]:border-blue-200 
        data-[state=active]:text-blue-800 data-[state=active]:shadow-sm
        hover:bg-blue-50/50 transition-all duration-200 px-3 py-2.5 rounded-lg
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
      </div>
    </TabsTrigger>
  );
};
