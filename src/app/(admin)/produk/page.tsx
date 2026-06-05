import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getProducts } from "@/actions/product";
import ProductTable from "@/components/product/ProductTable";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Master Produk | Kasir App",
  description: "Daftar master produk",
};

export default async function ProductPage({
  searchParams,
}: {
  // 1. Wrap searchParams in a Promise for Next.js 15+ compatibility
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  // 2. Await the promise to unwrap its properties safely
  const resolvedSearchParams = await searchParams;
  
  const search = resolvedSearchParams?.q || "";
  const sort = resolvedSearchParams?.sort || "name";

  const response = await getProducts({ search, sortBy: sort });
  const products = response.success && response.data ? response.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="DAFTAR PRODUK" />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Cari produk..."
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {sort && <input type="hidden" name="sort" value={sort} />}
            <button
              type="submit"
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Cari
            </button>
            {search && (
              <Link
                href="/produk"
                className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
              >
                Refresh
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
                <option value="name">Nama Produk</option>
                <option value="costPrice">Harga Modal</option>
                <option value="sellPrice">Harga Jual</option>
                <option value="stock">Stok</option>
              </select>
              {search && <input type="hidden" name="q" value={search} />}
              <button
                type="submit"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                Urutkan
              </button>
            </form>

            <Link
              href="/produk/add"
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              Tambah Baru
            </Link>
          </div>
        </div>
        
        <ProductTable products={products as any} />
      </div>
    </div>
  );
}