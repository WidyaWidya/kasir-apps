import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SalesReportClient from "@/components/report/SalesReportClient";

export const metadata: Metadata = {
  title: "Laporan Penjualan | Kasir App",
  description: "Laporan transaksi penjualan",
};

export default async function SalesReportPage() {
  // Fetch master data for filters
  const [cashiers, customers, paymentMethods, products] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, username: true, fullName: true, role: true },
      orderBy: { fullName: 'asc' }
    }),
    prisma.customer.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.paymentMethod.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, sku: true },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="LAPORAN PENJUALAN" />
      <SalesReportClient 
        cashiers={cashiers} 
        customers={customers} 
        paymentMethods={paymentMethods} 
        products={products}
      />
    </div>
  );
}
