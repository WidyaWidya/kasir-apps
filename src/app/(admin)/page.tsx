import type { Metadata } from "next";
import React from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getDashboardMetrics } from "@/actions/dashboard";

export const metadata: Metadata = {
  title: "Dashboard Kasir | Ringkasan Eksekutif",
  description: "Panel kendali utama untuk memantau performa toko",
};

export default async function Ecommerce() {
  const response = await getDashboardMetrics();
  
  if (!response.success || !response.data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-gray-500">Gagal memuat data dashboard. Silakan muat ulang halaman.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Dashboard Eksekutif
        </h2>
        <div className="text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <DashboardClient data={response.data} />
    </div>
  );
}
