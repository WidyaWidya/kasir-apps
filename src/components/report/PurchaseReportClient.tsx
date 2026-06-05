"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getPurchaseReport, PurchaseReportFilter } from "@/actions/report-purchase";

interface PurchaseReportClientProps {
  staffs: any[];
  suppliers: any[];
  products: any[];
}

export default function PurchaseReportClient({ staffs, suppliers, products }: PurchaseReportClientProps) {
  // Filter States
  const [filters, setFilters] = useState<PurchaseReportFilter>({
    startDate: "",
    endDate: "",
    invoiceNumber: "",
    userId: "",
    supplierId: "",
    productId: "",
  });

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Data
  const fetchData = useCallback(async () => {
    // Return early if both dates are empty
    if (!filters.startDate && !filters.endDate) {
      setData([]);
      return;
    }

    setIsLoading(true);
    const res = await getPurchaseReport(filters);
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setData([]);
    }
    setIsLoading(false);
  }, [filters]);

  // Initial Load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Input Changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Reset
  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      invoiceNumber: "",
      userId: "",
      supplierId: "",
      productId: "",
    });
  };

  // Download CSV
  const downloadCSV = () => {
    if (data.length === 0) return;

    // Header
    const headers = [
      "Tanggal",
      "No. Invoice",
      "Supplier",
      "Staff/Kasir",
      "Produk Dibeli",
      "Total"
    ];

    // Rows
    const rows = data.map((item) => {
      const purchasedProductsStr = item.purchaseDetails?.map((detail: any) => `${detail.quantity}x ${detail.product?.name || 'Unknown'}`).join(" | ") || "-";

      return [
        new Date(item.createdAt).toLocaleString("id-ID"),
        item.invoiceNumber,
        item.supplier?.name || "-",
        item.user?.fullName || item.user?.username || "-",
        purchasedProductsStr,
        Number(item.total)
      ];
    });

    // Convert to CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Pembelian_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter Pencarian</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              onClick={(e) => (e.target as any).showPicker && (e.target as any).showPicker()}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              onClick={(e) => (e.target as any).showPicker && (e.target as any).showPicker()}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Invoice</label>
            <input
              type="text"
              name="invoiceNumber"
              value={filters.invoiceNumber}
              onChange={handleFilterChange}
              placeholder="Cari nomor invoice..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
            <select
              name="supplierId"
              value={filters.supplierId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff / Kasir</label>
            <select
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Staff</option>
              {staffs.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName || c.username}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Produk Dibeli</label>
            <select
              name="productId"
              value={filters.productId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Produk</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Reset Filter
            </button>
            <button
              onClick={fetchData}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              Terapkan Filter
            </button>
          </div>

          <div>
            <button
              onClick={downloadCSV}
              disabled={data.length === 0}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Excel (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {new Date(item.createdAt).toLocaleString("id-ID", {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium text-brand-600 dark:text-brand-400">
                      {item.invoiceNumber}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {item.supplier?.name || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {item.user?.fullName || item.user?.username || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300 min-w-[200px] max-w-[350px] whitespace-normal" title={item.purchaseDetails?.map((d: any) => `${d.quantity}x ${d.product?.name}`).join(", ")}>
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
                    {(!filters.startDate && !filters.endDate) 
                      ? "Silakan pilih rentang tanggal (Mulai / Akhir) terlebih dahulu untuk memuat laporan."
                      : "Data transaksi tidak ditemukan untuk filter ini."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
