"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_ITEMS } from "@/data/mock";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  onSignInClick?: () => void;
};

export function Sidebar({ onSignInClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <button type="button" className={styles.signInButton} onClick={onSignInClick}>
        Log in
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
