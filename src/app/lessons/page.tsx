"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/typing/Sidebar";
import { LESSON_UNITS } from "@/data/lessons";
import styles from "./page.module.css";

const UNLOCKED_UNITS = 3;
const ROADMAP_PATTERN = [0, 1, 2, 1, 0, -1, -2, -1, 0] as const;
const CONNECTOR_STEP = 78;

const getOffsetLevel = (index: number) => ROADMAP_PATTERN[index % ROADMAP_PATTERN.length];

const buildConnectorPath = (deltaLevel: number) => {
  const startX = 170;
  const endX = startX + deltaLevel * CONNECTOR_STEP;
  return `M ${startX} 4 C ${startX} 30 ${endX} 52 ${endX} 78`;
};

export default function LessonsPage() {
  const router = useRouter();

  return (
    <main className={styles.app}>
      <Sidebar styles={styles} />

      <section className={styles.contentWrap}>
        <header className={styles.heading}>
          <p className={styles.overline}>Lessons</p>
          <h1 className={styles.title}>Roadmap</h1>
        </header>

        <div className={styles.roadmap}>
          {LESSON_UNITS.map((unit, index) => {
            const offsetLevel = getOffsetLevel(index);
            const nextOffsetLevel = getOffsetLevel(index + 1);
            const deltaLevel = nextOffsetLevel - offsetLevel;

            return (
              <button
                key={unit.id}
                type="button"
                className={`${styles.unitCard} ${index >= UNLOCKED_UNITS ? styles.unitCardLocked : ""}`}
                disabled={index >= UNLOCKED_UNITS}
                aria-label={`${unit.title}: ${index >= UNLOCKED_UNITS ? "locked" : "available"}`}
                style={{ "--offset-level": offsetLevel } as CSSProperties}
                onClick={() => {
                  if (index < UNLOCKED_UNITS) {
                    router.push(`/lessons/${unit.id}`);
                  }
                }}
              >
                <span className={styles.unitIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h2>{unit.title}</h2>
                <p className={styles.unitFocus}>{unit.focus}</p>
                <p className={styles.unitSymbols}>{unit.symbols}</p>
                <p className={styles.unitDrills}>{unit.drills}</p>
                {index >= UNLOCKED_UNITS && (
                  <span className={styles.lockCenter} aria-hidden="true">
                    {"\uD83D\uDD12"}
                  </span>
                )}
                {index < LESSON_UNITS.length - 1 && (
                  <span className={styles.connector} aria-hidden="true">
                    <svg className={styles.connectorSvg} viewBox="0 0 340 82" preserveAspectRatio="none">
                      <path d={buildConnectorPath(deltaLevel)} />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

