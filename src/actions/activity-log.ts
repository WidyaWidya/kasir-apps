"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function logActivity(action: string, description?: string, customUserId?: string) {
  try {
    let userId = customUserId;

    if (!userId) {
      const session = await getServerSession(authConfig);
      if (session?.user?.id) {
        userId = session.user.id;
      }
    }

    await prisma.activityLog.create({
      data: {
        action,
        description: description || null,
        userId: userId || null, // null if system or guest
        ipAddress: null, // could get from headers but in server actions it's tricky
        userAgent: null,
      }
    });

  } catch (error) {
    console.error("Failed to write activity log:", error);
    // Kita tidak return error agar tidak mengganggu transaksi utama
  }
}

export interface ActivityLogFilter {
  startDate?: string;
  endDate?: string;
  actionType?: string;
}

export async function getActivityLogs(filters: ActivityLogFilter) {
  try {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(`${filters.startDate}T00:00:00.000Z`);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(`${filters.endDate}T23:59:59.999Z`);
      }
    }

    if (filters.actionType) {
      where.action = {
        contains: filters.actionType,
        mode: "insensitive"
      };
    }

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, role: true } }
      },
      take: 500 // limit to last 500 for performance
    });

    return { success: true, data: JSON.parse(JSON.stringify(logs)) };
  } catch (error: any) {
    console.error("Failed to fetch activity logs:", error);
    return { success: false, error: "Gagal memuat log aktivitas" };
  }
}
