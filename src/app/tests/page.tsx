import styles from "../hub-page.module.css";

export default function TestsPage() {
  return (
    <main className={styles.app}>
      <section className={styles.contentWrap}>
        <p className={styles.overline}>Tests</p>
        <h1 className={styles.title}>Typing Tests</h1>
        <p className={styles.description}>
          Быстрые проверочные тесты для замера скорости и стабильности на разных режимах текста.
          Здесь будут пресеты и история попыток.
        </p>
        <div className={styles.chipRow}>
          <span className={styles.chip}>30 sec</span>
          <span className={styles.chip}>60 sec</span>
          <span className={styles.chip}>Custom Test</span>
        </div>
      </section>
    </main>
  );
}
