export type TextType = "simple" | "complex" | "sentences" | "numbers" | "code";

export type ThemeMode = "dark" | "light";

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
