"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

export interface PurchaseFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function getPurchases(filters?: PurchaseFilter) {
  try {
    const where: any = {};

    if (filters?.search) {
      where.invoiceNumber = { contains: filters.search, mode: "insensitive" };
    }
    
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(`${filters.startDate}T00:00:00.000Z`);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(`${filters.endDate}T23:59:59.999Z`);
      }
    }

    const purchases = await prisma.purchase.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        supplier: { select: { name: true } },
        user: { select: { fullName: true, username: true } },
        purchaseDetails: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      }
    });

    return { success: true, data: JSON.parse(JSON.stringify(purchases)) };
  } catch (error: any) {
    console.error("Failed to fetch purchases:", error);
    return { success: false, error: "Gagal mengambil data pembelian" };
  }
}

export interface CreatePurchaseData {
  invoiceNumber: string;
  supplierId: string;
  userId: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    costPrice: number;
    subtotal: number;
  }[];
  total: number;
}

export async function createPurchase(data: CreatePurchaseData) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Barang tidak boleh kosong" };
    }

    // Check if invoice number already exists
    const existing = await prisma.purchase.findUnique({
      where: { invoiceNumber: data.invoiceNumber }
    });
    if (existing) {
      return { success: false, error: "Nomor Invoice sudah ada di database" };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Purchase & Details
      const purchase = await tx.purchase.create({
        data: {
          invoiceNumber: data.invoiceNumber,
          supplierId: data.supplierId,
          userId: data.userId,
          notes: data.notes,
          total: data.total,
          purchaseDetails: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
              subtotal: item.subtotal
            }))
          }
        }
      });

      // 2. Update Stocks and Create StockHistory
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const newStock = product.stock + item.quantity;

        // Mengupdate stok dan juga otomatis memperbarui Harga Beli (costPrice) Master Produk 
        // ke harga beli terbaru dari supplier.
        await tx.product.update({
          where: { id: item.productId },
          data: { 
            stock: newStock,
            costPrice: item.costPrice 
          }
        });

        // Add to StockHistory
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            type: "PURCHASE",
            quantity: item.quantity,
            stockBefore: product.stock,
            stockAfter: newStock,
            referenceId: purchase.id,
            notes: `Pembelian Invoice: ${data.invoiceNumber}`
          }
        });
      }

      return purchase;
    });

    await logActivity("CREATE_PURCHASE", `Membuat transaksi pembelian: ${data.invoiceNumber}`, data.userId);

    revalidatePath("/pembelian");
    revalidatePath("/product"); // Revalidate products because stock changed

    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    console.error("Failed to create purchase:", error);
    return { success: false, error: error.message || "Gagal menyimpan transaksi pembelian" };
  }
}
