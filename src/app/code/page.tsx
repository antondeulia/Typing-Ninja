import styles from "../hub-page.module.css";

export default function CodePage() {
  return (
    <main className={styles.app}>
      <section className={styles.contentWrap}>
        <p className={styles.overline}>Code</p>
        <h1 className={styles.title}>Code Drills</h1>
        <p className={styles.description}>
          Тренировка печати на фрагментах кода с символами, скобками и операторами. Раздел
          подготовлен как отдельная страница для будущих упражнений.
        </p>
        <div className={styles.chipRow}>
          <span className={styles.chip}>JavaScript</span>
          <span className={styles.chip}>TypeScript</span>
          <span className={styles.chip}>CLI Snippets</span>
        </div>
      </section>
    </main>
  );
}
