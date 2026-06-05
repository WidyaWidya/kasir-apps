"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

export interface UserData {
  username: string;
  password?: string;
  fullName: string;
  role: UserRole;
  isActive?: boolean;
}

export interface GetUsersOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getUsers(options?: GetUsersOptions) {
  try {
    const { search, sortBy = "fullName", sortOrder = "asc" } = options || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return { success: true, data: users };
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "Gagal mengambil data pengguna" };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });
    if (!user) return { success: false, error: "Pengguna tidak ditemukan" };
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    return { success: false, error: "Gagal mengambil data pengguna" };
  }
}

export async function createUser(data: UserData) {
  try {
    if (!data.password) {
      return { success: false, error: "Password wajib diisi untuk pengguna baru" };
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      return { success: false, error: "Username sudah digunakan" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        fullName: data.fullName,
        role: data.role,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath("/pengguna");
    return { success: true, data: newUser };
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Gagal membuat pengguna" };
  }
}

export async function updateUser(id: string, data: UserData) {
  try {
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername && existingUsername.id !== id) {
      return { success: false, error: "Username sudah digunakan" };
    }

    const updateData: any = {
      username: data.username,
      fullName: data.fullName,
      role: data.role,
      isActive: data.isActive ?? true,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/pengguna");
    return { success: true, data: updatedUser };
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Gagal mengupdate pengguna" };
  }
}

export async function deleteUser(id: string) {
  try {
    // Ideally, check if the user is trying to delete themselves
    await prisma.user.delete({ where: { id } });
    revalidatePath("/pengguna");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    if (error.code === "P2003") {
      return {
        success: false,
        error: "Pengguna tidak dapat dihapus karena masih digunakan (misal: terkait transaksi)",
      };
    }
    return { success: false, error: "Gagal menghapus pengguna" };
  }
}
