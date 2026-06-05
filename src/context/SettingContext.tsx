"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSetting } from "@/actions/setting";

export interface AppSetting {
  id: string;
  storeName: string;
  storeAddress?: string | null;
  storePhone?: string | null;
  storeEmail?: string | null;
  cashierName?: string | null;
  discountMethod?: string | null;
  defaultTax: number;
  transactionType?: string | null;
  printMethod?: string | null;
  logo?: string | null;
  bank1Name?: string | null;
  bank1AccountNumber?: string | null;
  bank1AccountName?: string | null;
  bank2Name?: string | null;
  bank2AccountNumber?: string | null;
  bank2AccountName?: string | null;
  receiptFooter1?: string | null;
  receiptFooter2?: string | null;
  receiptFooter3?: string | null;
  invoiceFooter1?: string | null;
  invoiceFooter2?: string | null;
  invoiceFooter3?: string | null;
  regards?: string | null;
}

interface SettingContextType {
  setting: AppSetting | null;
  loading: boolean;
  refreshSetting: () => void;
}

const SettingContext = createContext<SettingContextType>({
  setting: null,
  loading: true,
  refreshSetting: () => {},
});

export function SettingProvider({ children }: { children: React.ReactNode }) {
  const [setting, setSetting] = useState<AppSetting | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSetting = useCallback(async () => {
    try {
      const res = await getSetting();
      if (res.success && res.data) {
        setSetting(res.data as AppSetting);
      }
    } catch (e) {
      console.error("Failed to load setting", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSetting();
  }, [fetchSetting]);

  return (
    <SettingContext.Provider value={{ setting, loading, refreshSetting: fetchSetting }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSetting() {
  return useContext(SettingContext);
}
