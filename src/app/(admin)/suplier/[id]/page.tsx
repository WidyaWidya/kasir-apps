import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import SupplierForm from "@/components/supplier/SupplierForm";
import { getSupplierById } from "@/actions/supplier";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Supplier | Kasir App",
  description: "Edit data master suplier",
};

export default async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getSupplierById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const supplier = res.data;
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Suplier" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Supplier</h3>
        <SupplierForm supplier={supplier} />
      </div>
    </div>
  );
}
