"use server";

import { prisma } from "@/lib/prisma";

export interface PurchaseReportFilter {
  startDate?: string;
  endDate?: string;
  invoiceNumber?: string;
  supplierId?: string;
  userId?: string;
  productId?: string;
}

export async function getPurchaseReport(filters: PurchaseReportFilter) {
  try {
    const where: any = {};

    // 1. Date Range
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(`${filters.startDate}T00:00:00.000Z`);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(`${filters.endDate}T23:59:59.999Z`);
      }
    }

    // 2. Invoice Number
    if (filters.invoiceNumber) {
      where.invoiceNumber = { contains: filters.invoiceNumber, mode: "insensitive" };
    }

    // 3. Supplier
    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
    }

    // 4. Staff / User
    if (filters.userId) {
      where.userId = filters.userId;
    }

    // 5. Product Filter (via purchaseDetails)
    if (filters.productId) {
      where.purchaseDetails = {
        some: {
          productId: filters.productId
        }
      };
    }

    const purchases = await prisma.purchase.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            role: true
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
          }
        },
        purchaseDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true
              }
            }
          }
        }
      }
    });

    // Safely parse JSON to avoid Decimal object passing to Client Components
    return { success: true, data: JSON.parse(JSON.stringify(purchases)) };
  } catch (error: any) {
    console.error("Failed to fetch purchase report:", error);
    return { success: false, error: "Gagal memuat laporan pembelian" };
  }
}
