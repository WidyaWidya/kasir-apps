"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // 1. Revenue & Transactions Today
    const salesToday = await prisma.sale.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: today }
      }
    });

    const revenueToday = salesToday.reduce((sum, sale) => sum + Number(sale.grandTotal), 0);
    const transactionsToday = salesToday.length;

    // 2. Gross Profit This Month
    const salesThisMonth = await prisma.sale.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: firstDayOfMonth }
      },
      include: {
        saleDetails: {
          include: { product: { select: { costPrice: true } } }
        }
      }
    });

    let profitThisMonth = 0;
    salesThisMonth.forEach(sale => {
      const revenue = Number(sale.grandTotal);
      const cogs = sale.saleDetails.reduce((sum, detail) => {
        const costPrice = detail.product ? Number(detail.product.costPrice) : 0;
        return sum + (costPrice * detail.quantity);
      }, 0);
      profitThisMonth += (revenue - cogs);
    });

    // 3. Low Stock Products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        // Prisma doesn't support comparing two columns directly in findMany where easily without raw query,
        // but we can fetch them and filter, or just fetch all and filter.
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minStock: true
      }
    });
    
    const filteredLowStock = lowStockProducts
      .filter(p => p.stock <= p.minStock)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5); // top 5 most critical

    // 4. Recent Transactions
    const recentSales = await prisma.sale.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: { select: { name: true } }
      }
    });

    const formattedRecentSales = recentSales.map(sale => ({
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      createdAt: sale.createdAt,
      customerName: sale.customer?.name || "UMUM",
      grandTotal: Number(sale.grandTotal)
    }));

    // 5. Chart Data (Last 30 Days)
    const salesLast30Days = await prisma.sale.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true,
        grandTotal: true
      }
    });

    // Prepare 30 days array
    const chartDataMap = new Map();
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(thirtyDaysAgo.getDate() + i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      chartDataMap.set(dateStr, 0);
    }

    salesLast30Days.forEach(sale => {
      const dateStr = sale.createdAt.toISOString().split("T")[0];
      if (chartDataMap.has(dateStr)) {
        chartDataMap.set(dateStr, chartDataMap.get(dateStr) + Number(sale.grandTotal));
      }
    });

    const chartCategories = Array.from(chartDataMap.keys()).map(d => {
      const parts = d.split("-");
      return `${parts[2]}/${parts[1]}`; // DD/MM
    });
    const chartSeries = Array.from(chartDataMap.values());

    return {
      success: true,
      data: {
        revenueToday,
        transactionsToday,
        profitThisMonth,
        lowStockProducts: filteredLowStock,
        recentSales: formattedRecentSales,
        chart: {
          categories: chartCategories,
          series: chartSeries
        }
      }
    };
  } catch (error) {
    console.error("Dashboard error:", error);
    return { success: false, error: "Gagal memuat data dashboard" };
  }
}
