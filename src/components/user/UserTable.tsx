"use client";

import React, { useState } from "react";
import { deleteUser } from "@/actions/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UserRole } from "@prisma/client";

interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export default function UserTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) return;

    setIsDeleting(id);
    const res = await deleteUser(id);
    setIsDeleting(null);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus pengguna");
    }
  };

  const roleText = {
    ADMIN: "Administrator",
    CASHIER: "Kasir",
    OWNER: "Owner",
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-auto max-h-[calc(100vh-255px)]">
        <Table>

          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 z-10 bg-white dark:bg-gray-900">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Username
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nama Lengkap
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Peran (Role)
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {user.username}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.fullName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {roleText[user.role] || user.role}
                </TableCell>
                <TableCell className="px-4 py-3 text-center text-sm font-medium">
                  <span className={user.isActive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/pengguna/${user.id}`} className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-sm transition-colors flex items-center gap-1" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      disabled={isDeleting === user.id}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 disabled:opacity-50 font-medium text-sm transition-colors flex items-center gap-1"
                      title="Hapus"
                    >
                      {isDeleting === user.id ? "..." : (
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

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="px-5 py-10 text-center text-gray-400 dark:text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-sm">Belum ada pengguna yang ditambahkan.</p>
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






