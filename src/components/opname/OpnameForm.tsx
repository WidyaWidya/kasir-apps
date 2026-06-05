"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductSearchModal from "@/components/purchase/ProductSearchModal";
import { createOpname } from "@/actions/opname";

export default function OpnameForm() {
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  const [actualStock, setActualStock] = useState<string>("");
  const [reason, setReason] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setActualStock(product.stock.toString()); // Pre-fill with current stock
    setIsModalOpen(false);
  };

  const calculateDiff = () => {
    if (!selectedProduct) return 0;
    const actual = parseInt(actualStock) || 0;
    return actual - selectedProduct.stock;
  };

  const diff = calculateDiff();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedProduct) return setError("Silakan pilih produk terlebih dahulu");
    if (actualStock === "" || parseInt(actualStock) < 0) return setError("Stok fisik tidak valid");
    if (!reason.trim()) return setError("Alasan / Catatan wajib diisi");

    setIsSubmitting(true);
    
    const res = await createOpname({
      productId: selectedProduct.id,
      actualStock: parseInt(actualStock),
      reason: reason.trim()
    });

    if (res.success) {
      router.push("/stok/opname");
      router.refresh();
    } else {
      setError(res.error || "Terjadi kesalahan");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProductSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelectProduct} 
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Penyesuaian Stok (Stock Opname)</h3>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Produk</label>
            {selectedProduct ? (
              <div className="flex items-center justify-between p-4 rounded-lg border border-brand-200 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-800">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">{selectedProduct.name}</div>
                  <div className="text-sm text-gray-500 mt-1">SKU: {selectedProduct.sku}</div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 px-3 py-1.5 rounded-md hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                >
                  Ganti Produk
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Klik untuk mencari Produk</span>
              </button>
            )}
          </div>

          {selectedProduct && (
            <>
              {/* Stock Inputs */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stok Sistem Saat Ini</label>
                  <div className="text-3xl font-bold text-gray-400 dark:text-gray-500">
                    {selectedProduct.stock}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stok Fisik (Aktual) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={actualStock}
                    onChange={(e) => setActualStock(e.target.value)}
                    className="w-full text-3xl font-bold rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  
                  {actualStock !== "" && (
                    <div className="mt-3 text-sm flex items-center gap-2">
                      <span className="text-gray-500">Selisih:</span>
                      {diff === 0 ? (
                        <span className="text-gray-500 font-medium">Sama (0)</span>
                      ) : diff > 0 ? (
                        <span className="text-green-600 font-bold px-2 py-0.5 rounded bg-green-100">+{diff} (Barang Lebih)</span>
                      ) : (
                        <span className="text-red-600 font-bold px-2 py-0.5 rounded bg-red-100">{diff} (Barang Kurang)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alasan / Catatan Penyesuaian <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Misal: Barang pecah/rusak 2 pcs, salah hitung dari supplier, dll..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || actualStock === "" || parseInt(actualStock) < 0}
                  className="w-full py-3.5 font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Penyesuaian Stok
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
