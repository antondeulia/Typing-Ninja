"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { Keyboard } from "@/components/typing/Keyboard";
import { TrainingText } from "@/components/typing/TrainingText";
import { useTypingSound } from "@/components/typing/useTypingSound";
import { LESSON_UNITS } from "@/data/lessons";
import typingStyles from "@/app/page.module.css";
import lessonStyles from "./page.module.css";

const styles = { ...typingStyles, ...lessonStyles };
const LESSON_ROWS_PER_UNIT = 3;
const PASSING_ACCURACY = 90;

type RowResult = {
  typedCount: number;
  correctCount: number;
  targetLength: number;
};

const getCorrectChars = (source: string, expected: string) => {
  let total = 0;
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === expected[index]) {
      total += 1;
    }
  }
  return total;
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

const splitLessonRows = (lessonText: string, rowsCount = LESSON_ROWS_PER_UNIT) => {
  const words = lessonText.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return Array.from({ length: rowsCount }, () => "");
  }

  if (words.length >= rowsCount) {
    const rows: string[] = [];
    let cursor = 0;

    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
      const wordsLeft = words.length - cursor;
      const rowsLeft = rowsCount - rowIndex;
      const take = Math.ceil(wordsLeft / rowsLeft);
      rows.push(words.slice(cursor, cursor + take).join(" "));
      cursor += take;
    }

    return rows;
  }

  const compactText = lessonText.trim();
  const rows: string[] = [];
  let cursor = 0;

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
    const charsLeft = compactText.length - cursor;
    const rowsLeft = rowsCount - rowIndex;
    const take = Math.ceil(charsLeft / rowsLeft);
    rows.push(compactText.slice(cursor, cursor + take));
    cursor += take;
  }

  return rows;
};

