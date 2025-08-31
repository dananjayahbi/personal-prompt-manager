import { Draft, DraftState } from './types';

export const createNewDraft = async (drafts: DraftState[], setDrafts: Function, setOriginalDrafts: Function, setActiveTab: Function, toast: Function) => {
  try {
    const response = await fetch("/api/drafts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Draft ${drafts.length + 1}`,
        description: "",
        content: "",
      }),
    });

    if (response.ok) {
      const newDraft = await response.json();
      const newDraftWithChanges = { ...newDraft, hasChanges: false };
      setDrafts((prev: DraftState[]) => [...prev, newDraftWithChanges]);
      setOriginalDrafts((prev: Draft[]) => [...prev, newDraft]);
      setActiveTab(newDraft.id);
      
      toast({
        title: "Success",
        description: "New draft created",
      });
    }
  } catch (error) {
    console.error("Error creating draft:", error);
    toast({
      title: "Error",
      description: "Failed to create new draft",
      variant: "destructive",
    });
  }
};

export const loadDrafts = async (setDrafts: Function, setOriginalDrafts: Function, setActiveTab: Function, activeTab: string, toast: Function) => {
  try {
    const response = await fetch("/api/drafts");
    if (response.ok) {
      const data = await response.json();
      const draftsWithChanges = data.map((draft: Draft) => ({
        ...draft,
        hasChanges: false,
      }));
      setDrafts(draftsWithChanges);
      setOriginalDrafts(data);
      
      if (data.length > 0 && !activeTab) {
        setActiveTab(data[0].id);
      }
    }
  } catch (error) {
    console.error("Error loading drafts:", error);
    toast({
      title: "Error",
      description: "Failed to load drafts",
      variant: "destructive",
    });
  }
};

export const deleteDraft = async (
  id: string, 
  drafts: DraftState[], 
  originalDrafts: Draft[], 
  activeTab: string,
  setDrafts: Function, 
  setOriginalDrafts: Function, 
  setActiveTab: Function, 
  toast: Function
) => {
  try {
    const response = await fetch(`/api/drafts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const updatedDrafts = drafts.filter((draft) => draft.id !== id);
      const updatedOriginalDrafts = originalDrafts.filter(
        (draft) => draft.id !== id
      );
      setDrafts(updatedDrafts);
      setOriginalDrafts(updatedOriginalDrafts);

      if (activeTab === id) {
        if (updatedDrafts.length > 0) {
          const deletedIndex = drafts.findIndex((draft) => draft.id === id);
          const newActiveIndex = deletedIndex > 0 ? deletedIndex - 1 : 0;
          setActiveTab(updatedDrafts[newActiveIndex]?.id || "");
        } else {
          setActiveTab("");
        }
      }

      toast({
        title: "Success",
        description: "Draft deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting draft:", error);
    toast({
      title: "Error",
      description: "Failed to delete draft",
      variant: "destructive",
    });
  }
};

export const saveAllDrafts = async (
  drafts: DraftState[], 
  setDrafts: Function, 
  setOriginalDrafts: Function, 
  setLoading: Function, 
  toast: Function, 
  isAutoSave: boolean = false
) => {
  setLoading(true);
  try {
    const draftsToSave = drafts.map(({ hasChanges, ...draft }) => draft);
    const response = await fetch("/api/drafts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draftsToSave),
    });

    if (response.ok) {
      const updatedDrafts = await response.json();
      const draftsWithChanges = updatedDrafts.map((draft: Draft) => ({
        ...draft,
        hasChanges: false,
      }));
      setDrafts(draftsWithChanges);
      setOriginalDrafts(updatedDrafts);

      toast({
        title: "Success",
        description: isAutoSave ? "Auto-saved all drafts" : "All drafts saved successfully",
      });
    }
  } catch (error) {
    console.error("Error saving drafts:", error);
    toast({
      title: "Error",
      description: "Failed to save drafts",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
