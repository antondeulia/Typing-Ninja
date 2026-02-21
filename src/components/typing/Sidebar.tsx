"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_ITEMS } from "@/data/mock";
import { StyleModule } from "@/shared/types/style";

type SidebarProps = {
  styles: StyleModule;
  onSignInClick?: () => void;
};

export function Sidebar({ styles, onSignInClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <button type="button" className={styles.signInButton} onClick={onSignInClick}>
        Sign In
      </button>
      <nav className={styles.sidebarNav}>
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = item.href
            ? pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))
            : false;
          const className = `${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ""}`;

          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className={className}>
                <span className={styles.sidebarItemLabel}>{item.label}</span>
              </Link>
            );
          }

          return (
            <button key={item.label} type="button" className={className}>
              <span className={styles.sidebarItemLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
