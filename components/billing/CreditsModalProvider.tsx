"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { CreditsModal } from "@/components/billing/CreditsModal";

type CreditsModalContextValue = {
  openModal: () => void;
  closeModal: () => void;
};

const CreditsModalContext = createContext<CreditsModalContextValue | null>(
  null,
);

export function CreditsModalProvider({
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
    <CreditsModalContext.Provider value={value}>
      {children}
      <CreditsModal open={open} onClose={() => setOpen(false)} />
    </CreditsModalContext.Provider>
  );
}

export function useCreditsModal() {
  const context = useContext(CreditsModalContext);
  if (!context) {
    throw new Error("useCreditsModal must be used within CreditsModalProvider");
  }
  return context;
}