export default function LessonPage() {
  const router = useRouter();
  const { isAuthModalOpen } = useAuthModal();
  const { playTypingSound } = useTypingSound();
  const params = useParams<{ unitId: string }>();
  const [typed, setTyped] = useState("");
  const [blockedErrorIndex, setBlockedErrorIndex] = useState<number | null>(null);
  const [errorAttempts, setErrorAttempts] = useState(0);
  const [activeCode, setActiveCode] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [rowResults, setRowResults] = useState<RowResult[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);
  const flashTimeoutRef = useRef<number | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const againButtonRef = useRef<HTMLButtonElement>(null);

  const unitId = useMemo(() => {
    const parsedUnitId = Number.parseInt(params.unitId ?? "", 10);
    return Number.isFinite(parsedUnitId) ? parsedUnitId : Number.NaN;
  }, [params.unitId]);

  const lesson = useMemo(() => LESSON_UNITS.find((item) => item.id === unitId), [unitId]);
  const lessonRows = useMemo(() => splitLessonRows(lesson?.lessonText ?? ""), [lesson?.lessonText]);
  const currentRowText = lessonRows[activeRowIndex] ?? "";

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

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
    const currentLine = Math.max(0, Math.floor(relativeTop / lineHeight));
    const normalizedScrollTop = Math.max(0, textBox.scrollTop - paddingTop);
    const firstVisibleLine = Math.floor(normalizedScrollTop / lineHeight);
    const lastVisibleLine = firstVisibleLine + 1;

    if (currentLine >= lastVisibleLine) {
      textBox.scrollTop = Math.round(Math.max(0, paddingTop + (currentLine - 1) * lineHeight));
      return;
    }

    if (currentLine < firstVisibleLine) {
      textBox.scrollTop = Math.round(Math.max(0, paddingTop + currentLine * lineHeight));
    }
  }, [currentRowText, typed]);

  useEffect(() => {
    setTyped("");
    setBlockedErrorIndex(null);
    setErrorAttempts(0);
    setActiveCode("");
    setActiveRowIndex(0);
    setRowResults([]);
    setStartedAt(null);
    setCompletedAt(null);
    setResultModalOpen(false);
  }, [lesson?.id]);

  const flashKey = useCallback((code: string) => {
    setActiveCode(code);
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = window.setTimeout(() => {
      setActiveCode("");
    }, 150);
  }, []);

  const completeCurrentRow = useCallback(
    (rowTyped: string) => {
      const rowCorrect = getCorrectChars(rowTyped, currentRowText);

      setRowResults((prev) => [
        ...prev,
        {
          typedCount: rowTyped.length,
          correctCount: rowCorrect,
          targetLength: currentRowText.length,
        },
      ]);

      const isLastRow = activeRowIndex >= lessonRows.length - 1;
      if (isLastRow) {
        setCompletedAt(Date.now());
        setResultModalOpen(true);
        return;
      }

      setActiveRowIndex((prev) => prev + 1);
      setTyped("");
      setBlockedErrorIndex(null);
    },
    [activeRowIndex, currentRowText, lessonRows.length],
  );

  const handleKey = useCallback(
    (event: Pick<globalThis.KeyboardEvent, "key" | "code" | "ctrlKey" | "altKey" | "metaKey" | "preventDefault">) => {
      if (!lesson || resultModalOpen) {
        return;
      }

      if (event.altKey || event.metaKey || event.key === "Tab") {
        return;
      }

      event.preventDefault();
      flashKey(event.code);

      if (event.key === "Backspace") {
        playTypingSound("backspace");
        setBlockedErrorIndex(null);
        setTyped((prev) => (event.ctrlKey ? removeLastWord(prev) : prev.slice(0, -1)));
        return;
      }

      if (event.ctrlKey) {
        return;
      }

      const nextChar = event.key === "Enter" ? "\n" : event.key;
      if (nextChar.length !== 1 || typed.length >= currentRowText.length) {
        return;
      }

      playTypingSound(nextChar === " " ? "space" : "default");

      if (startedAt === null) {
        setStartedAt(Date.now());
      }

      if (nextChar !== currentRowText[typed.length]) {
        setBlockedErrorIndex(typed.length);
        setErrorAttempts((prev) => prev + 1);
        return;
      }

      setBlockedErrorIndex(null);
      const nextTyped = typed + nextChar;

      setTyped(nextTyped);

      if (nextTyped.length >= currentRowText.length && !hasUnfixedMistake(nextTyped, currentRowText)) {
        completeCurrentRow(nextTyped);
      }
    },
    [
      completeCurrentRow,
      currentRowText,
      flashKey,
      lesson,
      playTypingSound,
      resultModalOpen,
      startedAt,
      typed,
    ],
  );

  const resetLesson = useCallback(() => {
    setTyped("");
    setBlockedErrorIndex(null);
    setErrorAttempts(0);
    setActiveCode("");
    setActiveRowIndex(0);
    setRowResults([]);
    setStartedAt(null);
    setCompletedAt(null);
    setResultModalOpen(false);
  }, []);

  const finishedRowsTypedChars = useMemo(() => rowResults.reduce((total, row) => total + row.typedCount, 0), [rowResults]);
  const finishedRowsCorrectChars = useMemo(
    () => rowResults.reduce((total, row) => total + row.correctCount, 0),
    [rowResults],
  );
  const liveCorrectChars = useMemo(() => getCorrectChars(typed, currentRowText), [currentRowText, typed]);

  const totalRows = lessonRows.length;
  const completedRows = rowResults.length;
  const totalTypedChars = finishedRowsTypedChars + typed.length;
  const totalAttempts = totalTypedChars + errorAttempts;
  const totalCorrectChars = finishedRowsCorrectChars + liveCorrectChars;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((totalCorrectChars / totalAttempts) * 100);
  const activeIndex = typed.length;
  const progress = totalRows === 0 ? 0 : Math.min(100, Math.floor((completedRows / totalRows) * 100));

  const elapsedSeconds = useMemo(() => {
    if (!startedAt || !completedAt) {
      return 0;
    }

    return Math.max(1, Math.round((completedAt - startedAt) / 1000));
  }, [completedAt, startedAt]);

  const wpm = elapsedSeconds === 0 ? 0 : Math.round((totalCorrectChars / 5 / elapsedSeconds) * 60);
  const cpm = elapsedSeconds === 0 ? 0 : Math.round((totalCorrectChars / elapsedSeconds) * 60);
  const mistakes = Math.max(0, totalTypedChars - totalCorrectChars) + errorAttempts;
  const canContinue = accuracy >= PASSING_ACCURACY;
  const nextLessonIndex = LESSON_UNITS.findIndex((item) => item.id === lesson?.id);
  const nextLesson = nextLessonIndex >= 0 ? LESSON_UNITS[nextLessonIndex + 1] : undefined;

  const completionMessage = canContinue
    ? "Урок пройден. Отличный темп, можно идти дальше."
    : `Точность ${accuracy}%. Нужно минимум ${PASSING_ACCURACY}% - пройди урок заново.`;

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (isAuthModalOpen) {
        return;
      }

      if (resultModalOpen && canContinue && event.key === "Escape") {
        setResultModalOpen(false);
        return;
      }

      const target = event.target as HTMLElement | null;
      const isEditableTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable === true;

      if (!isEditableTarget) {
        handleKey(event);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canContinue, handleKey, isAuthModalOpen, resultModalOpen]);

  useEffect(() => {
    if (!resultModalOpen) {
      return;
    }

    const focusTarget = canContinue ? continueButtonRef.current : againButtonRef.current;
    focusTarget?.focus();
  }, [canContinue, resultModalOpen]);

  if (!lesson) {
    return (
      <main className={styles.app}>
        <div className={styles.contentWrap}>
          <header className={styles.lessonHeader}>
            <p className={styles.lessonOverline}>Lesson</p>
            <h1 className={styles.lessonTitle}>Lesson not found</h1>
            <div className={styles.lessonActions}>
              <Link href="/lessons" className={styles.lessonLink}>
                Back to roadmap
              </Link>
            </div>
          </header>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.app}>
      <div className={styles.contentWrap}>
        <header className={styles.lessonHeader}>
          <h1 className={styles.lessonTitle}>{lesson.title}</h1>
          <div className={styles.lessonProgress} aria-label={`Progress ${progress}%`}>
            <div className={styles.lessonProgressTrack}>
              <div className={styles.lessonProgressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.lessonProgressValue}>{progress}%</span>
          </div>
        </header>

        <div className={styles.trainingBlock}>
          <TrainingText
            styles={styles}
            trainingText={currentRowText}
            typed={typed}
            activeIndex={activeIndex}
            blockedErrorIndex={blockedErrorIndex}
            finished={resultModalOpen}
            textBoxRef={textBoxRef}
            currentCharRef={currentCharRef}
            onFocusInput={() => {
              const activeElement = document.activeElement as HTMLElement | null;
              activeElement?.blur();
            }}
          />

          <Keyboard styles={styles} activeCode={activeCode} />
        </div>
      </div>

      {resultModalOpen && (
        <div
          className={styles.resultModalBackdrop}
          onClick={() => {
            if (canContinue) {
              setResultModalOpen(false);
            }
          }}
          role="presentation"
        >
          <div
            className={`${styles.resultModal} ${canContinue ? styles.resultModalPass : styles.resultModalFail}`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Unit result"
          >
            {canContinue && (
              <button
                type="button"
                className={styles.resultCloseButton}
                onClick={() => setResultModalOpen(false)}
                aria-label="Close result modal"
              >
                X
              </button>
            )}

            <div className={styles.resultDecor} aria-hidden="true">
              <span>✦</span>
              <span>✺</span>
              <span>✦</span>
              <span>✶</span>
            </div>

            <p className={styles.resultOverline}>{canContinue ? "Lesson Complete" : "Lesson Retry Required"}</p>
            <h2 className={styles.resultTitle}>{canContinue ? "Отличная работа" : "Нужно перепройти урок"}</h2>
            <p className={styles.resultSubtitle}>{completionMessage}</p>

            <div className={styles.resultStatsGrid}>
              <article>
                <span>WPM</span>
                <strong>{wpm}</strong>
              </article>
              <article>
                <span>Accuracy %</span>
                <strong>{accuracy}%</strong>
              </article>
              <article>
                <span>Time</span>
                <strong>{elapsedSeconds} sec</strong>
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
                <span>Rows</span>
                <strong>{lessonRows.length}</strong>
              </article>
            </div>

            <div className={styles.resultActions}>
              <button
                type="button"
                className={`${styles.resultButton} ${styles.resultButtonPrimary}`}
                onClick={resetLesson}
                ref={againButtonRef}
              >
                <span className={styles.resultButtonIcon} aria-hidden="true">
                  ↺
                </span>
                {canContinue ? "Again" : "Retry lesson"}
              </button>
              {canContinue && (
                <button
                  type="button"
                  className={`${styles.resultButton} ${styles.resultButtonSecondary}`}
                  ref={continueButtonRef}
                  onClick={() => {
                    if (nextLesson) {
                      router.push(`/lessons/${nextLesson.id}`);
                      return;
                    }
                    router.push("/lessons");
                  }}
                >
                  <span className={styles.resultButtonIcon} aria-hidden="true">
                    →
                  </span>
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
