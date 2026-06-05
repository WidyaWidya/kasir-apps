"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrand, updateBrand } from "@/actions/brand";
import type { BrandData } from "@/actions/brand";

interface BrandFormProps {
  brand?: {
    id: string;
    name: string;
    description?: string | null;
  };
}

export default function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(brand?.name || "");
  const [description, setDescription] = useState(brand?.description || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama merk wajib diisi");
      return;
    }
    setLoading(true);
    setError("");

    const data: BrandData = {
      name: name.trim(),
      description: description.trim() || undefined,
    };

    let res;
    if (brand) {
      res = await updateBrand(brand.id, data);
    } else {
      res = await createBrand(data);
    }

    setLoading(false);

    if (res.success) {
      router.push("/merk");
      router.refresh();
    } else {
      setError(res.error || "Terjadi kesalahan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Nama Merk */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nama Merk <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Contoh: Samsung, Nike, Indomie..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Deskripsi singkat tentang merk (opsional)..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-white/[0.05]">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03] transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors"
        >
          {loading ? "Menyimpan..." : brand ? "Simpan Perubahan" : "Buat Merk"}
        </button>
      </div>
    </form>
  );
}
