import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import UserForm from "@/components/user/UserForm";

export const metadata: Metadata = {
  title: "Tambah Pengguna | Kasir App",
  description: "Tambah data master pengguna baru",
};

export default function AddUserPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Pengguna" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Pengguna Baru</h3>
        <UserForm />
      </div>
    </div>
  );
}
