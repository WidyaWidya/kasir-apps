import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ProductForm from "@/components/product/ProductForm";
import { getCategories } from "@/actions/category";
import { getBrands } from "@/actions/brand";

export const metadata: Metadata = {
  title: "Tambah Produk | Kasir App",
  description: "Tambah master produk baru",
};

export default async function AddProductPage() {
  const [categoriesRes, brandsRes] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  const categories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
  const brands = brandsRes.success && brandsRes.data ? brandsRes.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Produk" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informasi Produk
        </h3>
        <ProductForm categories={categories} brands={brands} />
      </div>
    </div>
  );
}
