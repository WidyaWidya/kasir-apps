import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ProductForm from "@/components/product/ProductForm";
import { getProductById } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { getBrands } from "@/actions/brand";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Produk | Kasir App",
  description: "Edit data master produk",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [productRes, categoriesRes, brandsRes] = await Promise.all([
    getProductById(id),
    getCategories(),
    getBrands(),
  ]);

  if (!productRes.success || !productRes.data) {
    notFound();
  }

  const product = productRes.data;
  const categories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
  const brands = brandsRes.success && brandsRes.data ? brandsRes.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Produk" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informasi Produk
        </h3>
        <ProductForm product={product} categories={categories} brands={brands} />
      </div>
    </div>
  );
}
