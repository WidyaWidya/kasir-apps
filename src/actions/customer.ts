"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

export interface CustomerData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  isActive?: boolean;
}

export interface GetCustomersOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getCustomers(options?: GetCustomersOptions) {
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

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    return { success: true, data: customers };
  } catch (error: any) {
    console.error("Failed to fetch customers:", error);
    return { success: false, error: "Gagal mengambil data pelanggan" };
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return { success: false, error: "Pelanggan tidak ditemukan" };
    return { success: true, data: customer };
  } catch (error: any) {
    console.error("Failed to fetch customer:", error);
    return { success: false, error: "Gagal mengambil data pelanggan" };
  }
}

export async function createCustomer(data: CustomerData) {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
    await logActivity("CREATE_CUSTOMER", `Menambahkan pelanggan baru: ${data.name}`);
    revalidatePath("/pelanggan");
    return { success: true, data: newCustomer };
  } catch (error: any) {
    console.error("Failed to create customer:", error);
    return { success: false, error: "Gagal membuat pelanggan" };
  }
}

export async function updateCustomer(id: string, data: CustomerData) {
  try {
    const updatedCustomer = await prisma.customer.update({
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
    await logActivity("UPDATE_CUSTOMER", `Mengubah data pelanggan: ${data.name}`);
    revalidatePath("/pelanggan");
    return { success: true, data: updatedCustomer };
  } catch (error: any) {
    console.error("Failed to update customer:", error);
    return { success: false, error: "Gagal mengupdate pelanggan" };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const customer = await prisma.customer.findUnique({ where: { id } });
    await prisma.customer.delete({ where: { id } });
    if (customer) await logActivity("DELETE_CUSTOMER", `Menghapus pelanggan: ${customer.name}`);
    revalidatePath("/pelanggan");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete customer:", error);
    if (error.code === "P2003") {
      return {
        success: false,
        error: "Pelanggan tidak dapat dihapus karena masih digunakan oleh transaksi",
      };
    }
    return { success: false, error: "Gagal menghapus pelanggan" };
  }
}
