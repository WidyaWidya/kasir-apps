"use client";

import React, { useState, useEffect } from "react";
import { createTransaction } from "@/actions/pos";
import type { CartItem, TransactionData } from "@/actions/pos";
import PrintPreview from "./PrintPreview";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  initialData: {
    customers: any[];
    salesUsers: any[];
    paymentMethods: any[];
  };
  currentUser: {
    id: string;
    name: string;
  };
  onSuccess: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  subtotal,
  discount,
  tax,
  grandTotal,
  initialData,
  currentUser,
  onSuccess,
}: CheckoutModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [salesUserId, setSalesUserId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<any>(null); // For PrintPreview

  useEffect(() => {
    if (isOpen) {
      setPaidAmount("");
      setError("");
      setSuccessData(null);
      
      // Default to Cash or first payment method
      if (initialData.paymentMethods?.length > 0) {
        setPaymentMethodId(initialData.paymentMethods[0].id);
      }
      // Default to "UMUM" customer if exists
      const umumCustomer = initialData.customers?.find((c: any) => c.name.toUpperCase().includes("UMUM"));
      if (umumCustomer) {
        setCustomerId(umumCustomer.id);
      } else {
        setCustomerId("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // Render PrintPreview if transaction successful
  if (successData) {
    return (
      <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
          
          {/* Success Banner */}
          <div className="p-6 bg-green-500 text-white flex flex-col items-center justify-center shrink-0 text-center relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-black text-2xl mb-1">Transaksi Berhasil Disimpan!</h2>
            <p className="text-green-100 font-medium">Invoice: {successData.invoiceNumber}</p>
            
            <button onClick={() => onSuccess()} className="absolute top-4 right-4 text-white hover:text-green-200 bg-black/10 rounded-full p-2 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-100 dark:bg-gray-800 flex flex-col items-center">
             <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest">Pratinjau Struk</p>
             <PrintPreview transaction={successData} />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-end gap-3 shrink-0">
            <button
              onClick={() => onSuccess()}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Tutup & Transaksi Baru
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak PDF (Ctrl+P)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const numericPaidAmount = parseInt(paidAmount.replace(/\D/g, "")) || 0;
  const changeAmount = numericPaidAmount - grandTotal;
  const isPaidEnough = numericPaidAmount >= grandTotal;

  const handleCheckout = async () => {
    if (!isPaidEnough) {
      setError("Jumlah tunai kurang dari total belanja.");
      return;
    }

    setIsLoading(true);
    setError("");

    const payload: TransactionData = {
      customerId: customerId || undefined,
      userId: currentUser.id,
      salesUserId: salesUserId || undefined,
      paymentMethodId: paymentMethodId || undefined,
      subtotal,
      discount,
      tax,
      grandTotal,
      paidAmount: numericPaidAmount,
      changeAmount,
      notes: notes || undefined,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        subtotal: item.subtotal,
      })),
    };

    const res = await createTransaction(payload);
    setIsLoading(false);

    if (res.success) {
      // Transaction complete!
      // Add more details to the preview
      setSuccessData({
        ...res.data,
        cartItems: cart,
        cashierName: currentUser.name,
        customerName: initialData.customers.find(c => c.id === customerId)?.name || "UMUM",
      });
    } else {
      setError(res.error || "Gagal memproses transaksi.");
    }
  };

  const quickAmounts = [
    grandTotal,
    Math.ceil(grandTotal / 50000) * 50000,
    Math.ceil(grandTotal / 100000) * 100000,
  ].filter((val, idx, arr) => arr.indexOf(val) === idx && val >= grandTotal);

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Summary & Quick Cash */}
        <div className="w-full md:w-2/5 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Ringkasan Tagihan</h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3 flex-1">
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <span>Item ({cart.length})</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-500 text-sm">
                <span>Diskon</span>
                <span>- Rp {discount.toLocaleString("id-ID")}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>Pajak (PPN)</span>
                <span>+ Rp {tax.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="pt-3 mt-3 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="font-bold text-gray-800 dark:text-gray-200">TOTAL</span>
              <span className="font-black text-2xl text-brand-600 dark:text-brand-400">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Pilihan Cepat (Tunai)</p>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((amount, idx) => (
                <button
                  key={idx}
                  onClick={() => setPaidAmount(amount.toString())}
                  className="py-3 px-2 rounded-lg border border-brand-200 dark:border-brand-900/50 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-bold hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors text-sm"
                >
                  {amount === grandTotal ? "Uang Pas" : `Rp ${(amount / 1000)}K`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Inputs */}
        <div className="w-full md:w-3/5 p-6 flex flex-col bg-white dark:bg-gray-800 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pembayaran</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pelanggan</label>
                <select 
                  value={customerId} 
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">Pilih Pelanggan...</option>
                  {initialData.customers?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sales (Opsional)</label>
                <select 
                  value={salesUserId} 
                  onChange={(e) => setSalesUserId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">Tanpa Sales...</option>
                  {initialData.salesUsers?.map((u) => (
                    <option key={u.id} value={u.id}>{u.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {initialData.paymentMethods?.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethodId(pm.id)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethodId === pm.id ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {pm.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nominal Tunai (Rp) <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={numericPaidAmount ? numericPaidAmount.toLocaleString("id-ID") : ""}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-4 text-2xl font-bold text-gray-800 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                autoFocus
              />
            </div>

            <div className={`p-4 rounded-xl border ${changeAmount >= 0 ? 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20' : 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${changeAmount >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {changeAmount >= 0 ? 'Kembalian' : 'Kekurangan'}
                </span>
                <span className={`text-xl font-black ${changeAmount >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  Rp {Math.abs(changeAmount).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleCheckout}
              disabled={isLoading || !isPaidEnough}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                  Memproses...
                </>
              ) : (
                <>Simpan Transaksi</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
