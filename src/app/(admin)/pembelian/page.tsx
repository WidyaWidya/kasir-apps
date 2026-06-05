import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getPurchases } from "@/actions/purchase";
import PurchaseTable from "@/components/purchase/PurchaseTable";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transaksi Pembelian | Kasir App",
  description: "Riwayat Transaksi Pembelian",
};

export default async function PurchasePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const awaitedSearchParams = await searchParams;
  const search = awaitedSearchParams?.q || "";

  const response = await getPurchases({ search });
  const purchases = response.success && response.data ? response.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="TRANSAKSI PEMBELIAN" />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Cari No Invoice..."
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button type="submit" className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
              Cari
            </button>
            {search && (
              <Link href="/pembelian" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors">
                Reset
              </Link>
            )}
          </form>

          <Link href="/pembelian/add" className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Pembelian
          </Link>
        </div>

        <PurchaseTable purchases={purchases as any} />
      </div>
    </div>
  );
}
