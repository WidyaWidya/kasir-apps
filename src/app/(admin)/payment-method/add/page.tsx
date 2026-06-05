import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import PaymentMethodForm from "@/components/paymentMethod/PaymentMethodForm";

export const metadata: Metadata = {
  title: "Tambah Metode Pembayaran | Kasir App",
  description: "Tambah master metode pembayaran baru",
};

export default function AddPaymentMethodPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Metode Pembayaran" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Metode Pembayaran</h3>
        <PaymentMethodForm />
      </div>
    </div>
  );
}
