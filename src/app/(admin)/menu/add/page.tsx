import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import MenuForm from "@/components/menu/MenuForm";

export const metadata: Metadata = {
  title: "Tambah Menu | Kasir App",
  description: "Tambah menu baru",
};

export default function AddMenuPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Menu Baru" />
      <div className="max-w-3xl mx-auto">
        <MenuForm key="add" />
      </div>
    </div>
  );
}
