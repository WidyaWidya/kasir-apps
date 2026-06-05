"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SettingData {
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  cashierName?: string;
  discountMethod?: string;
  transactionType?: string;
  printMethod?: string;
  bank1Name?: string;
  bank1Account?: string;
  bank1Owner?: string;
  bank2Name?: string;
  bank2Account?: string;
  bank2Owner?: string;
  logo?: string;
  receiptFooterLine1?: string;
  receiptFooterLine2?: string;
  receiptFooterLine3?: string;
  invoiceFooterLine1?: string;
  invoiceFooterLine2?: string;
  invoiceFooterLine3?: string;
  signatureName?: string;
  defaultTax?: string;
  defaultDiscount?: string;
}

export async function getSetting() {
  try {
    const setting = await prisma.setting.findFirst();
    return { success: true, data: setting };
  } catch (error: any) {
    console.error("Failed to fetch setting:", error);
    return { success: false, error: "Gagal mengambil data pengaturan" };
  }
}

export async function upsertSetting(data: SettingData) {
  try {
    const existing = await prisma.setting.findFirst();

    const payload = {
      storeName: data.storeName,
      storeAddress: data.storeAddress,
      storePhone: data.storePhone,
      storeEmail: data.storeEmail,
      cashierName: data.cashierName,
      discountMethod: data.discountMethod,
      transactionType: data.transactionType,
      printMethod: data.printMethod,
      bank1Name: data.bank1Name,
      bank1Account: data.bank1Account,
      bank1Owner: data.bank1Owner,
      bank2Name: data.bank2Name,
      bank2Account: data.bank2Account,
      bank2Owner: data.bank2Owner,
      logo: data.logo,
      receiptFooterLine1: data.receiptFooterLine1,
      receiptFooterLine2: data.receiptFooterLine2,
      receiptFooterLine3: data.receiptFooterLine3,
      invoiceFooterLine1: data.invoiceFooterLine1,
      invoiceFooterLine2: data.invoiceFooterLine2,
      invoiceFooterLine3: data.invoiceFooterLine3,
      signatureName: data.signatureName,
      defaultTax: data.defaultTax ? Number(data.defaultTax) : undefined,
      defaultDiscount: data.defaultDiscount ? Number(data.defaultDiscount) : undefined,
    };

    let setting;
    if (existing) {
      setting = await prisma.setting.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      setting = await prisma.setting.create({ data: payload });
    }

    revalidatePath("/pengaturan");
    revalidatePath("/");
    return { success: true, data: setting };
  } catch (error: any) {
    console.error("Failed to upsert setting:", error);
    return { success: false, error: "Gagal menyimpan pengaturan" };
  }
}
