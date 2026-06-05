"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

export interface GetOpnameFilters {
  search?: string;
}

export async function getOpnameHistory(filters?: GetOpnameFilters) {
  try {
    const where: any = {
      type: { in: ["STOCK_OPNAME", "ADJUSTMENT"] }
    };

    if (filters?.search) {
      where.product = {
        name: { contains: filters.search, mode: "insensitive" }
      };
    }

    const history = await prisma.stockHistory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { name: true, sku: true }
        }
      }
    });

    return { success: true, data: JSON.parse(JSON.stringify(history)) };
  } catch (error: any) {
    console.error("Failed to fetch opname history:", error);
    return { success: false, error: "Gagal mengambil riwayat penyesuaian stok" };
  }
}

export interface CreateOpnameData {
  productId: string;
  actualStock: number;
  reason: string;
}

export async function createOpname(data: CreateOpnameData) {
  try {
    if (data.actualStock < 0) {
      return { success: false, error: "Stok fisik tidak boleh bernilai negatif" };
    }
    if (!data.reason || data.reason.trim() === "") {
      return { success: false, error: "Alasan penyesuaian wajib diisi" };
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: data.productId }
      });

      if (!product) {
        throw new Error("Produk tidak ditemukan di database");
      }

      const diff = data.actualStock - product.stock;

      // Jika sama persis, mungkin tidak perlu diupdate, tapi kita tetap catat sebagai audit sukses
      
      // Update stok produk
      await tx.product.update({
        where: { id: product.id },
        data: { stock: data.actualStock }
      });

      // Insert riwayat
      const history = await tx.stockHistory.create({
        data: {
          productId: product.id,
          type: "STOCK_OPNAME",
          quantity: diff, // + atau -
          stockBefore: product.stock,
          stockAfter: data.actualStock,
          notes: data.reason
        }
      });

      return history;
    });

    await logActivity("STOCK_OPNAME", `Melakukan penyesuaian stok produk ID: ${data.productId} (${data.reason})`);

    revalidatePath("/stok/opname");
    revalidatePath("/product");

    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    console.error("Failed to create opname:", error);
    return { success: false, error: error.message || "Gagal menyimpan penyesuaian stok" };
  }
}
