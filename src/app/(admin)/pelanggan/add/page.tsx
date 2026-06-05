import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CustomerForm from "@/components/customer/CustomerForm";

export const metadata: Metadata = {
  title: "Tambah Pelanggan | Kasir App",
  description: "Tambah master pelanggan baru",
};

export default function AddCustomerPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Pelanggan" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Pelanggan</h3>
        <CustomerForm />
      </div>
    </div>
  );
}
