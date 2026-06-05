"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getProfitReport, ProfitReportFilter } from "@/actions/report-profit";

export default function ProfitReportClient() {
  const [filters, setFilters] = useState<ProfitReportFilter>({
    startDate: "",
    endDate: "",
  });

  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalCOGS: 0, totalGrossProfit: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!filters.startDate && !filters.endDate) {
      setData([]);
      setSummary({ totalRevenue: 0, totalCOGS: 0, totalGrossProfit: 0 });
      return;
    }

    setIsLoading(true);
    const res = await getProfitReport(filters);
    if (res.success && res.data) {
      setData(res.data);
      if (res.summary) {
        setSummary(res.summary);
      }
    } else {
      setData([]);
      setSummary({ totalRevenue: 0, totalCOGS: 0, totalGrossProfit: 0 });
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
    setFilters({ startDate: "", endDate: "" });
  };

  const downloadCSV = () => {
    if (data.length === 0) return;

    const headers = [
      "Tanggal",
      "No. Invoice",
      "Pelanggan",
      "Total Pendapatan Bersih",
      "Total Harga Pokok (Modal)",
      "Laba Kotor (Profit)"
    ];

    const rows = data.map((item) => [
      new Date(item.createdAt).toLocaleString("id-ID"),
      item.invoiceNumber,
      item.customerName,
      item.revenue,
      item.cogs,
      item.profit
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Laba_Rugi_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pilih Periode</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-w-2xl">
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

      {/* Summary Cards */}
      {data.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">TOTAL PENDAPATAN BERSIH</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              Rp {summary.totalRevenue.toLocaleString("id-ID")}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">TOTAL HPP (MODAL BARANG)</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              Rp {summary.totalCOGS.toLocaleString("id-ID")}
            </div>
          </div>

          <div className={`rounded-xl p-6 shadow-sm flex flex-col justify-center text-white ${summary.totalGrossProfit >= 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
            <div className="text-sm font-medium text-green-100 mb-1">TOTAL LABA KOTOR (PROFIT)</div>
            <div className="text-4xl font-extrabold drop-shadow-md">
              {summary.totalGrossProfit < 0 ? "-" : ""}Rp {Math.abs(summary.totalGrossProfit).toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
          <table className="min-w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">TANGGAL</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">NO INVOICE</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">PENDAPATAN (Rp)</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">MODAL / HPP (Rp)</th>
                <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">PROFIT (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      Memuat kalkulasi...
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
                      <div className="text-xs text-gray-500 font-normal mt-0.5">{item.customerName}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300 text-right">
                      {item.revenue.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300 text-right">
                      {item.cogs.toLocaleString("id-ID")}
                    </td>
                    <td className={`px-5 py-3 font-bold text-right ${item.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.profit >= 0 ? '+' : ''}{item.profit.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    {(!filters.startDate && !filters.endDate) 
                      ? "Silakan pilih rentang tanggal terlebih dahulu."
                      : "Tidak ada transaksi lunas di periode ini."}
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
