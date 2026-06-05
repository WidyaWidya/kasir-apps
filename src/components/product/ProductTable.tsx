"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { deleteProduct } from "@/actions/product";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductTable({ products }: { products: any[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    
    setIsDeleting(id);
    const res = await deleteProduct(id);
    setIsDeleting(null);
    
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus produk");
    }
  };

  // Calculate totals
  const totalHargaModal = products.reduce((acc, p) => acc + Number(p.costPrice || 0), 0);
  const totalHargaJual = products.reduce((acc, p) => acc + Number(p.sellPrice || 0), 0);
  const totalHargaGrosir = products.reduce((acc, p) => acc + Number(p.wholesalePrice || 0), 0);
  const totalHargaPromo = products.reduce((acc, p) => acc + Number(p.promoPrice || 0), 0);
  const totalDiskon = products.reduce((acc, p) => acc + Number(p.discount || 0), 0);
  const totalStok = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const totalHargaModalStok = products.reduce((acc, p) => acc + (Number(p.costPrice || 0) * Number(p.stock || 0)), 0);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-auto max-h-[calc(100vh-255px)]">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 z-10 bg-white dark:bg-gray-900">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama Produk</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kategori</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">MERK</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Hitung Stok</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Harga Modal</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Harga Jual Satuan</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Harga Jual Grosir</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Harga Jual Promo</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Diskon</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Stok</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Harga Modal Stok</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.map((p) => {
                const hargaModalStok = Number(p.costPrice || 0) * Number(p.stock || 0);
                return (
                <TableRow key={p.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">{p.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.category?.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{p.brand?.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-center">{p.trackStock ? "YA" : "TIDAK"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-end">{formatRupiah(Number(p.costPrice))}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-end">{Number(p.sellPrice) ? formatRupiah(Number(p.sellPrice)) : "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-end">{Number(p.wholesalePrice) ? formatRupiah(Number(p.wholesalePrice)) : "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-end">{Number(p.promoPrice) ? formatRupiah(Number(p.promoPrice)) : "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-end">{Number(p.discount) ? formatRupiah(Number(p.discount)) : "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-end">{p.stock || "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-end">{hargaModalStok ? formatRupiah(hargaModalStok) : "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-theme-sm text-end">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/produk/${p.id}`}
                        className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium flex items-center gap-1"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </Link>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={isDeleting === p.id}
                        className="text-error-500 hover:text-error-600 dark:text-error-400 disabled:opacity-50 font-medium flex items-center gap-1"
                        title="Hapus"
                      >
                        {isDeleting === p.id ? "..." : (
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
              )})}
              
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada produk yang ditambahkan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}







