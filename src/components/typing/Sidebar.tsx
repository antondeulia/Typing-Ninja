import { SIDEBAR_ITEMS } from "@/data/mock";
import { StyleModule } from "@/shared/types/style";

type SidebarProps = {
  styles: StyleModule;
  onSignInClick?: () => void;
};

export function Sidebar({ styles, onSignInClick }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <button type="button" className={styles.signInButton} onClick={onSignInClick}>
        Sign In
      </button>
      <nav className={styles.sidebarNav}>
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`${styles.sidebarItem} ${item.active ? styles.sidebarItemActive : ""}`}
          >
            <span className={styles.sidebarItemLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
