"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getStockReport, StockReportFilter } from "@/actions/report-stock";

interface StockReportClientProps {
  categories: any[];
  brands: any[];
}

export default function StockReportClient({ categories, brands }: StockReportClientProps) {
  // Filter States
  const [filters, setFilters] = useState<StockReportFilter>({
    search: "",
    categoryId: "",
    brandId: "",
    stockStatus: "ALL",
  });

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await getStockReport(filters);
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setData([]);
    }
    setIsLoading(false);
  }, [filters]);

  // Initial Load & On Filter Change
  // For stock report, we don't have mandatory date range, so we can fetch immediately
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
      search: "",
      categoryId: "",
      brandId: "",
      stockStatus: "ALL",
    });
  };

  // Download CSV
  const downloadCSV = () => {
    if (data.length === 0) return;

    // Header
    const headers = [
      "SKU",
      "Nama Produk",
      "Kategori",
      "Merek",
      "Harga Beli (HPP)",
      "Batas Minimum",
      "Stok Aktual",
      "Total Nilai Aset"
    ];

    // Rows
    const rows = data.map((item) => {
      const assetValue = Number(item.costPrice) * Number(item.stock);
      return [
        item.sku,
        item.name,
        item.category?.name || "-",
        item.brand?.name || "-",
        Number(item.costPrice),
        item.minStock,
        item.stock,
        assetValue
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
    link.setAttribute("download", `Laporan_Stok_Gudang_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter Pencarian</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cari Produk / SKU</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Ketik nama atau SKU..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Stok</label>
            <select
              name="stockStatus"
              value={filters.stockStatus}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">Semua Kondisi</option>
              <option value="AVAILABLE">Tersedia (Stok &gt; 0)</option>
              <option value="LOW_STOCK">Menipis (≤ Batas Minimum)</option>
              <option value="OUT_OF_STOCK">Habis (Stok 0)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Merek</label>
            <select
              name="brandId"
              value={filters.brandId}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Merek</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
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
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">SKU</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">NAMA PRODUK</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">KATEGORI</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">MEREK</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">HARGA BELI</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center">STOK</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">TOTAL ASET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => {
                  const assetValue = Number(item.costPrice) * Number(item.stock);
                  const isOutOfStock = item.stock <= 0;
                  const isLowStock = item.stock > 0 && item.stock <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                        {item.sku}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        {item.category?.name || "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        {item.brand?.name || "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300 text-right">
                        Rp {Number(item.costPrice).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold
                          ${isOutOfStock ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' 
                          : isLowStock ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}
                        `}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-800 dark:text-gray-200 font-bold text-right">
                        Rp {assetValue.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    Produk tidak ditemukan untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Footer / Summary */}
            {data.length > 0 && !isLoading && (
              <tfoot className="bg-gray-50 dark:bg-gray-800/80 font-bold">
                <tr>
                  <td colSpan={6} className="px-5 py-4 text-right text-gray-800 dark:text-white">
                    TOTAL ESTIMASI NILAI ASET:
                  </td>
                  <td className="px-5 py-4 text-right text-brand-600 dark:text-brand-400 text-base">
                    Rp {data.reduce((acc, curr) => acc + (Number(curr.costPrice) * Number(curr.stock)), 0).toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
