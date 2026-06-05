"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole, MenuCategory } from "@prisma/client";

export interface MenuData {
  name: string;
  path: string;
  icon?: string;
  category: MenuCategory;
  roles: UserRole[];
  isActive: boolean;
}

export async function getMenus() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: menus };
  } catch (error: any) {
    console.error("Failed to fetch menus:", error);
    return { success: false, error: "Gagal mengambil data menu" };
  }
}

export async function getMenuById(id: string) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
    });
    if (!menu) return { success: false, error: "Menu tidak ditemukan" };
    return { success: true, data: menu };
  } catch (error: any) {
    console.error("Failed to fetch menu:", error);
    return { success: false, error: "Gagal mengambil data menu" };
  }
}

export async function createMenu(data: MenuData) {
  try {
    const newMenu = await prisma.menu.create({
      data,
    });
    revalidatePath("/menu");
    return { success: true, data: newMenu };
  } catch (error: any) {
    console.error("Failed to create menu:", error);
    return { success: false, error: "Gagal membuat menu" };
  }
}

export async function updateMenu(id: string, data: MenuData) {
  try {
    const updatedMenu = await prisma.menu.update({
      where: { id },
      data,
    });
    revalidatePath("/menu");
    return { success: true, data: updatedMenu };
  } catch (error: any) {
    console.error("Failed to update menu:", error);
    return { success: false, error: "Gagal mengupdate menu" };
  }
}

export async function deleteMenu(id: string) {
  try {
    await prisma.menu.delete({
      where: { id },
    });
    revalidatePath("/menu");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete menu:", error);
    return { success: false, error: "Gagal menghapus menu" };
  }
}
