"use server";

import { prisma } from "@/lib/prisma";

export interface ProfitReportFilter {
  startDate?: string;
  endDate?: string;
}

export async function getProfitReport(filters: ProfitReportFilter) {
  try {
    const where: any = {
      status: "PAID", // Hanya transaksi LUNAS yang dihitung sebagai profit
    };

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(`${filters.startDate}T00:00:00.000Z`);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(`${filters.endDate}T23:59:59.999Z`);
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
        saleDetails: {
          include: {
            product: {
              select: { costPrice: true, name: true }
            }
          }
        }
      }
    });

    // Menghitung profit per invoice dan merangkum total keseluruhan
    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalGrossProfit = 0;

    const data = sales.map((sale) => {
      // Revenue (Pendapatan Bersih)
      const revenue = Number(sale.grandTotal);

      // COGS (Harga Pokok Penjualan)
      const cogs = sale.saleDetails.reduce((acc, detail) => {
        // Asumsi: menggunakan costPrice produk saat ini. 
        // Jika costPrice di masa depan berubah, nilai history mungkin kurang akurat. 
        // Solusi Enterprise adalah menyimpan costPrice di tabel SaleDetail saat transaksi terjadi.
        const costPrice = detail.product ? Number(detail.product.costPrice) : 0;
        return acc + (costPrice * detail.quantity);
      }, 0);

      const profit = revenue - cogs;

      totalRevenue += revenue;
      totalCOGS += cogs;
      totalGrossProfit += profit;

      return {
        id: sale.id,
        invoiceNumber: sale.invoiceNumber,
        createdAt: sale.createdAt,
        customerName: sale.customer?.name || "UMUM",
        revenue,
        cogs,
        profit,
        details: sale.saleDetails.map(d => ({
          productName: d.product?.name || "Produk Dihapus",
          qty: d.quantity,
          sellPrice: Number(d.price),
          subtotal: Number(d.subtotal)
        }))
      };
    });

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(data)),
      summary: {
        totalRevenue,
        totalCOGS,
        totalGrossProfit
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch profit report:", error);
    return { success: false, error: "Gagal memuat laporan laba rugi" };
  }
}
