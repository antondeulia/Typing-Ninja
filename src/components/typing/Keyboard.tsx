import { KEYBOARD_ROWS } from "@/data/mock";
import { StyleModule } from "@/shared/types/style";

type KeyboardProps = {
  styles: StyleModule;
  activeCode: string;
};

export function Keyboard({ styles, activeCode }: KeyboardProps) {
  return (
    <section className={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className={styles.keyRow}>
          {row.map((key) => (
            <span
              key={key.code}
              className={`${styles.key} ${styles[`keyWidth_${key.width ?? "md"}`]} ${
                activeCode === key.code ? styles.keyActive : ""
              }`}
            >
              {key.label}
            </span>
          ))}
        </div>
      ))}
    </section>
  );
}
