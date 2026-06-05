import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CategoryForm from "@/components/category/CategoryForm";
import { getCategoryById } from "@/actions/category";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Kategori | Kasir App",
  description: "Edit data master kategori produk",
};

export default async function EditKategoriPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getCategoryById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const category = res.data;

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Kategori" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informasi Kategori
        </h3>
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
