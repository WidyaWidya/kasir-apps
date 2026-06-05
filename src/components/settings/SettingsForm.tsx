"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { SettingData } from "@/hooks/useSettings";

interface SettingsFormProps {
  initialSettings?: SettingData | null;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Gagal membaca file logo"));
      }
    };
    reader.onerror = () => reject(new Error("Gagal membaca file logo"));
    reader.readAsDataURL(file);
  });
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [storeName, setStoreName] = useState(initialSettings?.storeName || "");
  const [storeAddress, setStoreAddress] = useState(initialSettings?.storeAddress || "");
  const [storePhone, setStorePhone] = useState(initialSettings?.storePhone || "");
  const [storeEmail, setStoreEmail] = useState(initialSettings?.storeEmail || "");
  const [cashierName, setCashierName] = useState(initialSettings?.cashierName || "");
  const [discountMethod, setDiscountMethod] = useState(initialSettings?.discountMethod || "Persen");
  const [transactionType, setTransactionType] = useState(initialSettings?.transactionType || "Invoice");
  const [printMethod, setPrintMethod] = useState(initialSettings?.printMethod || "Export ke PDF");
  const [bank1Name, setBank1Name] = useState(initialSettings?.bank1Name || "");
  const [bank1Account, setBank1Account] = useState(initialSettings?.bank1Account || "");
  const [bank1Owner, setBank1Owner] = useState(initialSettings?.bank1Owner || "");
  const [bank2Name, setBank2Name] = useState(initialSettings?.bank2Name || "");
  const [bank2Account, setBank2Account] = useState(initialSettings?.bank2Account || "");
  const [bank2Owner, setBank2Owner] = useState(initialSettings?.bank2Owner || "");
  const [logo, setLogo] = useState(initialSettings?.logo || "");
  const [receiptFooterLine1, setReceiptFooterLine1] = useState(initialSettings?.receiptFooterLine1 || "");
  const [receiptFooterLine2, setReceiptFooterLine2] = useState(initialSettings?.receiptFooterLine2 || "");
  const [receiptFooterLine3, setReceiptFooterLine3] = useState(initialSettings?.receiptFooterLine3 || "");
  const [invoiceFooterLine1, setInvoiceFooterLine1] = useState(initialSettings?.invoiceFooterLine1 || "");
  const [invoiceFooterLine2, setInvoiceFooterLine2] = useState(initialSettings?.invoiceFooterLine2 || "");
  const [invoiceFooterLine3, setInvoiceFooterLine3] = useState(initialSettings?.invoiceFooterLine3 || "");
  const [signatureName, setSignatureName] = useState(initialSettings?.signatureName || "");
  const [defaultTax, setDefaultTax] = useState(initialSettings?.defaultTax?.toString() || "0.00");
  const [defaultDiscount, setDefaultDiscount] = useState(initialSettings?.defaultDiscount?.toString() || "0.00");

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setLogo(dataUrl);
    } catch (err) {
      setError("Gagal membaca file logo");
    }
  };

  const handleRemoveLogo = () => {
    setLogo("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!storeName.trim()) {
      setError("Nama toko wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      storeName: storeName.trim(),
      storeAddress: storeAddress.trim() || undefined,
      storePhone: storePhone.trim() || undefined,
      storeEmail: storeEmail.trim() || undefined,
      cashierName: cashierName.trim() || undefined,
      discountMethod: discountMethod || undefined,
      transactionType: transactionType || undefined,
      printMethod: printMethod || undefined,
      bank1Name: bank1Name.trim() || undefined,
      bank1Account: bank1Account.trim() || undefined,
      bank1Owner: bank1Owner.trim() || undefined,
      bank2Name: bank2Name.trim() || undefined,
      bank2Account: bank2Account.trim() || undefined,
      bank2Owner: bank2Owner.trim() || undefined,
      logo: logo || undefined,
      receiptFooterLine1: receiptFooterLine1.trim() || undefined,
      receiptFooterLine2: receiptFooterLine2.trim() || undefined,
      receiptFooterLine3: receiptFooterLine3.trim() || undefined,
      invoiceFooterLine1: invoiceFooterLine1.trim() || undefined,
      invoiceFooterLine2: invoiceFooterLine2.trim() || undefined,
      invoiceFooterLine3: invoiceFooterLine3.trim() || undefined,
      signatureName: signatureName.trim() || undefined,
      defaultTax: defaultTax || undefined,
      defaultDiscount: defaultDiscount || undefined,
    };

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || "Terjadi kesalahan saat menyimpan pengaturan.");
      } else {
        setSuccess("Pengaturan berhasil disimpan.");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Informasi Toko</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Nama Toko</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Alamat</label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Telepon / HP</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Kasir</label>
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Metode Diskon</label>
                <select
                  value={discountMethod}
                  onChange={(e) => setDiscountMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                >
                  <option>Persen</option>
                  <option>Nominal</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Pajak (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={defaultTax}
                  onChange={(e) => setDefaultTax(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Diskon default</label>
                <input
                  type="number"
                  step="0.01"
                  value={defaultDiscount}
                  onChange={(e) => setDefaultDiscount(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Jenis Nota Transaksi</label>
                <input
                  type="text"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  placeholder="Invoice"
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Metode Cetak</label>
                <input
                  type="text"
                  value={printMethod}
                  onChange={(e) => setPrintMethod(e.target.value)}
                  placeholder="Export ke PDF"
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Data Bank</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Bank 1 - Nama Bank</label>
                <input
                  type="text"
                  value={bank1Name}
                  onChange={(e) => setBank1Name(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Bank 1 - No. Rekening</label>
                <input
                  type="text"
                  value={bank1Account}
                  onChange={(e) => setBank1Account(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Bank 1 - Atas Nama</label>
                <input
                  type="text"
                  value={bank1Owner}
                  onChange={(e) => setBank1Owner(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Bank 2 - Nama Bank</label>
                <input
                  type="text"
                  value={bank2Name}
                  onChange={(e) => setBank2Name(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Bank 2 - No. Rekening</label>
                <input
                  type="text"
                  value={bank2Account}
                  onChange={(e) => setBank2Account(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Bank 2 - Atas Nama</label>
                <input
                  type="text"
                  value={bank2Owner}
                  onChange={(e) => setBank2Owner(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Footer Struk Kasir</h2>
            <div className="grid gap-4">
              <input
                type="text"
                value={receiptFooterLine1}
                onChange={(e) => setReceiptFooterLine1(e.target.value)}
                placeholder="Baris 1"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              />
              <input
                type="text"
                value={receiptFooterLine2}
                onChange={(e) => setReceiptFooterLine2(e.target.value)}
                placeholder="Baris 2"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              />
              <input
                type="text"
                value={receiptFooterLine3}
                onChange={(e) => setReceiptFooterLine3(e.target.value)}
                placeholder="Baris 3"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Footer Invoice dan Faktur</h2>
            <div className="grid gap-4">
              <input
                type="text"
                value={invoiceFooterLine1}
                onChange={(e) => setInvoiceFooterLine1(e.target.value)}
                placeholder="Baris 1"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              />
              <input
                type="text"
                value={invoiceFooterLine2}
                onChange={(e) => setInvoiceFooterLine2(e.target.value)}
                placeholder="Baris 2"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              />
              <input
                type="text"
                value={invoiceFooterLine3}
                onChange={(e) => setInvoiceFooterLine3(e.target.value)}
                placeholder="Baris 3"
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Hormat Kami</h2>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Nama untuk tanda tangan"
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Logo Nota</h2>
            <div className="mb-4 rounded-xl border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo Toko"
                  className="mx-auto max-h-40 object-contain"
                />
              ) : (
                <div className="py-10 text-sm text-gray-500">Belum ada logo disimpan</div>
              )}
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Pilih logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-white file:hover:bg-brand-600"
              />
              {logo && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  Hapus Logo
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-lg font-semibold">Preview Nama Aplikasi</h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-400">Nama aplikasi akan terupdate pada topbar dan sidebar.</p>
              <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{storeName || "Belum diisi"}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
