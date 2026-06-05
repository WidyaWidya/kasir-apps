import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CategoryForm from "@/components/category/CategoryForm";

export const metadata: Metadata = {
  title: "Tambah Kategori | Kasir App",
  description: "Tambah master kategori produk baru",
};

export default function AddKategoriPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Kategori" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informasi Kategori
        </h3>
        <CategoryForm />
      </div>
    </div>
  );
}
