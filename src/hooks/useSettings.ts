"use client";

import { useEffect, useState } from "react";

export interface SettingData {
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  cashierName?: string;
  discountMethod?: string;
  transactionType?: string;
  printMethod?: string;
  bank1Name?: string;
  bank1Account?: string;
  bank1Owner?: string;
  bank2Name?: string;
  bank2Account?: string;
  bank2Owner?: string;
  logo?: string;
  receiptFooterLine1?: string;
  receiptFooterLine2?: string;
  receiptFooterLine3?: string;
  invoiceFooterLine1?: string;
  invoiceFooterLine2?: string;
  invoiceFooterLine3?: string;
  signatureName?: string;
  defaultTax?: number;
  defaultDiscount?: number;
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
        } else {
          setError(result.error || "Gagal mengambil pengaturan");
        }
      } catch (err) {
        setError("Gagal mengambil pengaturan");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
