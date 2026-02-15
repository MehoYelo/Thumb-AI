"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

type CreditsModalProps = {
  open: boolean;
  onClose: () => void;
};

type CreditPack = {
  id: string;
  credits: number;
  price: number;
  currency: string;
};

export function CreditsModal({ open, onClose }: CreditsModalProps) {
    const router = useRouter();
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/billing/credit-packs");
      const data = await res.json();
      setPacks(data);
      setLoading(false);
    };

    load();
  }, [open]);

  const buyPack = async (id: string) => {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const { url } = await res.json();
    router.push(url);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Buy Extra Credits</h3>

        {loading && <p>Loading...</p>}

        <div className="space-y-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="rounded-xl border p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{pack.credits} Credits</p>
                <p className="text-sm text-gray-500">
                  {pack.currency.toUpperCase()} {pack.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => buyPack(pack.id)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
