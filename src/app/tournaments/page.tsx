import styles from "../hub-page.module.css";

export default function TournamentsPage() {
  return (
    <main className={styles.app}>
      <section className={styles.contentWrap}>
        <p className={styles.overline}>Tournaments</p>
        <h1 className={styles.title}>Tournament Arena</h1>
        <p className={styles.description}>
          Раздел для соревнований в реальном времени: сетки, тайминги раундов и результаты.
          Пока это каркас страницы для дальнейшей интеграции.
        </p>
        <div className={styles.chipRow}>
          <span className={styles.chip}>1v1 Brackets</span>
          <span className={styles.chip}>Weekly Cups</span>
          <span className={styles.chip}>Final Standings</span>
        </div>
      </section>
    </main>
  );
}
