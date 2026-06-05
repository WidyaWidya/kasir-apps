import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import PurchaseForm from "@/components/purchase/PurchaseForm";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tambah Pembelian | Kasir App",
  description: "Buat transaksi pembelian baru",
};

export default async function AddPurchasePage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.username) {
    redirect("/signin");
  }

  // Fallback if session is somehow not containing full user DB id, we fetch it
  const dbUser = await prisma.user.findUnique({
    where: { username: session.user.username },
    select: { id: true, fullName: true, role: true }
  });

  if (!dbUser) {
    redirect("/signin");
  }

  // Fetch active suppliers
  const suppliers = await prisma.supplier.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="TAMBAH PEMBELIAN" />
      <PurchaseForm 
        suppliers={suppliers} 
        currentUser={{ id: dbUser.id }} 
      />
    </div>
  );
}
