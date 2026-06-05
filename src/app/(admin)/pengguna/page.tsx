import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getUsers } from "@/actions/user";
import UserTable from "@/components/user/UserTable";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Master Pengguna | Kasir App",
  description: "Daftar master pengguna",
};

export default async function UserPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const awaitedSearchParams = await searchParams;
  const search = awaitedSearchParams?.q || "";
  const sort = awaitedSearchParams?.sort || "fullName";

  const response = await getUsers({ search, sortBy: sort });
  const users = response.success && response.data ? response.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="MASTER PENGGUNA" />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Cari pengguna..."
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {sort && <input type="hidden" name="sort" value={sort} />}
            <button type="submit" className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors">
              Cari
            </button>
            {search && (
              <Link href="/pengguna" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors">
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
                <option value="fullName">Nama (A-Z)</option>
                <option value="username">Username (A-Z)</option>
                <option value="createdAt">Terbaru</option>
              </select>
              {search && <input type="hidden" name="q" value={search} />}
              <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
                Urutkan
              </button>
            </form>

            <Link href="/pengguna/add" className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Baru
            </Link>
          </div>
        </div>

        <UserTable users={users as any} />
      </div>
    </div>
  );
}
