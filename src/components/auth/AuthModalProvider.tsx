"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import styles from "./AuthModalProvider.module.css";

type AuthMode = "login" | "signup";

type AuthModalContextValue = {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

type AuthModalProviderProps = {
  children: React.ReactNode;
};

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openAuthModal = useCallback(() => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isAuthModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAuthModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAuthModalOpen]);

  const value = useMemo(
    () => ({
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
    }),
    [closeAuthModal, isAuthModalOpen, openAuthModal],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}

      {isAuthModalOpen && (
        <div className={styles.authModalBackdrop} onClick={closeAuthModal} role="presentation">
          <div
            className={styles.authModal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Authentication"
          >
            <button
              type="button"
              className={styles.authCloseButton}
              onClick={closeAuthModal}
              aria-label="Close authentication modal"
            >
              X
            </button>

            <p className={styles.authModalOverline}>Welcome to Typing Ninja</p>
            <h2 className={styles.authModalTitle}>
              {authMode === "login" ? "Log in to continue" : "Create your account"}
            </h2>

            <div className={styles.authSwitch}>
              <button
                type="button"
                className={`${styles.authSwitchButton} ${authMode === "login" ? styles.authSwitchButtonActive : ""}`}
                onClick={() => setAuthMode("login")}
              >
                Log in
              </button>
              <button
                type="button"
                className={`${styles.authSwitchButton} ${authMode === "signup" ? styles.authSwitchButtonActive : ""}`}
                onClick={() => setAuthMode("signup")}
              >
                Sign Up
              </button>
            </div>

            <form className={styles.authForm} onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="auth-email">Email</label>
              <input id="auth-email" type="email" placeholder="you@example.com" />

              <label htmlFor="auth-password">Password</label>
              <input id="auth-password" type="password" placeholder="********" />

              {authMode === "signup" && (
                <>
                  <label htmlFor="auth-name">Display name</label>
                  <input id="auth-name" type="text" placeholder="Typing Ninja" />
                </>
              )}

              <button type="submit" className={styles.authSubmitButton}>
                {authMode === "login" ? "Log in (Mock)" : "Create Account (Mock)"}
              </button>
            </form>

            <div className={styles.authDivider}>or continue with</div>

            <div className={styles.authSocialRow}>
              <button type="button" className={styles.authSocialButton}>
                Google
              </button>
              <button type="button" className={styles.authSocialButton}>
                Facebook
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }
  return context;
};
