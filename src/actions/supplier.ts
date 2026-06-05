"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

export interface SupplierData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  isActive?: boolean;
}

export interface GetSuppliersOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getSuppliers(options?: GetSuppliersOptions) {
  try {
    const { search, sortBy = "name", sortOrder = "asc" } = options || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    return { success: true, data: suppliers };
  } catch (error: any) {
    console.error("Failed to fetch suppliers:", error);
    return { success: false, error: "Gagal mengambil data supplier" };
  }
}

export async function getSupplierById(id: string) {
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) return { success: false, error: "Supplier tidak ditemukan" };
    return { success: true, data: supplier };
  } catch (error: any) {
    console.error("Failed to fetch supplier:", error);
    return { success: false, error: "Gagal mengambil data supplier" };
  }
}

export async function createSupplier(data: SupplierData) {
  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
    await logActivity("CREATE_SUPPLIER", `Menambahkan supplier baru: ${data.name}`);
    revalidatePath("/suplier");
    return { success: true, data: newSupplier };
  } catch (error: any) {
    console.error("Failed to create supplier:", error);
    return { success: false, error: "Gagal membuat supplier" };
  }
}

export async function updateSupplier(id: string, data: SupplierData) {
  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
    await logActivity("UPDATE_SUPPLIER", `Mengubah data supplier: ${data.name}`);
    revalidatePath("/suplier");
    return { success: true, data: updatedSupplier };
  } catch (error: any) {
    console.error("Failed to update supplier:", error);
    return { success: false, error: "Gagal mengupdate supplier" };
  }
}

export async function deleteSupplier(id: string) {
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    await prisma.supplier.delete({ where: { id } });
    if (supplier) await logActivity("DELETE_SUPPLIER", `Menghapus supplier: ${supplier.name}`);
    revalidatePath("/suplier");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete supplier:", error);
    if (error.code === "P2003") {
      return {
        success: false,
        error: "Supplier tidak dapat dihapus karena masih digunakan oleh produk atau pembelian",
      };
    }
    return { success: false, error: "Gagal menghapus supplier" };
  }
}
