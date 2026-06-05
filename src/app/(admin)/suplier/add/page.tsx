import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import SupplierForm from "@/components/supplier/SupplierForm";

export const metadata: Metadata = {
  title: "Tambah Supplier | Kasir App",
  description: "Tambah master suplier baru",
};

export default function AddSupplierPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Supplier" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Supplier</h3>
        <SupplierForm />
      </div>
    </div>
  );
}
