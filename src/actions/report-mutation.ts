"use server";

import { prisma } from "@/lib/prisma";

export interface MutationReportFilter {
  startDate?: string;
  endDate?: string;
  productId?: string;
}

export async function getMutationReport(filters: MutationReportFilter) {
  try {
    if (!filters.startDate || !filters.endDate) {
      return { success: true, data: [] };
    }

    const start = new Date(`${filters.startDate}T00:00:00.000Z`);
    const end = new Date(`${filters.endDate}T23:59:59.999Z`);

    // Fetch products
    const productWhere: any = { isActive: true };
    if (filters.productId) {
      productWhere.id = filters.productId;
    }

    const products = await prisma.product.findMany({
      where: productWhere,
      select: { id: true, name: true, sku: true, stock: true }
    });

    if (products.length === 0) {
      return { success: true, data: [] };
    }

    const productIds = products.map(p => p.id);

    // Fetch all histories from start date to future for these products
    const histories = await prisma.stockHistory.findMany({
      where: {
        productId: { in: productIds },
        createdAt: { gte: start }
      }
    });

    // Process per product
    const result = products.map(product => {
      const prodHistories = histories.filter(h => h.productId === product.id);
      
      // Calculate future mutations (after end date)
      const futureMutations = prodHistories.filter(h => h.createdAt > end);
      const futureMutationsSum = futureMutations.reduce((sum, h) => sum + h.quantity, 0);
      
      // Ending Stock for the date range
      const endingStock = product.stock - futureMutationsSum;

      // Calculate mutations within the date range
      const rangeMutations = prodHistories.filter(h => h.createdAt <= end);
      const rangeMutationsSum = rangeMutations.reduce((sum, h) => sum + h.quantity, 0);

      // Beginning Stock for the date range
      const beginningStock = endingStock - rangeMutationsSum;

      // Breakdown inside the date range
      let purchaseIn = 0;
      let saleOut = 0;
      let opnameAdj = 0;

      rangeMutations.forEach(h => {
        if (h.type === "PURCHASE") {
          purchaseIn += h.quantity;
        } else if (h.type === "SALE" || h.type === "RETURN") {
          saleOut += h.quantity; // Usually negative
        } else if (h.type === "STOCK_OPNAME" || h.type === "ADJUSTMENT") {
          opnameAdj += h.quantity;
        }
      });

      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        beginningStock,
        purchaseIn,
        saleOut,
        opnameAdj,
        endingStock
      };
    });

    // Only return products that have activity or stock
    const activeResult = result.filter(r => 
      r.beginningStock > 0 || 
      r.endingStock > 0 || 
      r.purchaseIn !== 0 || 
      r.saleOut !== 0 || 
      r.opnameAdj !== 0
    );

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(activeResult))
    };
  } catch (error: any) {
    console.error("Failed to fetch mutation report:", error);
    return { success: false, error: "Gagal memuat laporan mutasi persediaan" };
  }
}
