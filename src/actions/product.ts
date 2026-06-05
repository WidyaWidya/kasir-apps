"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

export interface GetProductsOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Helper function to safely convert Prisma Decimals to JavaScript Numbers
function serializeProduct(product: any) {
  if (!product) return null;
  return {
    ...product,
    costPrice: product.costPrice ? Number(product.costPrice) : 0,
    sellPrice: product.sellPrice ? Number(product.sellPrice) : 0,
    wholesalePrice: product.wholesalePrice ? Number(product.wholesalePrice) : 0,
    promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
    // Add the discount field serialization here:
    discount: product.discount ? Number(product.discount) : 0, 
  };
}

export async function getProducts(options?: GetProductsOptions) {
  try {
    const { search, sortBy = "name", sortOrder = "asc" } = options || {};

    let where = {};
    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
      },
      orderBy: { [sortBy]: sortOrder },
    });

    // Map over array to serialize each product
    const serializedProducts = products.map(serializeProduct);

    return { success: true, data: serializedProducts };
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return { success: false, error: "Gagal mengambil data produk" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });
    if (!product) return { success: false, error: "Produk tidak ditemukan" };
    
    return { success: true, data: serializeProduct(product) };
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    return { success: false, error: "Gagal mengambil data produk" };
  }
}

export async function createProduct(data: any) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        ...data,
      },
    });
    await logActivity("CREATE_PRODUCT", `Menambahkan produk baru: ${newProduct.name}`);
    revalidatePath("/produk");
    return { success: true, data: serializeProduct(newProduct) };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Gagal membuat produk" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });
    await logActivity("UPDATE_PRODUCT", `Mengubah data produk: ${updatedProduct.name}`);
    revalidatePath("/produk");
    return { success: true, data: serializeProduct(updatedProduct) };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Gagal mengupdate produk" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    await prisma.product.delete({
      where: { id },
    });
    if (product) await logActivity("DELETE_PRODUCT", `Menghapus produk: ${product.name}`);
    revalidatePath("/produk");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Gagal menghapus produk" };
  }
}