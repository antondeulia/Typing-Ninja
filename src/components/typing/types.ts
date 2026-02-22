export type TextType = "simple" | "complex" | "sentences" | "numbers" | "code";

export type ThemeMode =
  | "dark-modern"
  | "light-modern";

export type ThemeOption = {
  value: ThemeMode;
  label: string;
};

export const THEME_OPTIONS: ThemeOption[] = [
  { value: "dark-modern", label: "Dark" },
  { value: "light-modern", label: "Light" },
];

export type GenerationOptions = {
  includeNumbers: boolean;
  includePunctuation: boolean;
};

export type KeyboardKey = {
  code: string;
  label: string;
  width?: "md" | "lg" | "xl" | "space";
};

export type TextTypeOption = {
  value: TextType;
  label: string;
};

export type TimeOption = {
  value: number;
  label: string;
};
