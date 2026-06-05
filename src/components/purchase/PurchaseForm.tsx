"use client";

import React, { useState } from "react";
import { createPurchase } from "@/actions/purchase";
import ProductSearchModal from "./ProductSearchModal";
import { useRouter } from "next/navigation";

interface PurchaseFormProps {
  suppliers: any[];
  currentUser: { id: string };
}

export default function PurchaseForm({ suppliers, currentUser }: PurchaseFormProps) {
  const router = useRouter();
  
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [notes, setNotes] = useState("");
  
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddProduct = (product: any) => {
    // Check if already added
    const exists = items.find((item) => item.productId === product.id);
    if (exists) {
      // Just increase quantity
      setItems(items.map((item) => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.costPrice }
          : item
      ));
    } else {
      // Add new
      setItems([...items, {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        costPrice: product.costPrice || 0,
        subtotal: product.costPrice || 0
      }]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].subtotal = newItems[index].quantity * newItems[index].costPrice;
    setItems(newItems);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!invoiceNumber) return setError("Nomor Invoice harus diisi");
    if (!supplierId) return setError("Supplier harus dipilih");
    if (items.length === 0) return setError("Pilih minimal 1 produk");

    setIsSubmitting(true);
    
    const res = await createPurchase({
      invoiceNumber,
      supplierId,
      userId: currentUser.id,
      notes,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        costPrice: item.costPrice,
        subtotal: item.subtotal
      })),
      total: grandTotal
    });

    if (res.success) {
      router.push("/pembelian");
      router.refresh();
    } else {
      setError(res.error || "Terjadi kesalahan");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProductSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleAddProduct} 
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left / Top: Header Data */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informasi Pembelian</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Invoice</label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Misal: INV-SUP-001"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>-- Pilih Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan Tambahan</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Item List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-0 shadow-sm overflow-hidden flex flex-col h-full">
            
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Daftar Produk</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Produk
              </button>
            </div>

            <div className="flex-1 overflow-x-auto p-0">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">PRODUK</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 w-32">HARGA BELI</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 w-24">QTY</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 w-40 text-right">SUBTOTAL</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                        Belum ada produk yang dipilih. Klik tombol <strong>Tambah Produk</strong>.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-800 dark:text-white">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.sku}</div>
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            min="0"
                            required
                            value={item.costPrice}
                            onChange={(e) => handleItemChange(idx, "costPrice", Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            min="1"
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white text-center"
                          />
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-gray-800 dark:text-gray-200">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer Form */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between mt-auto">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Grand Total</div>
                <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="px-6 py-3 font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Transaksi
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
