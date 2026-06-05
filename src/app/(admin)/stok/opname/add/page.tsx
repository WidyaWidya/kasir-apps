import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import OpnameForm from "@/components/opname/OpnameForm";

export const metadata: Metadata = {
  title: "Mulai Penyesuaian Stok | Kasir App",
  description: "Form untuk melakukan Stock Opname",
};

export default function AddOpnamePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="PENYESUAIAN STOK FISIK" />
      <OpnameForm />
    </div>
  );
}
