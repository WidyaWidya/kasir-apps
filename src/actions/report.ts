"use server";

import { prisma } from "@/lib/prisma";

export interface SalesReportFilters {
  startDate?: string;
  endDate?: string;
  invoiceNumber?: string;
  userId?: string;
  customerId?: string;
  paymentMethodId?: string;
  status?: string;
  productId?: string;
}

export async function getSalesReport(filters: SalesReportFilters) {
  try {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        // Start of day
        where.createdAt.gte = new Date(`${filters.startDate}T00:00:00.000Z`);
      }
      if (filters.endDate) {
        // End of day
        where.createdAt.lte = new Date(`${filters.endDate}T23:59:59.999Z`);
      }
    }

    if (filters.invoiceNumber) {
      where.invoiceNumber = {
        contains: filters.invoiceNumber,
        mode: "insensitive",
      };
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.paymentMethodId) {
      where.paymentMethodId = filters.paymentMethodId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.productId) {
      where.saleDetails = {
        some: {
          productId: filters.productId
        }
      };
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: { id: true, fullName: true, username: true }
        },
        customer: {
          select: { id: true, name: true }
        },
        paymentMethod: {
          select: { id: true, name: true }
        },
        saleDetails: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        }
      },
    });

    // Handle Decimal conversion
    const parsedSales = JSON.parse(JSON.stringify(sales));

    return { success: true, data: parsedSales };
  } catch (error: any) {
    console.error("Failed to fetch sales report:", error);
    return { success: false, error: "Gagal mengambil data laporan penjualan" };
  }
}
