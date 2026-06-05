"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DashboardClientProps {
  data: {
    revenueToday: number;
    transactionsToday: number;
    profitThisMonth: number;
    lowStockProducts: any[];
    recentSales: any[];
    chart: {
      categories: string[];
      series: number[];
    };
  };
}

export default function DashboardClient({ data }: DashboardClientProps) {
  // Chart Configuration
  const chartOptions: ApexOptions = {
    colors: ["#3b82f6"], // Tailwind blue-500
    chart: {
      fontFamily: "inherit",
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.chart.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6b7280", // gray-500
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
        },
        formatter: (value) => {
          if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}K`;
          return `Rp ${value}`;
        },
      },
    },
    grid: {
      borderColor: "#f3f4f6", // gray-100
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
  };

  const chartSeries = [
    {
      name: "Pendapatan",
      data: data.chart.series,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Revenue Today */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendapatan Hari Ini</p>
            <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              Rp {data.revenueToday.toLocaleString("id-ID")}
            </h4>
          </div>
        </div>

        {/* Card 2: Profit This Month */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Laba Bulan Ini</p>
            <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              Rp {data.profitThisMonth.toLocaleString("id-ID")}
            </h4>
          </div>
        </div>

        {/* Card 3: Transactions Today */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaksi Hari Ini</p>
            <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {data.transactionsToday} <span className="text-sm font-normal text-gray-400">struk</span>
            </h4>
          </div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Peringatan Stok Habis</p>
            <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {data.lowStockProducts.length} <span className="text-sm font-normal text-gray-400">produk</span>
            </h4>
          </div>
        </div>
      </div>

      {/* 2. CHART & TABLES SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CHART: 30 Days Sales (Takes 2 columns on large screen) */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Tren Penjualan (30 Hari Terakhir)</h3>
            <p className="text-sm text-gray-500">Melihat pergerakan omset bisnis Anda selama sebulan terakhir.</p>
          </div>
          <div className="-ml-4 -mr-2">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* LOW STOCK TABLE (Takes 1 column) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Stok Menipis</h3>
              <p className="text-sm text-gray-500">Barang yang harus segera dibeli.</p>
            </div>
            <a href="/laporan/stok" className="text-sm font-medium text-brand-500 hover:text-brand-600">Lihat Semua</a>
          </div>

          <div className="mt-4 space-y-4">
            {data.lowStockProducts.length > 0 ? (
              data.lowStockProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">{p.name}</span>
                    <span className="text-xs text-gray-500">{p.sku}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-bold ${p.stock <= 0 ? 'text-red-500' : 'text-yellow-600'}`}>{p.stock}</span>
                    <span className="text-xs text-gray-400">Min: {p.minStock}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-green-500 mb-2">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Semua stok barang dalam kondisi aman!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Transaksi Terakhir (Hari Ini)</h3>
          <a href="/penjualan" className="text-sm font-medium text-brand-500 hover:text-brand-600">Buka Kasir</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">Tanggal & Waktu</th>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">No. Invoice</th>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">Pelanggan</th>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90 text-right">Total Penjualan</th>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.recentSales.length > 0 ? (
                data.recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(sale.createdAt).toLocaleString("id-ID", {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                      Rp {sale.grandTotal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-500/20 dark:text-green-400">
                        LUNAS
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Belum ada transaksi hari ini.
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
