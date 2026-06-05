"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { updateSetting, uploadLogo, removeLogo } from "@/actions/setting";
import { useSetting } from "@/context/SettingContext";

export default function SettingForm({ setting }: { setting: any }) {
  const { refreshSetting } = useSetting();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(setting?.logo || null);
  const [logoLoading, setLogoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData(e.currentTarget);

    const data = {
      storeName: formData.get("storeName") as string,
      storeAddress: formData.get("storeAddress") as string,
      storePhone: formData.get("storePhone") as string,
      storeEmail: formData.get("storeEmail") as string,
      cashierName: formData.get("cashierName") as string,
      discountMethod: formData.get("discountMethod") as string,
      defaultTax: parseFloat(formData.get("defaultTax") as string) || 0,
      transactionType: formData.get("transactionType") as string,
      printMethod: formData.get("printMethod") as string,
      bank1Name: formData.get("bank1Name") as string,
      bank1AccountNumber: formData.get("bank1AccountNumber") as string,
      bank1AccountName: formData.get("bank1AccountName") as string,
      bank2Name: formData.get("bank2Name") as string,
      bank2AccountNumber: formData.get("bank2AccountNumber") as string,
      bank2AccountName: formData.get("bank2AccountName") as string,
      receiptFooter1: formData.get("receiptFooter1") as string,
      receiptFooter2: formData.get("receiptFooter2") as string,
      receiptFooter3: formData.get("receiptFooter3") as string,
      invoiceFooter1: formData.get("invoiceFooter1") as string,
      invoiceFooter2: formData.get("invoiceFooter2") as string,
      invoiceFooter3: formData.get("invoiceFooter3") as string,
      regards: formData.get("regards") as string,
    };

    const res = await updateSetting(data);
    setLoading(false);

    if (res.success) {
      setSuccess("Pengaturan berhasil disimpan!");
      refreshSetting();
      setTimeout(() => setSuccess(""), 4000);
    } else {
      setError(res.error || "Terjadi kesalahan");
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setLogoLoading(true);
    const fd = new FormData();
    fd.append("logo", file);
    const res = await uploadLogo(fd);
    setLogoLoading(false);

    if (res.success && res.data) {
      setLogoPreview(res.data.logoUrl);
      refreshSetting();
    } else {
      setError(res.error || "Gagal mengupload logo");
      setLogoPreview(setting?.logo || null);
    }
  };

  const handleRemoveLogo = async () => {
    setLogoLoading(true);
    const res = await removeLogo();
    setLogoLoading(false);
    if (res.success) {
      setLogoPreview(null);
      refreshSetting();
    } else {
      setError(res.error || "Gagal menghapus logo");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white dark:bg-gray-800";

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300";

  const sectionTitle =
    "text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4";

  return (
    <form onSubmit={handleSubmit}>
      {/* Alert messages */}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ====== KOLOM KIRI ====== */}
        <div className="space-y-6">
          {/* Informasi Toko */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Informasi Toko</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nama Toko <span className="text-red-500">*</span></label>
                <input type="text" name="storeName" required defaultValue={setting?.storeName || ""} className={inputClass} placeholder="Nama toko Anda" />
              </div>
              <div>
                <label className={labelClass}>Alamat</label>
                <textarea name="storeAddress" rows={3} defaultValue={setting?.storeAddress || ""} className={inputClass + " resize-none"} placeholder="Alamat lengkap toko" />
              </div>
              <div>
                <label className={labelClass}>Telepon / HP</label>
                <input type="text" name="storePhone" defaultValue={setting?.storePhone || ""} className={inputClass} placeholder="08xx-xxxx-xxxx" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="storeEmail" defaultValue={setting?.storeEmail || ""} className={inputClass} placeholder="email@toko.com" />
              </div>
            </div>
          </div>

          {/* Operasional */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Operasional</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Kasir</label>
                <input type="text" name="cashierName" defaultValue={setting?.cashierName || ""} className={inputClass} placeholder="Nama kasir default" />
              </div>
              <div>
                <label className={labelClass}>Metode Diskon</label>
                <select name="discountMethod" defaultValue={setting?.discountMethod || "Persen"} className={inputClass}>
                  <option value="Persen">Persen (%)</option>
                  <option value="Nominal">Nominal (Rp)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Pajak (%)</label>
                <input type="number" name="defaultTax" step="0.01" min="0" max="100" defaultValue={setting?.defaultTax ?? 0} className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Jenis Nota Transaksi</label>
                <select name="transactionType" defaultValue={setting?.transactionType || "Invoice"} className={inputClass}>
                  <option value="Invoice">Invoice</option>
                  <option value="Struk">Struk</option>
                  <option value="Keduanya">Keduanya</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Metode Cetak</label>
                <select name="printMethod" defaultValue={setting?.printMethod || "Export ke PDF"} className={inputClass}>
                  <option value="Export ke PDF">Export ke PDF</option>
                  <option value="Printer Thermal">Printer Thermal</option>
                  <option value="Printer Biasa">Printer Biasa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Logo pada Nota</h3>
            <div className="space-y-4">
              {/* Logo preview */}
              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50" style={{ minHeight: 140 }}>
                {logoLoading ? (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-sm">Memproses...</span>
                  </div>
                ) : logoPreview ? (
                  <div className="relative flex flex-col items-center gap-2">
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                      <Image src={logoPreview} alt="Logo toko" fill className="object-contain p-2" unoptimized />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Logo saat ini</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Belum ada logo</span>
                    <span className="text-xs">JPG, PNG, SVG • Maks 2MB</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={logoLoading}
                  className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {logoPreview ? "Ganti Logo" : "Pilih Logo"}
                </button>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={logoLoading}
                    className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    Hapus Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ====== KOLOM TENGAH ====== */}
        <div className="space-y-6">
          {/* Bank 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Bank 1</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nama Bank</label>
                <input type="text" name="bank1Name" defaultValue={setting?.bank1Name || ""} className={inputClass} placeholder="Contoh: BCA, BNI, Mandiri" />
              </div>
              <div>
                <label className={labelClass}>No. Rekening</label>
                <input type="text" name="bank1AccountNumber" defaultValue={setting?.bank1AccountNumber || ""} className={inputClass} placeholder="Nomor rekening" />
              </div>
              <div>
                <label className={labelClass}>Atas Nama</label>
                <input type="text" name="bank1AccountName" defaultValue={setting?.bank1AccountName || ""} className={inputClass} placeholder="Nama pemilik rekening" />
              </div>
            </div>
          </div>

          {/* Bank 2 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Bank 2</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nama Bank</label>
                <input type="text" name="bank2Name" defaultValue={setting?.bank2Name || ""} className={inputClass} placeholder="Contoh: BCA, BNI, Mandiri" />
              </div>
              <div>
                <label className={labelClass}>No. Rekening</label>
                <input type="text" name="bank2AccountNumber" defaultValue={setting?.bank2AccountNumber || ""} className={inputClass} placeholder="Nomor rekening" />
              </div>
              <div>
                <label className={labelClass}>Atas Nama</label>
                <input type="text" name="bank2AccountName" defaultValue={setting?.bank2AccountName || ""} className={inputClass} placeholder="Nama pemilik rekening" />
              </div>
            </div>
          </div>
        </div>

        {/* ====== KOLOM KANAN ====== */}
        <div className="space-y-6">
          {/* Footer Struk */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Footer Struk Kasir</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Baris 1</label>
                <input type="text" name="receiptFooter1" defaultValue={setting?.receiptFooter1 || ""} className={inputClass} placeholder="Teks baris 1" />
              </div>
              <div>
                <label className={labelClass}>Baris 2</label>
                <input type="text" name="receiptFooter2" defaultValue={setting?.receiptFooter2 || ""} className={inputClass} placeholder="Teks baris 2" />
              </div>
              <div>
                <label className={labelClass}>Baris 3</label>
                <input type="text" name="receiptFooter3" defaultValue={setting?.receiptFooter3 || ""} className={inputClass} placeholder="Teks baris 3" />
              </div>
            </div>
          </div>

          {/* Footer Invoice */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Footer Invoice & Faktur</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Baris 1</label>
                <input type="text" name="invoiceFooter1" defaultValue={setting?.invoiceFooter1 || ""} className={inputClass} placeholder="Teks baris 1" />
              </div>
              <div>
                <label className={labelClass}>Baris 2</label>
                <input type="text" name="invoiceFooter2" defaultValue={setting?.invoiceFooter2 || ""} className={inputClass} placeholder="Teks baris 2" />
              </div>
              <div>
                <label className={labelClass}>Baris 3</label>
                <input type="text" name="invoiceFooter3" defaultValue={setting?.invoiceFooter3 || ""} className={inputClass} placeholder="Teks baris 3" />
              </div>
            </div>
          </div>

          {/* Hormat Kami */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className={sectionTitle}>Tanda Tangan / Hormat Kami</h3>
            <div>
              <label className={labelClass}>Nama</label>
              <input type="text" name="regards" defaultValue={setting?.regards || ""} className={inputClass} placeholder="Nama / toko untuk tanda tangan" />
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          * Perubahan akan langsung diterapkan ke seluruh aplikasi
        </p>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
              </svg>
              Simpan Pengaturan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
