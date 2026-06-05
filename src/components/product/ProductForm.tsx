"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product";

export default function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: any;
  categories: any[];
  brands: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      sku: formData.get("sku") as string,
      name: formData.get("name") as string,
      categoryId: formData.get("categoryId") as string,
      brandId: formData.get("brandId") as string || undefined,
      trackStock: formData.get("trackStock") === "true",
      costPrice: Number(formData.get("costPrice")),
      sellPrice: Number(formData.get("sellPrice")),
      wholesalePrice: Number(formData.get("wholesalePrice")) || 0,
      promoPrice: Number(formData.get("promoPrice")) || 0,
      discount: Number(formData.get("discount")) || 0,
      stock: Number(formData.get("stock")) || 0,
    };

    let res;
    if (product) {
      res = await updateProduct(product.id, data);
    } else {
      res = await createProduct(data);
    }

    setLoading(false);

    if (res.success) {
      router.push("/produk");
      router.refresh();
    } else {
      setError(res.error || "Terjadi kesalahan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            SKU Produk <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sku"
            required
            defaultValue={product?.sku || `SKU-${Date.now()}`}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={product?.name || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Merk
          </label>
          <select
            name="brandId"
            defaultValue={product?.brandId || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          >
            <option value="">Pilih Merk</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Hitung Stok
          </label>
          <select
            name="trackStock"
            defaultValue={product ? (product.trackStock ? "true" : "false") : "true"}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          >
            <option value="true">YA</option>
            <option value="false">TIDAK</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Stok Awal
          </label>
          <input
            type="number"
            name="stock"
            defaultValue={product?.stock || 0}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Harga Modal <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="costPrice"
            required
            defaultValue={Number(product?.costPrice) || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Harga Jual Satuan <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="sellPrice"
            required
            defaultValue={Number(product?.sellPrice) || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Harga Jual Grosir
          </label>
          <input
            type="number"
            name="wholesalePrice"
            defaultValue={Number(product?.wholesalePrice) || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Harga Jual Promo
          </label>
          <input
            type="number"
            name="promoPrice"
            defaultValue={Number(product?.promoPrice) || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Diskon
          </label>
          <input
            type="number"
            name="discount"
            defaultValue={Number(product?.discount) || ""}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-white/[0.05]">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          {loading ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </div>
    </form>
  );
}
