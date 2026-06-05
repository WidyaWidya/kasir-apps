"use server";

import { prisma } from "@/lib/prisma";

export interface StockReportFilter {
  search?: string;
  categoryId?: string;
  brandId?: string;
  stockStatus?: string; // "ALL", "AVAILABLE", "OUT_OF_STOCK", "LOW_STOCK"
}

export async function getStockReport(filters: StockReportFilter) {
  try {
    const where: any = {
      isActive: true, // asumsikan hanya produk aktif
    };

    // 1. Search Name / SKU
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // 2. Category
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // 3. Brand
    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        name: "asc"
      },
      include: {
        category: {
          select: { name: true }
        },
        brand: {
          select: { name: true }
        }
      }
    });

    // 4. Stock Status filtering in memory (karena prisma gte/lte lebih rumit untuk membandingkan dua field dalam tabel yang sama (stock <= minStock) tanpa raw query, kita filter di memori karena data produk umumnya ratusan/ribuan kecil)
    let filteredProducts = products;
    
    if (filters.stockStatus && filters.stockStatus !== "ALL") {
      if (filters.stockStatus === "AVAILABLE") {
        filteredProducts = products.filter(p => p.stock > 0);
      } else if (filters.stockStatus === "OUT_OF_STOCK") {
        filteredProducts = products.filter(p => p.stock === 0);
      } else if (filters.stockStatus === "LOW_STOCK") {
        // stok lebih besar dari 0 tapi kurang dari sama dengan minStock
        filteredProducts = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
      }
    }

    return { success: true, data: JSON.parse(JSON.stringify(filteredProducts)) };
  } catch (error: any) {
    console.error("Failed to fetch stock report:", error);
    return { success: false, error: "Gagal memuat laporan stok" };
  }
}
