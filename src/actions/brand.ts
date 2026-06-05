"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

export interface GetBrandsOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BrandData {
  name: string;
  description?: string;
}

export async function getBrands(options?: GetBrandsOptions) {
  try {
    const { search, sortBy = "name", sortOrder = "asc" } = options || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const brands = await prisma.brand.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    return { success: true, data: brands };
  } catch (error: any) {
    console.error("Failed to fetch brands:", error);
    return { success: false, error: "Gagal mengambil data merk" };
  }
}

export async function getBrandById(id: string) {
  try {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) return { success: false, error: "Merk tidak ditemukan" };
    return { success: true, data: brand };
  } catch (error: any) {
    console.error("Failed to fetch brand:", error);
    return { success: false, error: "Gagal mengambil data merk" };
  }
}

export async function createBrand(data: BrandData) {
  try {
    const existing = await prisma.brand.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      return { success: false, error: "Nama merk sudah digunakan" };
    }

    const newBrand = await prisma.brand.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
    await logActivity("CREATE_BRAND", `Menambahkan merk baru: ${data.name}`);
    revalidatePath("/merk");
    return { success: true, data: newBrand };
  } catch (error: any) {
    console.error("Failed to create brand:", error);
    return { success: false, error: "Gagal membuat merk" };
  }
}

export async function updateBrand(id: string, data: BrandData) {
  try {
    const existing = await prisma.brand.findFirst({
      where: { name: data.name, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Nama merk sudah digunakan" };
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    await logActivity("UPDATE_BRAND", `Mengubah data merk: ${data.name}`);
    revalidatePath("/merk");
    return { success: true, data: updatedBrand };
  } catch (error: any) {
    console.error("Failed to update brand:", error);
    return { success: false, error: "Gagal mengupdate merk" };
  }
}

export async function deleteBrand(id: string) {
  try {
    const brand = await prisma.brand.findUnique({ where: { id } });
    await prisma.brand.delete({ where: { id } });
    if (brand) await logActivity("DELETE_BRAND", `Menghapus merk: ${brand.name}`);
    revalidatePath("/merk");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete brand:", error);
    if (error.code === "P2003") {
      return {
        success: false,
        error: "Merk tidak dapat dihapus karena masih digunakan produk",
      };
    }
    return { success: false, error: "Gagal menghapus merk" };
  }
}
