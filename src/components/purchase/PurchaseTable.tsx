"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PurchaseTable({ purchases }: { purchases: any[] }) {
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-255px)] overflow-y-auto custom-scrollbar">
          <table className="min-w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">TANGGAL</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">NO INVOICE</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">SUPPLIER</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">KASIR / STAFF</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">PRODUK DIBELI</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {purchases.length > 0 ? (
                purchases.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {new Date(item.createdAt).toLocaleString("id-ID", {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium text-brand-600 dark:text-brand-400">
                      <button 
                        onClick={() => setSelectedPurchase(item)}
                        className="hover:underline hover:text-brand-700 transition-all font-semibold"
                        title="Lihat Detail Transaksi"
                      >
                        {item.invoiceNumber}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {item.supplier?.name || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {item.user?.fullName || item.user?.username || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300 min-w-[200px] max-w-[350px] whitespace-normal">
                      <div className="flex flex-wrap gap-1">
                        {item.purchaseDetails?.map((detail: any, i: number) => (
                          <span key={i} className="inline-block bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs">
                            <span className="font-semibold text-brand-600 dark:text-brand-400">{detail.quantity}x</span> {detail.product?.name || 'Unknown'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-200 font-semibold text-right">
                      Rp {Number(item.total).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    Belum ada data pembelian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detail Pembelian</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedPurchase.invoiceNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedPurchase(null)} 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content info */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Tanggal</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date(selectedPurchase.createdAt).toLocaleString("id-ID", {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Supplier</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{selectedPurchase.supplier?.name || "-"}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Staff / Kasir</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{selectedPurchase.user?.fullName || selectedPurchase.user?.username || "-"}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Total Transaksi</div>
                <div className="font-bold text-brand-600 dark:text-brand-400">Rp {Number(selectedPurchase.total).toLocaleString("id-ID")}</div>
              </div>
              {selectedPurchase.notes && (
                <div className="col-span-2 md:col-span-4 mt-2">
                  <div className="text-gray-500 mb-1">Catatan:</div>
                  <div className="text-gray-700 dark:text-gray-300 italic">"{selectedPurchase.notes}"</div>
                </div>
              )}
            </div>

            {/* Table Details */}
            <div className="overflow-y-auto flex-1 p-5 custom-scrollbar">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">PRODUK</th>
                    <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400 text-center">QTY</th>
                    <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400 text-right">HARGA BELI</th>
                    <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400 text-right">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {selectedPurchase.purchaseDetails?.map((d: any, i: number) => (
                    <tr key={i}>
                      <td className="py-3">
                        <div className="font-medium text-gray-800 dark:text-gray-200">{d.product?.name || "Produk Dihapus"}</div>
                        <div className="text-xs text-gray-500">{d.product?.sku}</div>
                      </td>
                      <td className="py-3 text-center font-medium">
                        {d.quantity}
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                        Rp {Number(d.costPrice).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 text-right font-semibold text-gray-800 dark:text-gray-200">
                        Rp {Number(d.subtotal).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button 
                onClick={() => setSelectedPurchase(null)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
