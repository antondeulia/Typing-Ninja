import { GenerationOptions, TextType } from "@/components/typing/types";
import {
  CODE_SNIPPETS,
  COMPLEX_WORDS,
  SENTENCES,
  SIMPLE_WORDS,
} from "@/data/mock";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildWordSequence(words: string[], count: number): string {
  return Array.from({ length: count }, () => pickRandom(words)).join(" ");
}

function buildNumberSequence(count: number): string {
  return Array.from({ length: count }, () => {
    const size = 2 + Math.floor(Math.random() * 4);
    let part = "";
    for (let index = 0; index < size; index += 1) {
      part += String(Math.floor(Math.random() * 10));
    }
    return part;
  }).join(" ");
}

function withPunctuation(text: string): string {
  const punctuation = [",", ".", "!", "?", ";", ":"];
  const words = text.split(" ");

  return words
    .map((word, index) => {
      if (index === words.length - 1 || Math.random() > 0.2) {
        return word;
      }
      return `${word}${pickRandom(punctuation)}`;
    })
    .join(" ");
}

function buildCodeSequence(count: number): string {
  return Array.from({ length: count }, () => pickRandom(CODE_SNIPPETS)).join("\n");
}

export function generateText(type: TextType, options: GenerationOptions): string {
  const baseText = (() => {
    if (type === "simple") {
      return `${buildWordSequence(SIMPLE_WORDS, 100)}.`;
    }

    if (type === "complex") {
      return `${buildWordSequence(COMPLEX_WORDS, 72)}.`;
    }

    if (type === "sentences") {
      return Array.from({ length: 9 }, () => pickRandom(SENTENCES)).join(" ");
    }

    if (type === "numbers") {
      return buildNumberSequence(85);
    }

    return buildCodeSequence(14);
  })();

  if (type === "numbers" || type === "code") {
    return baseText;
  }

  let result = baseText;

  if (options.includeNumbers) {
    result = `${result} ${buildNumberSequence(24)}`;
  }

  if (options.includePunctuation) {
    result = withPunctuation(result);
  }

  return result;
}
