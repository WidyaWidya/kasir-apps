import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import PurchaseReportClient from "@/components/report/PurchaseReportClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Laporan Pembelian | Kasir App",
  description: "Laporan transaksi pembelian barang",
};

export default async function PurchaseReportPage() {
  // Fetch master data for filters
  const [staffs, suppliers, products] = await Promise.all([
    prisma.user.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true
      },
      orderBy: {
        fullName: "asc"
      }
    }),
    prisma.supplier.findMany({
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
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true
      },
      orderBy: {
        name: "asc"
      }
    })
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="LAPORAN PEMBELIAN" />
      <PurchaseReportClient 
        staffs={staffs}
        suppliers={suppliers}
        products={products}
      />
    </div>
  );
}
