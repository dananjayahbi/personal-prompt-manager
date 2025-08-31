"use client";

import { MainLayout } from "@/components/main-layout";
import { Suspense, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Plus,
  Save,
  X,
  Edit3,
  Clock,
  Sparkles,
  FileText,
  Zap,
  Archive,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Draft {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DraftState extends Draft {
  hasChanges?: boolean;
}

function MultiDraftsPageContent() {
  const [drafts, setDrafts] = useState<DraftState[]>([]);
  const [originalDrafts, setOriginalDrafts] = useState<Draft[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date>(new Date());
  const { toast } = useToast();

  // Modern gradient tab themes for visual distinction
  const tabThemes = [
    {
      gradient: "from-rose-500 to-pink-500",
      bg: "bg-gradient-to-r from-rose-50 to-pink-50",
      border: "border-rose-200",
      text: "text-rose-700",
      ring: "ring-rose-300",
      hover: "hover:from-rose-100 hover:to-pink-100",
    },
    {
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
      border: "border-blue-200",
      text: "text-blue-700",
      ring: "ring-blue-300",
      hover: "hover:from-blue-100 hover:to-cyan-100",
    },
    {
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-gradient-to-r from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      ring: "ring-emerald-300",
      hover: "hover:from-emerald-100 hover:to-teal-100",
    },
    {
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-gradient-to-r from-amber-50 to-orange-50",
      border: "border-amber-200",
      text: "text-amber-700",
      ring: "ring-amber-300",
      hover: "hover:from-amber-100 hover:to-orange-100",
    },
    {
      gradient: "from-purple-500 to-violet-500",
      bg: "bg-gradient-to-r from-purple-50 to-violet-50",
      border: "border-purple-200",
      text: "text-purple-700",
      ring: "ring-purple-300",
      hover: "hover:from-purple-100 hover:to-violet-100",
    },
    {
      gradient: "from-pink-500 to-rose-500",
      bg: "bg-gradient-to-r from-pink-50 to-rose-50",
      border: "border-pink-200",
      text: "text-pink-700",
      ring: "ring-pink-300",
      hover: "hover:from-pink-100 hover:to-rose-100",
    },
    {
      gradient: "from-indigo-500 to-purple-500",
      bg: "bg-gradient-to-r from-indigo-50 to-purple-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      ring: "ring-indigo-300",
      hover: "hover:from-indigo-100 hover:to-purple-100",
    },
    {
      gradient: "from-orange-500 to-red-500",
      bg: "bg-gradient-to-r from-orange-50 to-red-50",
      border: "border-orange-200",
      text: "text-orange-700",
      ring: "ring-orange-300",
      hover: "hover:from-orange-100 hover:to-red-100",
    },
  ];

  // Load drafts on component mount
  useEffect(() => {
    loadDrafts();
  }, []);

  // Auto-save effect every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasAnyChanges()) {
        saveAllDrafts(true); // true indicates auto-save
        setLastAutoSave(new Date());
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [drafts]);

  const loadDrafts = async () => {
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
      console.error("Failed to load drafts:", error);
      toast({
        title: "Error",
        description: "Failed to load drafts",
        variant: "destructive",
      });
    }
  };

  const createNewDraft = async () => {
    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Draft",
          description: "",
          content: "",
        }),
      });

      if (response.ok) {
        const newDraft = await response.json();
        const newDraftWithChanges = { ...newDraft, hasChanges: false };
        setDrafts([...drafts, newDraftWithChanges]);
        setOriginalDrafts([...originalDrafts, newDraft]);
        setActiveTab(newDraft.id);
        toast({
          title: "Success",
          description: "New draft created",
        });
      }
    } catch (error) {
      console.error("Failed to create draft:", error);
      toast({
        title: "Error",
        description: "Failed to create new draft",
        variant: "destructive",
      });
    }
  };

  const updateDraft = (id: string, field: keyof Draft, value: string) => {
    setDrafts((prevDrafts) =>
      prevDrafts.map((draft) => {
        if (draft.id === id) {
          const updatedDraft = { ...draft, [field]: value };

          // Check if this draft has changes compared to original
          const originalDraft = originalDrafts.find((orig) => orig.id === id);
          const hasChanges =
            originalDraft &&
            (updatedDraft.title !== originalDraft.title ||
              updatedDraft.description !== originalDraft.description ||
              updatedDraft.content !== originalDraft.content);

          return { ...updatedDraft, hasChanges: !!hasChanges };
        }
        return draft;
      })
    );
  };

  const deleteDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/drafts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedDrafts = drafts.filter((draft) => draft.id !== id);
        const updatedOriginalDrafts = originalDrafts.filter(
          (orig) => orig.id !== id
        );
        setDrafts(updatedDrafts);
        setOriginalDrafts(updatedOriginalDrafts);

        // Switch to another tab if we deleted the active one
        if (activeTab === id) {
          const remainingDrafts = updatedDrafts;
          setActiveTab(remainingDrafts.length > 0 ? remainingDrafts[0].id : "");
        }

        toast({
          title: "Success",
          description: "Draft deleted",
        });
      }
    } catch (error) {
      console.error("Failed to delete draft:", error);
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive",
      });
    }
  };

  const saveAllDrafts = async (isAutoSave: boolean = false) => {
    setLoading(!isAutoSave); // Don't show loading spinner for auto-save
    try {
      const draftsToSave = drafts.map(({ hasChanges, ...draft }) => draft);
      const response = await fetch("/api/drafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drafts: draftsToSave }),
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
          description: isAutoSave
            ? "Auto-saved successfully"
            : "All drafts saved successfully",
        });
      }
    } catch (error) {
      console.error("Failed to save drafts:", error);
      if (!isAutoSave) {
        // Only show error toast for manual saves
        toast({
          title: "Error",
          description: "Failed to save drafts",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getTabTheme = (index: number) => {
    return tabThemes[index % tabThemes.length];
  };

  const hasAnyChanges = () => {
    return drafts.some((draft) => draft.hasChanges);
  };

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;

    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div
      className={`w-full h-full transition-all duration-300 ${
        isFullscreen
          ? "bg-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      <div className={`w-full h-full ${isFullscreen ? "p-0" : "p-6"}`}>
        {/* Modern Header with single row layout */}
        {!isFullscreen && (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl shadow-2xl px-6 py-4 mb-6">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Multi Drafts
                  </h1>
                </div>
                <p className="text-blue-100 text-sm">
                  Craft multiple prompt drafts with modern tools
                </p>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
                  </Badge>
                  {hasAnyChanges() && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/80 text-white border-amber-400/30 animate-pulse"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  {isFullscreen ? "Exit Focus" : "Focus Mode"}
                </Button>
                <Button
                  onClick={() => saveAllDrafts(false)}
                  disabled={loading || drafts.length === 0 || !hasAnyChanges()}
                  className="bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg px-6 py-2 font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save All"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {drafts.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm mx-auto">
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <Edit3 className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-800">
                      No drafts yet
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Start crafting your first prompt draft and unlock the
                      power of multi-draft collaboration.
                    </p>
                  </div>
                  <Button
                    onClick={createNewDraft}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8 py-3 rounded-xl font-semibold"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card
            className={`shadow-2xl border-0 bg-white/95 backdrop-blur-sm ${
              isFullscreen ? "rounded-none h-screen" : "rounded-2xl"
            }`}
          >
            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full h-full"
              >
                <div
                  className={`border-b bg-gradient-to-r from-gray-50 to-slate-50 ${
                    isFullscreen ? "px-6 py-4" : "px-6"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-transparent h-auto p-0 space-x-2 flex-wrap">
                      {drafts.map((draft, index) => {
                        const theme = getTabTheme(index);
                        return (
                          <div
                            key={draft.id}
                            className="flex items-center group"
                          >
                            <TabsTrigger
                              value={draft.id}
                              className={`
                                relative overflow-hidden transition-all duration-200
                                data-[state=active]:bg-white data-[state=active]:shadow-lg
                                border-2 border-transparent data-[state=active]:border-white
                                rounded-xl px-6 py-4 min-w-[160px]
                                ${theme.bg} ${theme.text} ${theme.hover}
                                ${
                                  draft.hasChanges
                                    ? `ring-2 ${theme.ring} ring-opacity-50`
                                    : ""
                                }
                                data-[state=active]:ring-2 data-[state=active]:ring-blue-300
                              `}
                            >
                              <div className="flex items-center gap-2 relative z-10">
                                <div
                                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}
                                ></div>
                                <span className="font-medium truncate max-w-[100px]">
                                  {draft.title || "Untitled"}
                                </span>
                                {draft.hasChanges && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              {/* Animated background effect */}
                              <div
                                className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}
                              ></div>
                            </TabsTrigger>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1 h-6 w-6 p-0 rounded-md hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Draft
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {draft.title || "Untitled"}"? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteDraft(draft.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        );
                      })}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={createNewDraft}
                        className="ml-4 h-12 w-12 p-0 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </TabsList>

                    {isFullscreen && (
                      <Button
                        onClick={() => setIsFullscreen(false)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                      >
                        Exit Focus
                      </Button>
                    )}
                  </div>
                </div>

                {drafts.map((draft, index) => {
                  const theme = getTabTheme(index);
                  const wordCount = getWordCount(draft.content);

                  return (
                    <TabsContent
                      key={draft.id}
                      value={draft.id}
                      className={`mt-0 ${
                        isFullscreen ? "h-[calc(100vh-120px)]" : "min-h-[600px]"
                      }`}
                    >
                      <div className="grid grid-cols-12 h-full">
                        {/* Main Content Area */}
                        <div
                          className={`${
                            isFullscreen ? "col-span-9" : "col-span-12"
                          } p-6 space-y-6`}
                        >
                          {/* Title and Description Row */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Edit3 className="w-4 h-4" />
                                Title
                              </label>
                              <Input
                                value={draft.title}
                                onChange={(e) =>
                                  updateDraft(draft.id, "title", e.target.value)
                                }
                                placeholder="Enter draft title..."
                                className="text-xl font-semibold border-2 focus:border-blue-400 rounded-xl bg-gray-50/50 transition-all duration-200"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="w-4 h-4" />
                                Description
                              </label>
                              <Input
                                value={draft.description}
                                onChange={(e) =>
                                  updateDraft(
                                    draft.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Brief description of this draft..."
                                className="border-2 focus:border-blue-400 rounded-xl bg-gray-50/50 transition-all duration-200"
                              />
                            </div>
                          </div>

                          {/* Content Area */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Sparkles className="w-4 h-4" />
                                Prompt Content
                              </label>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {wordCount} words
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {getTimeAgo(draft.updatedAt)}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      draft.content
                                    );
                                    toast({
                                      title: "Content copied to clipboard!",
                                    });
                                  }}
                                  className="h-8 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 border-blue-200"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </Button>
                              </div>
                            </div>
                            <div className="relative">
                              <Textarea
                                value={draft.content}
                                onChange={(e) =>
                                  updateDraft(
                                    draft.id,
                                    "content",
                                    e.target.value
                                  )
                                }
                                placeholder="Write your prompt content here... ✨"
                                className={`
                                  ${
                                    isFullscreen
                                      ? "min-h-[calc(100vh-300px)]"
                                      : "min-h-[450px]"
                                  } 
                                  text-base leading-relaxed resize-none border-2 
                                  focus:border-blue-400 rounded-xl bg-gray-50/30 
                                  transition-all duration-200 p-6
                                  ${
                                    draft.hasChanges
                                      ? "border-orange-300 bg-orange-50/30"
                                      : ""
                                  }
                                `}
                              />
                              {draft.hasChanges && (
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-orange-500 text-white">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Unsaved
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Sidebar - Only in fullscreen mode */}
                        {isFullscreen && (
                          <div className="col-span-3 border-l bg-gray-50/50 p-6 space-y-6">
                            <div
                              className={`p-4 rounded-xl ${theme.bg} border ${theme.border}`}
                            >
                              <h3
                                className={`font-semibold mb-3 ${theme.text}`}
                              >
                                Draft Info
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <Badge
                                    variant={
                                      draft.hasChanges
                                        ? "destructive"
                                        : "default"
                                    }
                                    className="text-xs"
                                  >
                                    {draft.hasChanges ? "Modified" : "Saved"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Words:</span>
                                  <span className="font-medium">
                                    {wordCount}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Characters:
                                  </span>
                                  <span className="font-medium">
                                    {draft.content.length}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Created:
                                  </span>
                                  <span className="font-medium">
                                    {getTimeAgo(draft.createdAt)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Updated:
                                  </span>
                                  <span className="font-medium">
                                    {getTimeAgo(draft.updatedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h3 className="font-semibold text-gray-700">
                                Quick Actions
                              </h3>
                              <div className="grid grid-cols-1 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="justify-start rounded-lg"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      draft.content
                                    );
                                    toast({ title: "Copied to clipboard!" });
                                  }}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Content
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="justify-start rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Delete Draft
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Draft
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {draft.title || "Untitled"}"? This
                                        action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteDraft(draft.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer - Only in non-fullscreen mode */}
                      {!isFullscreen && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-6">
                              <span>
                                Created:{" "}
                                {new Date(draft.createdAt).toLocaleDateString()}
                              </span>
                              <span>
                                Last updated:{" "}
                                {new Date(draft.updatedAt).toLocaleDateString()}
                              </span>
                              <span>
                                {wordCount} words • {draft.content.length}{" "}
                                characters
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {draft.hasChanges && (
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-700"
                                >
                                  <Zap className="w-3 h-3 mr-1" />
                                  Unsaved changes
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFullscreen(true)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Focus Mode
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MultiDraftsPage() {
  return (
    <MainLayout collapseSidebar={true} fullWidth={true}>
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
      >
        <MultiDraftsPageContent />
      </Suspense>
    </MainLayout>
  );
}
