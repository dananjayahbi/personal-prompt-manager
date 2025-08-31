export interface Draft {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DraftState extends Draft {
  hasChanges?: boolean;
}

export interface TabTheme {
  gradient: string;
  bg: string;
  border: string;
  text: string;
  ring: string;
  hover: string;
}
