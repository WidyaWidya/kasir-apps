import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import UserForm from "@/components/user/UserForm";
import { getUserById } from "@/actions/user";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Pengguna | Kasir App",
  description: "Edit data master pengguna",
};

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getUserById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const user = res.data;
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Pengguna" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Informasi Pengguna</h3>
        <UserForm user={user} />
      </div>
    </div>
  );
}
