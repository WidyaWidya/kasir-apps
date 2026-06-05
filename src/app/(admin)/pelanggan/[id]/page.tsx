import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CustomerForm from "@/components/customer/CustomerForm";
import { getCustomerById } from "@/actions/customer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Pelanggan | Kasir App",
  description: "Edit data master pelanggan",
};

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getCustomerById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const customer = res.data;
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Pelanggan" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Pelanggan</h3>
        <CustomerForm customer={customer} />
      </div>
    </div>
  );
}
