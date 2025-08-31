"use client";

import { MainLayout } from "@/components/main-layout";
import { Suspense, useState } from "react";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDraftManager } from "./hooks";
import { HeaderSection } from "./components/HeaderSection";
import { DraftTab } from "./components/DraftTab";
import { DraftEditor } from "./components/DraftEditor";
import { EmptyState } from "./components/EmptyState";

function MultiDraftsPageContent() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {
    drafts,
    activeTab,
    setActiveTab,
    loading,
    lastAutoSave,
    createNewDraft,
    updateDraft,
    deleteDraft,
    saveAllDrafts,
    hasAnyChanges,
  } = useDraftManager();

  return (
    <MainLayout fullWidth collapseSidebar>
      <div className="space-y-6 p-6">
        <HeaderSection
          draftsCount={drafts.length}
          hasChanges={hasAnyChanges()}
          loading={loading}
          lastAutoSave={lastAutoSave}
          onSaveAll={() => saveAllDrafts(false)}
        />

        {drafts.length === 0 ? (
          <EmptyState onCreateNew={createNewDraft} />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-[-10px]">
              <TabsList className="flex gap-1 h-auto p-1 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
                {drafts.map((draft, index) => (
                  <DraftTab key={draft.id} draft={draft} index={index} />
                ))}
              </TabsList>

              <Button
                onClick={createNewDraft}
                variant="outline"
                className="border-2 w-20 h-12 border-dashed border-[#94c5fc] text-[#0067dd] hover:bg-[#e6f7ff] rounded-lg bg-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {drafts.map((draft, index) => (
              <DraftEditor
                key={draft.id}
                draft={draft}
                index={index}
                onUpdate={updateDraft}
                onDelete={deleteDraft}
              />
            ))}
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}

export default function MultiDraftsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <MultiDraftsPageContent />
    </Suspense>
  );
}
