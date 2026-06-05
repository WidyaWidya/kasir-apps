import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import MutationReportClient from "@/components/report/MutationReportClient";

export const metadata: Metadata = {
  title: "Laporan Mutasi Stok | Kasir App",
  description: "Buku besar / kartu stok pergerakan barang",
};

export default function MutationReportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="LAPORAN MUTASI STOK" />
      <MutationReportClient />
    </div>
  );
}
