import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getSetting } from "@/actions/setting";
import SettingForm from "@/components/setting/SettingForm";

export const metadata: Metadata = {
  title: "Pengaturan | Kasir App",
  description: "Pengaturan aplikasi kasir",
};

export default async function PengaturanPage() {
  const res = await getSetting();
  const setting = res.success && res.data ? res.data : null;

  return (
    <div>
      <PageBreadcrumb pageTitle="PENGATURAN" />
      <SettingForm setting={setting} />
    </div>
  );
}
