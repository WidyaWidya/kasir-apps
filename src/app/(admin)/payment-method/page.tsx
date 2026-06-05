import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getPaymentMethods } from "@/actions/paymentMethod";
import PaymentMethodTable from "@/components/paymentMethod/PaymentMethodTable";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Master Metode Pembayaran | Kasir App",
  description: "Daftar master metode pembayaran",
};

export default async function PaymentMethodPage({ searchParams }: { searchParams: { q?: string; sort?: string } }) {
  const search = searchParams?.q || "";
  const sort = searchParams?.sort || "name";

  const response = await getPaymentMethods({ search, sortBy: sort });
  const paymentMethods = response.success && response.data ? response.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="MASTER METODE PEMBAYARAN" />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Cari metode pembayaran..."
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {sort && <input type="hidden" name="sort" value={sort} />}
            <button type="submit" className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
              Cari
            </button>
            {search && (
              <Link href="/payment-method" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors">
                Reset
              </Link>
            )}
          </form>

          <div className="flex items-center gap-2">
            <form className="flex items-center gap-2">
              <select
                name="sort"
                defaultValue={sort}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="name">Nama (A-Z)</option>
                <option value="createdAt">Terbaru</option>
              </select>
              {search && <input type="hidden" name="q" value={search} />}
              <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
                Urutkan
              </button>
            </form>

            <Link href="/payment-method/add" className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Baru
            </Link>
          </div>
        </div>

        <PaymentMethodTable paymentMethods={paymentMethods as any} />
      </div>
    </div>
  );
}
