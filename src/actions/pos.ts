"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity-log";

// Custom types for transaction data
export interface TransactionData {
  customerId?: string;
  userId: string;
  salesUserId?: string; // Stored in notes as sales name, or we can just append it
  paymentMethodId?: string;
  subtotal: number;
  discount: number; // Global discount amount
  tax: number;      // Global tax amount
  grandTotal: number;
  paidAmount: number;
  changeAmount: number;
  notes?: string;
  items: CartItem[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

export async function getPOSInitialData() {
  try {
    const [customers, users, paymentMethods, settings] = await Promise.all([
      prisma.customer.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.user.findMany({ where: { isActive: true, role: "CASHIER" }, orderBy: { fullName: "asc" } }),
      prisma.paymentMethod.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.setting.findFirst(),
    ]);

    return {
      success: true,
      data: JSON.parse(JSON.stringify({
        customers,
        salesUsers: users,
        paymentMethods,
        settings,
      })),
    };
  } catch (error: any) {
    console.error("Failed to fetch POS initial data:", error);
    return { success: false, error: "Gagal mengambil data awal POS" };
  }
}

export async function searchProducts(query: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
          { barcode: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
        brand: true,
      },
      take: 16,
      orderBy: { name: "asc" },
    });

    return { success: true, data: JSON.parse(JSON.stringify(products)) };
  } catch (error: any) {
    console.error("Failed to search products:", error);
    return { success: false, error: "Gagal mencari produk" };
  }
}

export async function createTransaction(data: TransactionData) {
  try {
    let userExists = null;
    if (data.userId) {
      userExists = await prisma.user.findUnique({ where: { id: data.userId } });
    }

    if (!userExists) {
      const fallbackUser = await prisma.user.findFirst({ where: { role: "CASHIER" } }) || await prisma.user.findFirst();
      if (fallbackUser) {
        data.userId = fallbackUser.id;
      } else {
        throw new Error("Sistem tidak menemukan User/Kasir aktif. Harap login ulang.");
      }
    }

    // 1. Generate Invoice Number (Format: INV-YYYYMMDD-XXXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    
    // Find the latest invoice for today to generate sequence
    const latestSale = await prisma.sale.findFirst({
      where: {
        invoiceNumber: {
          startsWith: `INV-${dateStr}-`,
        },
      },
      orderBy: { invoiceNumber: "desc" },
    });

    let sequence = 1;
    if (latestSale) {
      const parts = latestSale.invoiceNumber.split("-");
      sequence = parseInt(parts[2]) + 1;
    }
    const invoiceNumber = `INV-${dateStr}-${sequence.toString().padStart(4, "0")}`;

    // Prepare notes (include Sales User ID/Name if provided)
    let finalNotes = data.notes || "";
    if (data.salesUserId) {
      const salesUser = await prisma.user.findUnique({ where: { id: data.salesUserId } });
      if (salesUser) {
        finalNotes = finalNotes 
          ? `Sales: ${salesUser.fullName} | ${finalNotes}` 
          : `Sales: ${salesUser.fullName}`;
      }
    }

    // 2. Perform Transaction inside Prisma $transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Sale Header
      const sale = await tx.sale.create({
        data: {
          invoiceNumber,
          customerId: data.customerId || null,
          userId: data.userId, // The logged in cashier
          paymentMethodId: data.paymentMethodId || null,
          subtotal: data.subtotal,
          discount: data.discount,
          tax: data.tax,
          grandTotal: data.grandTotal,
          paidAmount: data.paidAmount,
          changeAmount: data.changeAmount,
          notes: finalNotes,
          status: "PAID",
          
          // Create Sale Details
          saleDetails: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              subtotal: item.subtotal,
            })),
          },
        },
      });

      // 3. Update Stock & History for each item
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (product && product.trackStock) {
          const newStock = product.stock - item.quantity;
          
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          });

          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              type: "SALE",
              quantity: item.quantity,
              stockBefore: product.stock,
              stockAfter: newStock,
              referenceId: sale.id,
              notes: `Terjual pada invoice ${invoiceNumber}`,
            },
          });
        }
      }

      return sale;
    });

    await logActivity("CREATE_SALE", `Mencetak invoice penjualan: ${invoiceNumber}`, data.userId);
    revalidatePath("/penjualan");
    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    console.error("Failed to create transaction:", error);
    return { success: false, error: "Error: " + (error?.message || "Gagal memproses transaksi") };
  }
}
