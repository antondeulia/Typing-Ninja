import { RefObject } from "react";
import { StyleModule } from "@/shared/types/style";

type TrainingTextProps = {
  styles: StyleModule;
  trainingText: string;
  typed: string;
  activeIndex: number;
  finished: boolean;
  blockedErrorIndex?: number | null;
  textBoxRef: RefObject<HTMLDivElement | null>;
  currentCharRef: RefObject<HTMLSpanElement | null>;
  onFocusInput: () => void;
};

export function TrainingText({
  styles,
  trainingText,
  typed,
  activeIndex,
  finished,
  blockedErrorIndex = null,
  textBoxRef,
  currentCharRef,
  onFocusInput,
}: TrainingTextProps) {
  return (
    <section
      ref={textBoxRef}
      role="button"
      tabIndex={0}
      onClick={onFocusInput}
      onFocus={onFocusInput}
      className={styles.textArea}
    >
      {trainingText.split("").map((char, index) => {
        const isSpace = char === " ";
        let className = styles.char;

        if (index < typed.length) {
          className =
            typed[index] === char
              ? `${styles.char} ${styles.correct}`
              : `${styles.char} ${styles.wrong}`;
        } else if (index === typed.length && !finished) {
          className = `${styles.char} ${styles.current}`;
        } else {
          className = `${styles.char} ${styles.pending}`;
        }

        if (index === activeIndex && !finished) {
          className = `${className} ${styles.current}`;
        }

        if (index === blockedErrorIndex && !finished) {
          className = `${styles.char} ${styles.wrong} ${styles.current}`;
        }

        if (isSpace) {
          className = `${className} ${styles.spaceChar}`;
        }

        return (
          <span
            ref={index === activeIndex ? currentCharRef : null}
            key={`${char}-${index}`}
            className={className}
          >
            {char}
          </span>
        );
      })}
    </section>
  );
}

