import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ProfitReportClient from "@/components/report/ProfitReportClient";

export const metadata: Metadata = {
  title: "Laporan Laba Rugi | Kasir App",
  description: "Laporan keuntungan dan kerugian (Profit and Loss)",
};

export default function ProfitReportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="LAPORAN LABA RUGI (PROFIT)" />
      <ProfitReportClient />
    </div>
  );
}
