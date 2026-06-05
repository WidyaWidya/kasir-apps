import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getMenus } from "@/actions/menu";
import MenuTable from "@/components/menu/MenuTable";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manajemen Menu | Kasir App",
  description: "Daftar menu aplikasi",
};

export default async function MenuPage() {
  const response = await getMenus();
  const menus = response.success && response.data ? response.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Manajemen Menu" />
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link
            href="/menu/add"
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2.5C10.4142 2.5 10.75 2.83579 10.75 3.25V9.25H16.75C17.1642 9.25 17.5 9.58579 17.5 10C17.5 10.4142 17.1642 10.75 16.75 10.75H10.75V16.75C10.75 17.1642 10.4142 17.5 10 17.5C9.58579 17.5 9.25 17.1642 9.25 16.75V10.75H3.25C2.83579 10.75 2.5 10.4142 2.5 10C2.5 9.58579 2.83579 9.25 3.25 9.25H9.25V3.25C9.25 2.83579 9.58579 2.5 10 2.5Z"
                fill=""
              />
            </svg>
            Tambah Menu
          </Link>
        </div>
        
        <MenuTable menus={menus as any} />
      </div>
    </div>
  );
}
