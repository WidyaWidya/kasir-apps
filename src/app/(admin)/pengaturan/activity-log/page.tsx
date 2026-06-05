import type { Metadata } from "next";
import React from "react";
import ActivityLogClient from "@/components/setting/ActivityLogClient";

export const metadata: Metadata = {
  title: "Activity Log | Kasir App",
  description: "Catatan rekam jejak aktivitas pengguna sistem",
};

export default function ActivityLogPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Catatan Aktivitas Sistem (Audit Trail)
        </h2>
      </div>
      
      <p className="text-gray-500 mb-6 max-w-3xl">
        Halaman ini menampilkan seluruh rekam jejak aktivitas operasional di dalam sistem. Data yang terekam bersifat permanen dan tidak dapat dihapus untuk menjaga keamanan dan akuntabilitas bisnis Anda.
      </p>

      <ActivityLogClient />
    </div>
  );
}
