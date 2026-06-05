"use client";

import React, { useState } from "react";
import { deletePaymentMethod, togglePaymentMethodStatus } from "@/actions/paymentMethod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface PaymentMethod {
  id: string;
  name: string;
  isActive: boolean;
}

export default function PaymentMethodTable({ paymentMethods }: { paymentMethods: PaymentMethod[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsToggling(id);
    const res = await togglePaymentMethodStatus(id, !currentStatus);
    setIsToggling(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal mengubah status metode pembayaran");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus metode pembayaran "${name}"?`)) return;

    setIsDeleting(id);
    const res = await deletePaymentMethod(id);
    setIsDeleting(null);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus metode pembayaran");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-auto max-h-[calc(100vh-255px)]">
        <Table>

          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 z-10 bg-white dark:bg-gray-900">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nama Metode
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paymentMethods.map((method) => (
              <TableRow key={method.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {method.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-end">
                  <button
                    onClick={() => handleToggle(method.id, method.isActive)}
                    disabled={isToggling === method.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                      method.isActive
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    title={method.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        method.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/payment-method/${method.id}`} className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-sm transition-colors flex items-center gap-1" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={() => handleDelete(method.id, method.name)}
                      disabled={isDeleting === method.id}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 disabled:opacity-50 font-medium text-sm transition-colors flex items-center gap-1"
                      title="Hapus"
                    >
                      {isDeleting === method.id ? "..." : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </>
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {paymentMethods.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="px-5 py-10 text-center text-gray-400 dark:text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <p className="text-sm">Belum ada metode pembayaran yang ditambahkan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}






