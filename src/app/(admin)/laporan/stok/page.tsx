import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import StockReportClient from "@/components/report/StockReportClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Laporan Stok Gudang | Kasir App",
  description: "Laporan ketersediaan stok barang dan nilai aset",
};

export default async function StockReportPage() {
  // Fetch master data for filters
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: "asc"
      }
    }),
    prisma.brand.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: "asc"
      }
    })
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="LAPORAN STOK & ASET" />
      <StockReportClient 
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
