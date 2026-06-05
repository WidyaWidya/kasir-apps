import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import PaymentMethodForm from "@/components/paymentMethod/PaymentMethodForm";
import { getPaymentMethodById } from "@/actions/paymentMethod";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Metode Pembayaran | Kasir App",
  description: "Edit data master metode pembayaran",
};

export default async function EditPaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getPaymentMethodById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const paymentMethod = res.data;
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Metode Pembayaran" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Metode Pembayaran</h3>
        <PaymentMethodForm paymentMethod={paymentMethod} />
      </div>
    </div>
  );
}
