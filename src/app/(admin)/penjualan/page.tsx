import React from "react";
import { Metadata } from "next";
import { getPOSInitialData } from "@/actions/pos";
import POSClient from "@/components/pos/POSClient";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Penjualan (POS) | Kasir App",
  description: "Point of Sale (POS) Halaman Penjualan",
};

export default async function PenjualanPage() {
  const session = await getServerSession(authConfig);
  const response = await getPOSInitialData();
  
  // We provide fallback empty arrays if fetch fails
  const initialData = response.success && response.data ? response.data : {
    customers: [],
    salesUsers: [],
    paymentMethods: [],
    settings: null
  };

  const currentUser = {
    id: session?.user?.id || "",
    name: session?.user?.fullName || session?.user?.name || "Kasir"
  };

  return (
    <div className="h-[calc(100vh-64px)] -m-4 md:-m-6 lg:-m-8 bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
      <POSClient initialData={initialData} currentUser={currentUser} />
    </div>
  );
}
