import styles from "../hub-page.module.css";

export default function LeadersPage() {
  return (
    <main className={styles.app}>
      <section className={styles.contentWrap}>
        <p className={styles.overline}>Leaders</p>
        <h1 className={styles.title}>Leaderboard Hub</h1>
        <p className={styles.description}>
          Сравнивай текущий темп печати, точность и прогресс по сессиям. Здесь появятся дневные,
          недельные и общие рейтинги.
        </p>
        <div className={styles.chipRow}>
          <span className={styles.chip}>Daily Top</span>
          <span className={styles.chip}>Weekly Top</span>
          <span className={styles.chip}>All-time Top</span>
        </div>
      </section>
    </main>
  );
}
