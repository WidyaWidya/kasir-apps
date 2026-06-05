"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

export interface GetCategoriesOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeInactive?: boolean;
}

export interface CategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
}

export async function getCategories(options?: GetCategoriesOptions) {
  try {
    const {
      search,
      sortBy = "name",
      sortOrder = "asc",
      includeInactive = false,
    } = options || {};

    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    return { success: true, data: categories };
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: "Gagal mengambil data kategori" };
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) return { success: false, error: "Kategori tidak ditemukan" };
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Failed to fetch category:", error);
    return { success: false, error: "Gagal mengambil data kategori" };
  }
}

export async function createCategory(data: CategoryData) {
  try {
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      return { success: false, error: "Nama kategori sudah digunakan" };
    }

    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
    await logActivity("CREATE_CATEGORY", `Menambahkan kategori baru: ${data.name}`);
    revalidatePath("/kategori");
    return { success: true, data: newCategory };
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Gagal membuat kategori" };
  }
}

export async function updateCategory(id: string, data: CategoryData) {
  try {
    const existing = await prisma.category.findFirst({
      where: { name: data.name, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Nama kategori sudah digunakan" };
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
    });
    await logActivity("UPDATE_CATEGORY", `Mengubah data kategori: ${data.name}`);
    revalidatePath("/kategori");
    return { success: true, data: updatedCategory };
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Gagal mengupdate kategori" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    await prisma.category.delete({ where: { id } });
    if (category) await logActivity("DELETE_CATEGORY", `Menghapus kategori: ${category.name}`);
    revalidatePath("/kategori");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    if (error.code === "P2003") {
      return {
        success: false,
        error: "Kategori tidak dapat dihapus karena masih digunakan produk",
      };
    }
    return { success: false, error: "Gagal menghapus kategori" };
  }
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  try {
    const updated = await prisma.category.update({ where: { id }, data: { isActive } });
    await logActivity("UPDATE_CATEGORY", `Mengubah status kategori ${updated.name} menjadi ${isActive ? 'Aktif' : 'Nonaktif'}`);
    revalidatePath("/kategori");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle category status:", error);
    return { success: false, error: "Gagal mengubah status kategori" };
  }
}
