import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
}

export const EmptyState = ({ onCreateNew }: EmptyStateProps) => {
  return (
    <Card className="border-dashed border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No drafts yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Create your first draft to start building and organizing your AI prompts with our powerful multi-draft system.
        </p>
        
        <Button
          onClick={onCreateNew}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Your First Draft
        </Button>
        
        <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>AI-Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Multi-Format</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
