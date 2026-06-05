import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import MenuForm from "@/components/menu/MenuForm";
import { getMenuById } from "@/actions/menu";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Menu | Kasir App",
  description: "Edit data menu",
};

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getMenuById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const menuData = {
    ...response.data,
    icon: response.data.icon || "",
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Menu" />
      <div className="max-w-3xl mx-auto">
        <MenuForm key={menuData.id} initialData={menuData} />
      </div>
    </div>
  );
}
