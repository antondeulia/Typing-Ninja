import { TEXT_TYPE_OPTIONS, TIME_OPTIONS } from "@/data/mock";
import { StyleModule } from "@/shared/types/style";
import { TextType, ThemeMode, THEME_OPTIONS } from "./types";

type SettingsPanelProps = {
  styles: StyleModule;
  textType: TextType;
  duration: number;
  includeNumbers: boolean;
  includePunctuation: boolean;
  showKeyboard: boolean;
  theme: ThemeMode;
  onTextTypeChange: (value: TextType) => void;
  onDurationChange: (value: number) => void;
  onToggleNumbers: () => void;
  onTogglePunctuation: () => void;
  onToggleKeyboard: () => void;
  onFocusMode: () => void;
  onThemeChange: (value: ThemeMode) => void;
};

export function SettingsPanel({
  styles,
  textType,
  duration,
  includeNumbers,
  includePunctuation,
  showKeyboard,
  theme,
  onTextTypeChange,
  onDurationChange,
  onToggleNumbers,
  onTogglePunctuation,
  onToggleKeyboard,
  onFocusMode,
  onThemeChange,
}: SettingsPanelProps) {
  return (
    <section className={styles.settingsDropdown}>
      <div className={styles.settingsGroup}>
        <label htmlFor="textType">Text difficulty</label>
        <select
          id="textType"
          value={textType}
          onChange={(event) => onTextTypeChange(event.target.value as TextType)}
        >
          {TEXT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.settingsGroup}>
        <span>Timer</span>
        <div className={styles.pillsRow}>
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.pill} ${duration === option.value ? styles.pillActive : ""}`}
              onClick={() => onDurationChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <span>Text extras</span>
        <div className={styles.pillsRow}>
          <button
            type="button"
            className={`${styles.pill} ${includeNumbers ? styles.pillActive : ""}`}
            onClick={onToggleNumbers}
          >
            Add numbers
          </button>
          <button
            type="button"
            className={`${styles.pill} ${includePunctuation ? styles.pillActive : ""}`}
            onClick={onTogglePunctuation}
          >
            Add punctuation
          </button>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <span>View</span>
        <div className={styles.pillsRow}>
          <button
            type="button"
            className={`${styles.pill} ${showKeyboard ? styles.pillActive : ""}`}
            onClick={onToggleKeyboard}
          >
            Keyboard
          </button>
          <button type="button" className={styles.pill} onClick={onFocusMode}>
            Focus mode
          </button>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <span>Theme</span>
        <div className={styles.pillsRow}>
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.pill} ${theme === option.value ? styles.pillActive : ""}`}
              onClick={() => onThemeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
