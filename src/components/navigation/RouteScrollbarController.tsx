"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

export function RouteScrollbarController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const shouldHideScrollbar = pathname === "/" || pathname.startsWith("/lessons");

    root.classList.toggle("hide-scrollbar", shouldHideScrollbar);

    return () => {
      root.classList.remove("hide-scrollbar");
    };
  }, [pathname]);

  return null;
}
