import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Draft, DraftState } from './types';
import { AUTO_SAVE_INTERVAL } from './constants';
import { createNewDraft, loadDrafts, deleteDraft, saveAllDrafts } from './draft-operations';

export const useDraftManager = () => {
  const [drafts, setDrafts] = useState<DraftState[]>([]);
  const [originalDrafts, setOriginalDrafts] = useState<Draft[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date>(new Date());
  const { toast } = useToast();

  // Load drafts on component mount
  useEffect(() => {
    loadDrafts(setDrafts, setOriginalDrafts, setActiveTab, activeTab, toast);
  }, []);

  // Auto-save effect every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasAnyChanges()) {
        saveAllDrafts(drafts, setDrafts, setOriginalDrafts, setLoading, toast, true);
        setLastAutoSave(new Date());
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [drafts]);

  const updateDraft = (id: string, field: keyof Draft, value: string) => {
    setDrafts((prev) =>
      prev.map((draft) => {
        if (draft.id === id) {
          const updatedDraft = { ...draft, [field]: value };
          const originalDraft = originalDrafts.find((orig) => orig.id === id);
          const hasChanges = originalDraft
            ? JSON.stringify(updatedDraft) !== JSON.stringify({ ...originalDraft, hasChanges: undefined })
            : true;
          return { ...updatedDraft, hasChanges };
        }
        return draft;
      })
    );
  };

  const hasAnyChanges = () => {
    return drafts.some((draft) => draft.hasChanges);
  };

  return {
    drafts,
    originalDrafts,
    activeTab,
    setActiveTab,
    loading,
    lastAutoSave,
    loadDrafts: () => loadDrafts(setDrafts, setOriginalDrafts, setActiveTab, activeTab, toast),
    createNewDraft: () => createNewDraft(drafts, setDrafts, setOriginalDrafts, setActiveTab, toast),
    updateDraft,
    deleteDraft: (id: string) => deleteDraft(id, drafts, originalDrafts, activeTab, setDrafts, setOriginalDrafts, setActiveTab, toast),
    saveAllDrafts: (isAutoSave?: boolean) => saveAllDrafts(drafts, setDrafts, setOriginalDrafts, setLoading, toast, isAutoSave),
    hasAnyChanges,
  };
};
