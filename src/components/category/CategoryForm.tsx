"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/actions/category";
import type { CategoryData } from "@/actions/category";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
  };
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [isActive, setIsActive] = useState(
    category?.isActive !== undefined ? category.isActive : true
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama kategori wajib diisi");
      return;
    }
    setLoading(true);
    setError("");

    const data: CategoryData = {
      name: name.trim(),
      description: description.trim() || undefined,
      isActive,
    };

    let res;
    if (category) {
      res = await updateCategory(category.id, data);
    } else {
      res = await createCategory(data);
    }

    setLoading(false);

    if (res.success) {
      router.push("/kategori");
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
        {/* Nama Kategori */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nama Kategori <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Contoh: Makanan, Minuman, Elektronik..."
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
            placeholder="Deskripsi singkat kategori (opsional)..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 resize-none"
          />
        </div>

        {/* Status Aktif */}
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Status Aktif
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kategori yang tidak aktif tidak akan tampil di pilihan produk
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
              isActive ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
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
          {loading ? "Menyimpan..." : category ? "Simpan Perubahan" : "Buat Kategori"}
        </button>
      </div>
    </form>
  );
}
