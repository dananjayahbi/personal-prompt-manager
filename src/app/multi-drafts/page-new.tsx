"use client";

import { MainLayout } from "@/components/main-layout";
import { Suspense, useState } from "react";
import { Tabs, TabsList } from "@/components/ui/tabs";
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
    <MainLayout fullWidth>
      <div className="space-y-6">
        <HeaderSection
          draftsCount={drafts.length}
          hasChanges={hasAnyChanges()}
          loading={loading}
          lastAutoSave={lastAutoSave}
          onCreateNew={createNewDraft}
          onSaveAll={() => saveAllDrafts(false)}
        />

        {drafts.length === 0 ? (
          <EmptyState onCreateNew={createNewDraft} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList 
              className="grid w-full grid-flow-col auto-cols-fr gap-2 h-auto p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-x-auto"
              style={{ gridTemplateColumns: `repeat(${drafts.length}, 1fr)` }}
            >
              {drafts.map((draft, index) => (
                <DraftTab
                  key={draft.id}
                  draft={draft}
                  index={index}
                  onDelete={deleteDraft}
                />
              ))}
            </TabsList>

            {drafts.map((draft, index) => (
              <DraftEditor
                key={draft.id}
                draft={draft}
                index={index}
                onUpdate={updateDraft}
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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <MultiDraftsPageContent />
    </Suspense>
  );
}
