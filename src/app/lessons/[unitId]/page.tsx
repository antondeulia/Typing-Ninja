"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard } from "@/components/typing/Keyboard";
import { Sidebar } from "@/components/typing/Sidebar";
import { TrainingText } from "@/components/typing/TrainingText";
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
  const params = useParams<{ unitId: string }>();
  const [typed, setTyped] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [rowResults, setRowResults] = useState<RowResult[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);
  const flashTimeoutRef = useRef<number | null>(null);

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

    const relativeTop = currentChar.offsetTop - textBox.offsetTop;
    const currentLine = Math.floor(relativeTop / lineHeight);
    const firstVisibleLine = Math.floor(textBox.scrollTop / lineHeight);
    const lastVisibleLine = firstVisibleLine + 1;

    if (currentLine >= lastVisibleLine) {
      textBox.scrollTop = Math.max(0, (currentLine - 1) * lineHeight);
      return;
    }

    if (currentLine < firstVisibleLine) {
      textBox.scrollTop = Math.max(0, currentLine * lineHeight);
    }
  }, [currentRowText, typed]);

  useEffect(() => {
    setTyped("");
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
    },
    [activeRowIndex, currentRowText, lessonRows.length],
  );

  const handleKey = useCallback(
    (event: Pick<globalThis.KeyboardEvent, "key" | "code" | "ctrlKey" | "altKey" | "metaKey" | "preventDefault">) => {
      if (!lesson || resultModalOpen) {
        return;
      }

      if (event.ctrlKey || event.altKey || event.metaKey || event.key === "Tab") {
        return;
      }

      event.preventDefault();
      flashKey(event.code);

      if (event.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      const nextChar = event.key === "Enter" ? "\n" : event.key;
      if (nextChar.length !== 1 || typed.length >= currentRowText.length) {
        return;
      }

      if (startedAt === null) {
        setStartedAt(Date.now());
      }

      const nextTyped = typed + nextChar;
      setTyped(nextTyped);

      if (nextTyped.length >= currentRowText.length) {
        completeCurrentRow(nextTyped);
      }
    },
    [completeCurrentRow, currentRowText.length, flashKey, lesson, resultModalOpen, startedAt, typed],
  );

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (resultModalOpen && event.key === "Escape") {
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
  }, [handleKey, resultModalOpen]);

  const resetLesson = useCallback(() => {
    setTyped("");
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

  const totalTargetChars = lessonRows.reduce((total, row) => total + row.length, 0);
  const totalTypedChars = finishedRowsTypedChars + typed.length;
  const totalCorrectChars = finishedRowsCorrectChars + liveCorrectChars;
  const accuracy = totalTypedChars === 0 ? 100 : Math.round((totalCorrectChars / totalTypedChars) * 100);
  const progress = totalTargetChars === 0 ? 0 : Math.min(100, Math.round((totalTypedChars / totalTargetChars) * 100));

  const elapsedSeconds = useMemo(() => {
    if (!startedAt) {
      return 0;
    }

    const endTime = completedAt ?? Date.now();
    return Math.max(1, Math.round((endTime - startedAt) / 1000));
  }, [completedAt, startedAt]);

  const wpm = elapsedSeconds === 0 ? 0 : Math.round((totalCorrectChars / 5 / elapsedSeconds) * 60);
  const cpm = elapsedSeconds === 0 ? 0 : Math.round((totalCorrectChars / elapsedSeconds) * 60);
  const mistakes = Math.max(0, totalTypedChars - totalCorrectChars);
  const canContinue = accuracy >= PASSING_ACCURACY;
  const currentRowLabel = Math.min(lessonRows.length, activeRowIndex + 1);
  const nextLessonIndex = LESSON_UNITS.findIndex((item) => item.id === lesson?.id);
  const nextLesson = nextLessonIndex >= 0 ? LESSON_UNITS[nextLessonIndex + 1] : undefined;

  const completionMessage = canContinue
    ? "Great work. You unlocked Continue."
    : `Accuracy is ${accuracy}%. Reach ${PASSING_ACCURACY}%+ to continue.`;

  if (!lesson) {
    return (
      <main className={styles.app}>
        <Sidebar styles={styles} />
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
      <Sidebar styles={styles} />

      <div className={styles.contentWrap}>
        <header className={styles.lessonHeader}>
          <p className={styles.lessonOverline}>Lesson</p>
          <h1 className={styles.lessonTitle}>{lesson.title}</h1>
          <p className={styles.lessonMeta}>{lesson.focus}</p>
          <p className={styles.lessonMetaMono}>{lesson.symbols}</p>
          <p className={styles.lessonRowBadge}>
            Row {currentRowLabel}/{lessonRows.length}
          </p>

          <div className={styles.lessonActions}>
            <Link href="/lessons" className={styles.lessonLink}>
              Back to roadmap
            </Link>
            <button type="button" className={styles.lessonButton} onClick={resetLesson}>
              Restart
            </button>
            <span className={styles.lessonStat}>Progress: {progress}%</span>
            <span className={styles.lessonStat}>Accuracy: {accuracy}%</span>
            <span className={styles.lessonStat}>
              Row: {typed.length}/{currentRowText.length}
            </span>
          </div>
        </header>

        <div className={styles.trainingBlock}>
          <TrainingText
            styles={styles}
            trainingText={currentRowText}
            typed={typed}
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
        <div className={styles.resultModalBackdrop} onClick={() => setResultModalOpen(false)} role="presentation">
          <div
            className={styles.resultModal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Unit result"
          >
            <button
              type="button"
              className={styles.resultCloseButton}
              onClick={() => setResultModalOpen(false)}
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

            <p className={styles.resultOverline}>Unit Complete</p>
            <h2 className={styles.resultTitle}>Congratulations!</h2>
            <p className={styles.resultSubtitle}>{completionMessage}</p>

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
                <span>Rows</span>
                <strong>{lessonRows.length}</strong>
              </article>
            </div>

            <div className={styles.resultActions}>
              <button
                type="button"
                className={`${styles.resultButton} ${styles.resultButtonPrimary}`}
                onClick={resetLesson}
              >
                Again
              </button>
              {canContinue && (
                <button
                  type="button"
                  className={`${styles.resultButton} ${styles.resultButtonSecondary}`}
                  onClick={() => {
                    if (nextLesson) {
                      router.push(`/lessons/${nextLesson.id}`);
                      return;
                    }
                    router.push("/lessons");
                  }}
                >
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
