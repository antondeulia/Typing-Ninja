"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { Keyboard } from "@/components/typing/Keyboard";
import { SettingsPanel } from "@/components/typing/SettingsPanel";
import { TopPanel } from "@/components/typing/TopPanel";
import { TrainingText } from "@/components/typing/TrainingText";
import { useTypingSound } from "@/components/typing/useTypingSound";
import { TextType, ThemeMode, THEME_OPTIONS } from "@/components/typing/types";
import { generateText } from "@/utils/typing/text";
import styles from "./page.module.css";

const THEME_STORAGE_KEY = "typing-ninja-theme";
const DEFAULT_THEME: ThemeMode = "dark-modern";
const THEME_VALUES = new Set<ThemeMode>(THEME_OPTIONS.map((option) => option.value));

const getStoredTheme = (value: string | null): ThemeMode | null => {
  if (value === "dark") {
    return "dark-modern";
  }

  if (value === "light") {
    return "light-modern";
  }

  if (value && THEME_VALUES.has(value as ThemeMode)) {
    return value as ThemeMode;
  }

  return null;
};

const hasUnfixedMistake = (typedValue: string, expectedValue: string) => {
  for (let index = 0; index < typedValue.length; index += 1) {
    if (typedValue[index] !== expectedValue[index]) {
      return true;
    }
  }
  return false;
};

const removeLastWord = (value: string) => {
  const withoutTrailingSpaces = value.replace(/\s+$/, "");
  return withoutTrailingSpaces.replace(/\S+$/, "");
};

