"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentMethod, updatePaymentMethod } from "@/actions/paymentMethod";
import type { PaymentMethodData } from "@/actions/paymentMethod";

interface PaymentMethodFormProps {
  paymentMethod?: {
    id: string;
    name: string;
    isActive: boolean;
  };
}

export default function PaymentMethodForm({ paymentMethod }: PaymentMethodFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(paymentMethod?.name || "");
  const [isActive, setIsActive] = useState(paymentMethod?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama metode pembayaran wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    const data: PaymentMethodData = {
      name: name.trim(),
      isActive,
    };

    const res = paymentMethod
      ? await updatePaymentMethod(paymentMethod.id, data)
      : await createPaymentMethod(data);

    setLoading(false);

    if (res.success) {
      router.push("/payment-method");
      router.refresh();
    } else {
      setError(res.error || "Terjadi kesalahan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nama Metode Pembayaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Contoh: Tunai, Transfer Bank, QRIS"
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Status
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              Aktif
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-white/[0.05]">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03] transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors"
        >
          {loading ? "Menyimpan..." : paymentMethod ? "Simpan Perubahan" : "Buat Metode Pembayaran"}
        </button>
      </div>
    </form>
  );
}
