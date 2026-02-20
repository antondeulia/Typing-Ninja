import { RefObject } from "react";
import { StyleModule } from "@/shared/types/style";

type TrainingTextProps = {
  styles: StyleModule;
  trainingText: string;
  typed: string;
  finished: boolean;
  textBoxRef: RefObject<HTMLDivElement | null>;
  currentCharRef: RefObject<HTMLSpanElement | null>;
  onFocusInput: () => void;
};

export function TrainingText({
  styles,
  trainingText,
  typed,
  finished,
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

        return (
          <span
            ref={index === typed.length ? currentCharRef : null}
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