export default function Home() {
  const { isAuthModalOpen } = useAuthModal();
  const { playTypingSound } = useTypingSound();
  const [theme, setTheme] = useState<ThemeMode>(DEFAULT_THEME);
  const [textType, setTextType] = useState<TextType>("simple");
  const [duration, setDuration] = useState(60);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [blockOnError, setBlockOnError] = useState(false);
  const [trainingText, setTrainingText] = useState(() =>
    generateText("simple", { includeNumbers: false, includePunctuation: false }),
  );
  const [typed, setTyped] = useState("");
  const [blockedErrorIndex, setBlockedErrorIndex] = useState<number | null>(null);
  const [errorAttempts, setErrorAttempts] = useState(0);
  const [activeCode, setActiveCode] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsedAtFinish, setElapsedAtFinish] = useState<number | null>(null);
  const [resultModalDismissed, setResultModalDismissed] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const resultModalOpen = finished && !resultModalDismissed;

  const textBoxRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);
  const flashTimeoutRef = useRef<number | null>(null);
  const shareTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const storedTheme = getStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current);
      }
      if (shareTimeoutRef.current) {
        window.clearTimeout(shareTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!started || finished) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          setFinished(true);
          setStarted(false);
          setElapsedAtFinish(duration);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [started, finished, duration]);

  useEffect(() => {
    const textBox = textBoxRef.current;
    const currentChar = currentCharRef.current;

    if (!textBox || !currentChar) {
      return;
    }

    const stylesMap = window.getComputedStyle(textBox);
    const lineHeight = Number.parseFloat(stylesMap.lineHeight);
    if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
      return;
    }

    const paddingTop = Number.parseFloat(stylesMap.paddingTop) || 0;
    const relativeTop = currentChar.offsetTop - textBox.offsetTop - paddingTop;
    const visibleLines = 3;
    const targetActiveLineInViewport = 1;
    const currentLine = Math.max(0, Math.floor(relativeTop / lineHeight));
    const normalizedScrollTop = Math.max(0, textBox.scrollTop - paddingTop);
    const firstVisibleLine = Math.floor(normalizedScrollTop / lineHeight);
    const desiredFirstVisibleLine = Math.max(0, currentLine - targetActiveLineInViewport);
    const maxAllowedFirstVisibleLine = Math.max(0, firstVisibleLine + (visibleLines - 1));

    if (currentLine > maxAllowedFirstVisibleLine || firstVisibleLine !== desiredFirstVisibleLine) {
      textBox.scrollTop = Math.round(
        Math.max(0, paddingTop + desiredFirstVisibleLine * lineHeight),
      );
    }
  }, [typed, trainingText]);

  const resetSession = (
    nextTextType: TextType = textType,
    nextDuration: number = duration,
    nextIncludeNumbers: boolean = includeNumbers,
    nextIncludePunctuation: boolean = includePunctuation,
  ) => {
    setTrainingText(
      generateText(nextTextType, {
        includeNumbers: nextIncludeNumbers,
        includePunctuation: nextIncludePunctuation,
      }),
    );
    setTyped("");
    setBlockedErrorIndex(null);
    setErrorAttempts(0);
    setStarted(false);
    setFinished(false);
    setElapsedAtFinish(null);
    setResultModalDismissed(false);
    setShareFeedback("");
    if (shareTimeoutRef.current) {
      window.clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = null;
    }
    setTimeLeft(nextDuration);
    setActiveCode("");
  };

  const flashKey = (code: string) => {
    setActiveCode(code);
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = window.setTimeout(() => {
      setActiveCode("");
    }, 150);
  };

  const handleTypingKey = useCallback(
    (event: Pick<globalThis.KeyboardEvent, "key" | "code" | "ctrlKey" | "altKey" | "metaKey" | "preventDefault">) => {
    if (event.key === "Escape") {
      setFocusMode(false);
      return;
    }

    if (event.altKey || event.metaKey || event.key === "Tab") {
      return;
    }

    event.preventDefault();
    flashKey(event.code);

    if (finished) {
      return;
    }

    if (event.key === "Backspace") {
      playTypingSound("backspace");
      setStarted(true);
      setBlockedErrorIndex(null);
      setTyped((prev) => (event.ctrlKey ? removeLastWord(prev) : prev.slice(0, -1)));
      return;
    }

    if (event.ctrlKey) {
      return;
    }

    const nextChar = event.key === "Enter" ? "\n" : event.key;

    if (nextChar.length !== 1) {
      return;
    }

    playTypingSound(nextChar === " " ? "space" : "default");
    setStarted(true);
    setTyped((prev) => {
      if (prev.length >= trainingText.length) {
        return prev;
      }

      if (blockOnError && nextChar !== trainingText[prev.length]) {
        setBlockedErrorIndex(prev.length);
        setErrorAttempts((prevAttempts) => prevAttempts + 1);
        return prev;
      }

      setBlockedErrorIndex(null);
      const nextValue = prev + nextChar;

      if (nextValue.length >= trainingText.length && !hasUnfixedMistake(nextValue, trainingText)) {
        setElapsedAtFinish(Math.max(1, duration - timeLeft));
        setFinished(true);
        setStarted(false);
      }
      return nextValue;
    });
    },
    [blockOnError, duration, finished, playTypingSound, timeLeft, trainingText],
  );

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (isAuthModalOpen) {
        if (event.key === "Escape") {
          return;
        }
        return;
      }

      if (resultModalOpen) {
        if (event.key === "Escape") {
          setResultModalDismissed(true);
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      const isEditableTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable === true;

      if (isEditableTarget) {
        return;
      }

      handleTypingKey(event);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleTypingKey, isAuthModalOpen, resultModalOpen]);

  const elapsedSeconds = useMemo(() => {
    if (elapsedAtFinish !== null) {
      return elapsedAtFinish;
    }
    return started ? duration - timeLeft : 0;
  }, [duration, elapsedAtFinish, started, timeLeft]);

  const correctChars = useMemo(() => {
    let total = 0;
    for (let index = 0; index < typed.length; index += 1) {
      if (typed[index] === trainingText[index]) {
        total += 1;
      }
    }
    return total;
  }, [typed, trainingText]);

  const totalAttempts = typed.length + errorAttempts;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((correctChars / totalAttempts) * 100);
  const wpm = elapsedSeconds === 0 ? 0 : Math.round((correctChars / 5 / elapsedSeconds) * 60);
  const progress = Math.min(100, Math.round((typed.length / trainingText.length) * 100));
  const cpm = elapsedSeconds === 0 ? 0 : Math.round((correctChars / elapsedSeconds) * 60);
  const mistakes = Math.max(0, typed.length - correctChars) + errorAttempts;
  const activeIndex = typed.length;
  const completionReason = progress >= 100 ? "Текст завершён полностью" : "Таймер завершился";

  const showShareFeedback = useCallback((message: string) => {
    setShareFeedback(message);
    if (shareTimeoutRef.current) {
      window.clearTimeout(shareTimeoutRef.current);
    }
    shareTimeoutRef.current = window.setTimeout(() => {
      setShareFeedback("");
    }, 2400);
  }, []);

  const handleShareResult = useCallback(async () => {
    const summary = `Typing Ninja: ${wpm} WPM, точность ${accuracy}%, время ${elapsedSeconds}с, прогресс ${progress}%.`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Typing Ninja result",
          text: summary,
        });
        showShareFeedback("Результат отправлен.");
        return;
      } catch {
        // If user cancels native share, keep silent.
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary);
      showShareFeedback("Результат скопирован в буфер.");
      return;
    }

    showShareFeedback("Поделиться не удалось на этом устройстве.");
  }, [accuracy, elapsedSeconds, progress, showShareFeedback, wpm]);

  return (
    <main className={`${styles.app} ${focusMode ? styles.focusMode : ""}`}>
      <div className={styles.contentWrap}>
        <div className={styles.trainingBlock}>
          {!focusMode && (
            <>
              <TopPanel
                styles={styles}
                timeLeft={timeLeft}
                settingsOpen={settingsOpen}
                onReset={() => resetSession()}
                onToggleSettings={() => setSettingsOpen((prev) => !prev)}
              />

              {settingsOpen && (
                <SettingsPanel
                  styles={styles}
                  textType={textType}
                  duration={duration}
                  includeNumbers={includeNumbers}
                  includePunctuation={includePunctuation}
                  blockOnError={blockOnError}
                  showKeyboard={showKeyboard}
                  theme={theme}
                  onTextTypeChange={(nextType) => {
                    setTextType(nextType);
                    resetSession(nextType, duration, includeNumbers, includePunctuation);
                  }}
                  onDurationChange={(nextDuration) => {
                    setDuration(nextDuration);
                    resetSession(textType, nextDuration, includeNumbers, includePunctuation);
                  }}
                  onToggleNumbers={() => {
                    const nextValue = !includeNumbers;
                    setIncludeNumbers(nextValue);
                    resetSession(textType, duration, nextValue, includePunctuation);
                  }}
                  onTogglePunctuation={() => {
                    const nextValue = !includePunctuation;
                    setIncludePunctuation(nextValue);
                    resetSession(textType, duration, includeNumbers, nextValue);
                  }}
                  onToggleBlockOnError={() => {
                    setBlockOnError((prev) => {
                      const nextValue = !prev;
                      if (!nextValue) {
                        setBlockedErrorIndex(null);
                      }
                      return nextValue;
                    });
                  }}
                  onToggleKeyboard={() => setShowKeyboard((prev) => !prev)}
                  onFocusMode={() => setFocusMode(true)}
                  onThemeChange={setTheme}
                />
              )}
            </>
          )}

          <TrainingText
            styles={styles}
            trainingText={trainingText}
            typed={typed}
            activeIndex={activeIndex}
            finished={finished}
            blockedErrorIndex={blockedErrorIndex}
            textBoxRef={textBoxRef}
            currentCharRef={currentCharRef}
            onFocusInput={() => {
              const activeElement = document.activeElement as HTMLElement | null;
              activeElement?.blur();
            }}
          />

          {!focusMode && showKeyboard && <Keyboard styles={styles} activeCode={activeCode} />}
        </div>
      </div>

      {resultModalOpen && (
        <div
          className={styles.resultModalBackdrop}
          onClick={() => setResultModalDismissed(true)}
          role="presentation"
        >
          <div
            className={styles.resultModal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Typing result"
          >
            <button
              type="button"
              className={styles.resultCloseButton}
              onClick={() => setResultModalDismissed(true)}
              aria-label="Close result modal"
            >
              X
            </button>

            <div className={styles.resultConfetti} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <p className={styles.resultOverline}>Session Complete</p>
            <h2 className={styles.resultTitle}>Отличная работа!</h2>
            <p className={styles.resultSubtitle}>{completionReason}</p>

            <div className={styles.resultIllustration}>
              <span>PLACEHOLDER ART</span>
            </div>

            <div className={styles.resultStatsGrid}>
              <article>
                <span>WPM</span>
                <strong>{wpm}</strong>
              </article>
              <article>
                <span>Accuracy</span>
                <strong>{accuracy}%</strong>
              </article>
              <article>
                <span>Time</span>
                <strong>{elapsedSeconds}s</strong>
              </article>
              <article>
                <span>Errors</span>
                <strong>{mistakes}</strong>
              </article>
              <article>
                <span>CPM</span>
                <strong>{cpm}</strong>
              </article>
              <article>
                <span>Progress</span>
                <strong>{progress}%</strong>
              </article>
            </div>

            {shareFeedback && <p className={styles.resultShareFeedback}>{shareFeedback}</p>}

            <div className={styles.resultActions}>
              <button
                type="button"
                className={`${styles.resultButton} ${styles.resultButtonPrimary}`}
                onClick={() => resetSession()}
              >
                <span className={styles.resultResetIcon}>↻</span>
                Ещё раз
              </button>
              <button
                type="button"
                className={`${styles.resultButton} ${styles.resultButtonSecondary}`}
                onClick={() => {
                  void handleShareResult();
                }}
              >
                Поделиться
              </button>
              <button
                type="button"
                className={`${styles.resultButton} ${styles.resultButtonGhost}`}
                onClick={() => setResultModalDismissed(true)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
