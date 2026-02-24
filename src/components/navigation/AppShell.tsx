"use client";

import { AuthModalProvider, useAuthModal } from "@/components/auth/AuthModalProvider";
import { Sidebar } from "@/components/typing/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

function SidebarWithAuthTrigger() {
  const { openAuthModal } = useAuthModal();
  return <Sidebar onSignInClick={openAuthModal} />;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthModalProvider>
      <SidebarWithAuthTrigger />
      {children}
    </AuthModalProvider>
  );
}
