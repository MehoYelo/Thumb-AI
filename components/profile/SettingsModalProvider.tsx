"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { SettingsModal } from "@/components/profile/SettingsModal";

type SettingsModalContextValue = {
  openModal: () => void;
  closeModal: () => void;
};

const SettingsModalContext = createContext<SettingsModalContextValue | null>(
  null,
);

export function SettingsModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      openModal: () => setOpen(true),
      closeModal: () => setOpen(false),
    }),
    [],
  );

  return (
    <SettingsModalContext.Provider value={value}>
      {children}
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </SettingsModalContext.Provider>
  );
}

export function useSettingsModal() {
  const context = useContext(SettingsModalContext);
  if (!context) {
    throw new Error(
      "useSettingsModal must be used within SettingsModalProvider",
    );
  }
  return context;
}
