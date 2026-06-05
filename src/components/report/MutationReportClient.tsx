"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getMutationReport, MutationReportFilter } from "@/actions/report-mutation";
import ProductSearchModal from "@/components/purchase/ProductSearchModal";

export default function MutationReportClient() {
  const [filters, setFilters] = useState<MutationReportFilter>({
    startDate: "",
    endDate: "",
    productId: "",
  });

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Product Selection Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    if (!filters.startDate && !filters.endDate) {
      setData([]);
      return;
    }

    setIsLoading(true);
    const res = await getMutationReport(filters);
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setData([]);
    }
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ startDate: "", endDate: "", productId: "" });
    setSelectedProduct(null);
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setFilters(prev => ({ ...prev, productId: product.id }));
    setIsModalOpen(false);
  };

  const downloadCSV = () => {
    if (data.length === 0) return;

    const headers = [
      "SKU",
      "Nama Produk",
      "Stok Awal",
      "Pembelian (Masuk)",
      "Penjualan (Keluar)",
      "Opname / Koreksi",
      "Stok Akhir"
    ];

    const rows = data.map((item) => [
      item.sku,
      item.name,
      item.beginningStock,
      item.purchaseIn > 0 ? `+${item.purchaseIn}` : item.purchaseIn,
      item.saleOut,
      item.opnameAdj > 0 ? `+${item.opnameAdj}` : item.opnameAdj,
      item.endingStock
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Ikhtisar_Mutasi_Stok_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <ProductSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelectProduct} 
      />

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter Pencarian</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter Produk (Opsional)</label>
            {selectedProduct ? (
              <div className="flex items-center justify-between bg-brand-50 border border-brand-200 dark:bg-brand-900/20 dark:border-brand-800 rounded-lg px-3 py-1.5 h-[38px]">
                <span className="text-sm font-medium text-gray-800 dark:text-white truncate" title={selectedProduct.name}>
                  {selectedProduct.name}
                </span>
                <button type="button" onClick={() => setIsModalOpen(true)} className="text-xs text-brand-600 hover:underline px-1">Ganti</button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full h-[38px] text-left rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Pilih Produk...
              </button>
            )}
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
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center">STOK AWAL</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center border-l border-gray-200 dark:border-gray-700">PEMBELIAN<br/><span className="text-xs font-normal text-gray-500">(Masuk)</span></th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center border-l border-gray-200 dark:border-gray-700">PENJUALAN<br/><span className="text-xs font-normal text-gray-500">(Keluar)</span></th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center border-l border-gray-200 dark:border-gray-700">OPNAME<br/><span className="text-xs font-normal text-gray-500">(Koreksi)</span></th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center border-l border-gray-200 dark:border-gray-700">STOK AKHIR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      Mengkalkulasi ikhtisar stok...
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {item.sku}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">
                      {item.name}
                    </td>
                    <td className="px-5 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                      {item.beginningStock}
                    </td>
                    <td className="px-5 py-3 text-center border-l border-gray-100 dark:border-gray-800">
                      {item.purchaseIn > 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-bold">+{item.purchaseIn}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center border-l border-gray-100 dark:border-gray-800">
                      {item.saleOut < 0 ? (
                        <span className="text-red-600 dark:text-red-400 font-bold">{item.saleOut}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center border-l border-gray-100 dark:border-gray-800">
                      {item.opnameAdj > 0 ? (
                        <span className="text-blue-600 dark:text-blue-400 font-bold">+{item.opnameAdj}</span>
                      ) : item.opnameAdj < 0 ? (
                        <span className="text-orange-600 dark:text-orange-400 font-bold">{item.opnameAdj}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center border-l border-gray-100 dark:border-gray-800 font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/30">
                      {item.endingStock}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    {(!filters.startDate && !filters.endDate) 
                      ? "Silakan pilih rentang tanggal untuk memuat ikhtisar mutasi stok."
                      : "Tidak ada data produk/mutasi untuk filter ini."}
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
