import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import BrandForm from "@/components/brand/BrandForm";

export const metadata: Metadata = {
  title: "Tambah Merk | Kasir App",
  description: "Tambah master merk produk baru",
};

export default function AddMerkPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Merk" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informasi Merk
        </h3>
        <BrandForm />
      </div>
    </div>
  );
}
