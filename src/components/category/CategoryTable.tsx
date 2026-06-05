"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { deleteCategory, toggleCategoryStatus } from "@/actions/category";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function CategoryTable({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`))
      return;

    setIsDeleting(id);
    const res = await deleteCategory(id);
    setIsDeleting(null);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus kategori");
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsToggling(id);
    const res = await toggleCategoryStatus(id, !currentStatus);
    setIsToggling(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal mengubah status kategori");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-auto max-h-[calc(100vh-255px)]">
        <Table>
          {/* Summary Row */}

          {/* Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 z-10 bg-white dark:bg-gray-900">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama Kategori
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Deskripsi
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
              >
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {categories.map((cat) => (
              <TableRow
                key={cat.id}
               
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {cat.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-xs">
                  {cat.description || (
                    <span className="text-gray-300 dark:text-gray-600 italic">
                      —
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-end">
                  <button
                    onClick={() => handleToggle(cat.id, cat.isActive)}
                    disabled={isToggling === cat.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                      cat.isActive
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    title={cat.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        cat.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/kategori/${cat.id}`}
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-sm transition-colors flex items-center gap-1"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={isDeleting === cat.id}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 disabled:opacity-50 font-medium text-sm transition-colors flex items-center gap-1"
                      title="Hapus"
                    >
                      {isDeleting === cat.id ? "..." : (
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

            {categories.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-5 py-10 text-center text-gray-400 dark:text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-10 h-10 text-gray-300 dark:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-sm">Belum ada kategori yang ditambahkan.</p>
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






