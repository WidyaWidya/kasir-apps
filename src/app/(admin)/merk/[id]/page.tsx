import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import BrandForm from "@/components/brand/BrandForm";
import { getBrandById } from "@/actions/brand";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Merk | Kasir App",
  description: "Edit data master merk produk",
};

export default async function EditMerkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getBrandById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const brand = res.data;

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Merk" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informasi Merk
        </h3>
        <BrandForm brand={brand} />
      </div>
    </div>
  );
}
