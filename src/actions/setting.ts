"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function getSetting() {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      // Auto-create default if missing
      setting = await prisma.setting.create({
        data: {
          storeName: "Toko Saya",
          discountMethod: "Persen",
          defaultTax: 0,
          transactionType: "Invoice",
          printMethod: "Export ke PDF",
        },
      });
    }
    return {
      success: true,
      data: {
        ...setting,
        defaultTax: Number(setting.defaultTax),
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch setting:", error);
    return { success: false, error: "Gagal mengambil pengaturan" };
  }
}

export async function updateSetting(data: {
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  cashierName?: string;
  discountMethod?: string;
  defaultTax?: number;
  transactionType?: string;
  printMethod?: string;
  bank1Name?: string;
  bank1AccountNumber?: string;
  bank1AccountName?: string;
  bank2Name?: string;
  bank2AccountNumber?: string;
  bank2AccountName?: string;
  receiptFooter1?: string;
  receiptFooter2?: string;
  receiptFooter3?: string;
  invoiceFooter1?: string;
  invoiceFooter2?: string;
  invoiceFooter3?: string;
  regards?: string;
}) {
  try {
    const existing = await prisma.setting.findFirst();

    let setting;
    if (existing) {
      setting = await prisma.setting.update({
        where: { id: existing.id },
        data: {
          ...data,
          defaultTax: data.defaultTax ?? 0,
        },
      });
    } else {
      setting = await prisma.setting.create({
        data: {
          ...data,
          storeName: data.storeName || "Toko Saya",
          defaultTax: data.defaultTax ?? 0,
        },
      });
    }

    revalidatePath("/pengaturan");
    revalidatePath("/");
    return {
      success: true,
      data: { ...setting, defaultTax: Number(setting.defaultTax) },
    };
  } catch (error: any) {
    console.error("Failed to update setting:", error);
    return { success: false, error: "Gagal menyimpan pengaturan" };
  }
}

export async function uploadLogo(formData: FormData) {
  try {
    const file = formData.get("logo") as File;
    if (!file || file.size === 0) {
      return { success: false, error: "File tidak ditemukan" };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Format file tidak didukung (hanya JPG, PNG, GIF, WEBP, SVG)" };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "Ukuran file maksimal 2MB" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "logo");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const logoUrl = `/uploads/logo/${fileName}`;

    // Update setting with new logo
    const existing = await prisma.setting.findFirst();
    if (existing) {
      await prisma.setting.update({
        where: { id: existing.id },
        data: { logo: logoUrl },
      });
    } else {
      await prisma.setting.create({
        data: { storeName: "Toko Saya", logo: logoUrl },
      });
    }

    revalidatePath("/pengaturan");
    revalidatePath("/");
    return { success: true, data: { logoUrl } };
  } catch (error: any) {
    console.error("Failed to upload logo:", error);
    return { success: false, error: "Gagal mengupload logo" };
  }
}

export async function removeLogo() {
  try {
    const existing = await prisma.setting.findFirst();
    if (existing) {
      await prisma.setting.update({
        where: { id: existing.id },
        data: { logo: null },
      });
    }
    revalidatePath("/pengaturan");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove logo:", error);
    return { success: false, error: "Gagal menghapus logo" };
  }
}
