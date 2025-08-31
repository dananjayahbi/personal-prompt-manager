import { TabTheme } from './types';

// Modern gradient tab themes for visual distinction
export const tabThemes: TabTheme[] = [
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

export const AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes
