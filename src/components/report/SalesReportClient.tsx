"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getSalesReport, SalesReportFilters } from "@/actions/report";

interface SalesReportClientProps {
  cashiers: any[];
  customers: any[];
  paymentMethods: any[];
  products: any[];
}

export default function SalesReportClient({ cashiers, customers, paymentMethods, products }: SalesReportClientProps) {
  // Filter States
  const [filters, setFilters] = useState<SalesReportFilters>({
    startDate: "",
    endDate: "",
    invoiceNumber: "",
    userId: "",
    customerId: "",
    paymentMethodId: "",
    status: "",
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
    const res = await getSalesReport(filters);
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
      customerId: "",
      paymentMethodId: "",
      status: "",
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
      "Kasir",
      "Pelanggan",
      "Metode Pembayaran",
      "Status",
      "Produk Terjual",
      "Subtotal",
      "Diskon",
      "Pajak",
      "Total"
    ];

    // Rows
    const rows = data.map((item) => {
      const soldProductsStr = item.saleDetails?.map((detail: any) => `${detail.quantity}x ${detail.product?.name || 'Unknown'}`).join(" | ") || "-";

      return [
        new Date(item.createdAt).toLocaleString("id-ID"),
        item.invoiceNumber,
        item.user?.fullName || item.user?.name || "-",
        item.customer?.name || "UMUM",
        item.paymentMethod?.name || "-",
        item.status,
        soldProductsStr,
        Number(item.subtotal),
        Number(item.discount),
        Number(item.tax),
        Number(item.grandTotal)
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
    link.setAttribute("download", `Laporan_Penjualan_${new Date().getTime()}.csv`);
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kasir</label>
            <select
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Kasir</option>
              {cashiers.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName || c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pelanggan</label>
            <select
              name="customerId"
              value={filters.customerId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Pelanggan</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Metode Pembayaran</label>
            <select
              name="paymentMethodId"
              value={filters.paymentMethodId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Metode</option>
              {paymentMethods.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Transaksi</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Status</option>
              <option value="PAID">PAID (Lunas)</option>
              <option value="VOID">VOID (Dibatalkan)</option>
              <option value="HOLD">HOLD (Ditahan)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Produk</label>
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
            {/* The apply button just refetches manually if they don't want to wait for the hook, but useEffect handles it. 
                We can keep it to reassure users. */}
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
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">INVOICE</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">PELANGGAN</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">KASIR</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">PRODUK TERJUAL</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">TOTAL</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
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
                      {item.customer?.name || "UMUM"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {item.user?.fullName || item.user?.name || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300 min-w-[200px] max-w-[350px] whitespace-normal" title={item.saleDetails?.map((d: any) => `${d.quantity}x ${d.product?.name}`).join(", ")}>
                      <div className="flex flex-wrap gap-1">
                        {item.saleDetails?.map((detail: any, i: number) => (
                          <span key={i} className="inline-block bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs">
                            <span className="font-semibold text-brand-600 dark:text-brand-400">{detail.quantity}x</span> {detail.product?.name || 'Unknown'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-200 font-semibold text-right">
                      Rp {Number(item.grandTotal).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${item.status === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' : ''}
                        ${item.status === 'VOID' ? 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400' : ''}
                        ${item.status === 'HOLD' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400' : ''}
                      `}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
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
