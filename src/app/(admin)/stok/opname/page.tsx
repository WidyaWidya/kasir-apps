import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getOpnameHistory } from "@/actions/opname";
import OpnameTable from "@/components/opname/OpnameTable";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Penyesuaian Stok (Opname) | Kasir App",
  description: "Riwayat Penyesuaian Stok Gudang",
};

export default async function OpnamePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const awaitedSearchParams = await searchParams;
  const search = awaitedSearchParams?.q || "";

  const response = await getOpnameHistory({ search });
  const history = response.success && response.data ? response.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="RIWAYAT OPNAME STOK" />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Cari nama produk..."
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button type="submit" className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
              Cari
            </button>
            {search && (
              <Link href="/stok/opname" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors">
                Reset
              </Link>
            )}
          </form>

          <Link href="/stok/opname/add" className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Mulai Penyesuaian Stok
          </Link>
        </div>

        <OpnameTable history={history as any} />
      </div>
    </div>
  );
}
