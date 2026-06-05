"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentType } from "@prisma/client";

export interface PaymentMethodData {
  name: string;
  isActive?: boolean;
}

export interface GetPaymentMethodsOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getPaymentMethods(options?: GetPaymentMethodsOptions) {
  try {
    const { search, sortBy = "name", sortOrder = "asc" } = options || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });
    return { success: true, data: paymentMethods };
  } catch (error: any) {
    console.error("Failed to fetch payment methods:", error);
    return { success: false, error: "Gagal mengambil data metode pembayaran" };
  }
}

export async function getPaymentMethodById(id: string) {
  try {
    const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id } });
    if (!paymentMethod) return { success: false, error: "Metode pembayaran tidak ditemukan" };
    return { success: true, data: paymentMethod };
  } catch (error: any) {
    console.error("Failed to fetch payment method:", error);
    return { success: false, error: "Gagal mengambil data metode pembayaran" };
  }
}

export async function createPaymentMethod(data: PaymentMethodData) {
  try {
    const newPaymentMethod = await prisma.paymentMethod.create({
      data: {
        name: data.name,
        type: PaymentType.CASH,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath("/payment-method");
    return { success: true, data: newPaymentMethod };
  } catch (error: any) {
    console.error("Failed to create payment method:", error);
    return { success: false, error: "Gagal membuat metode pembayaran" };
  }
}

export async function updatePaymentMethod(id: string, data: PaymentMethodData) {
  try {
    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: {
        name: data.name,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath("/payment-method");
    return { success: true, data: updatedPaymentMethod };
  } catch (error: any) {
    console.error("Failed to update payment method:", error);
    return { success: false, error: "Gagal mengupdate metode pembayaran" };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    await prisma.paymentMethod.delete({ where: { id } });
    revalidatePath("/payment-method");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete payment method:", error);
    if (error.code === "P2003") {
      return {
        success: false,
        error: "Metode pembayaran tidak dapat dihapus karena masih digunakan oleh transaksi",
      };
    }
    return { success: false, error: "Gagal menghapus metode pembayaran" };
  }
}

export async function togglePaymentMethodStatus(id: string, isActive: boolean) {
  try {
    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/payment-method");
    return { success: true, data: updatedPaymentMethod };
  } catch (error: any) {
    console.error("Failed to toggle payment method status:", error);
    return { success: false, error: "Gagal mengubah status metode pembayaran" };
  }
}
