import { FiRotateCcw, FiSettings } from "react-icons/fi";
import { StyleModule } from "@/shared/types/style";
import { formatTime } from "@/utils/typing/time";

type TopPanelProps = {
  styles: StyleModule;
  timeLeft: number;
  accuracy: number;
  wpm: number;
  progress: number;
  settingsOpen: boolean;
  onReset: () => void;
  onToggleSettings: () => void;
};

export function TopPanel({
  styles,
  timeLeft,
  accuracy,
  wpm,
  progress,
  settingsOpen,
  onReset,
  onToggleSettings,
}: TopPanelProps) {
  return (
    <header className={styles.compactTopPanel}>
      <section className={styles.metricsInline}>
        <article>
          <span>Time</span>
          <strong>{formatTime(timeLeft)}</strong>
        </article>
        <article>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </article>
        <article>
          <span>WPM</span>
          <strong>{wpm}</strong>
        </article>
        <article>
          <span>Progress</span>
          <strong>{progress}%</strong>
        </article>
      </section>

      <div className={styles.toolbarActions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={onReset}
          aria-label="Reset session"
          title="Reset"
        >
          <FiRotateCcw />
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${settingsOpen ? styles.actionButtonActive : ""}`}
          onClick={onToggleSettings}
          aria-label="Open settings"
          title="Settings"
        >
          <FiSettings />
        </button>
      </div>
    </header>
  );
}
