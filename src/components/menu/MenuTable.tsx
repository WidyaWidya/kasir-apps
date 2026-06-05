"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { UserRole, MenuCategory } from "@prisma/client";
import { deleteMenu } from "@/actions/menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Menu {
  id: string;
  name: string;
  path: string;
  icon?: string | null;
  category: MenuCategory;
  roles: UserRole[];
  isActive: boolean;
}

export default function MenuTable({ menus }: { menus: Menu[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;
    
    setIsDeleting(id);
    const res = await deleteMenu(id);
    setIsDeleting(null);
    
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus menu");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-auto max-h-[calc(100vh-255px)]">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 z-10 bg-white dark:bg-gray-900">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Path
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Roles
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {menus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {menu.icon && (
                        <span 
                          className="flex items-center justify-center text-gray-500 dark:text-gray-400 [&>svg]:w-5 [&>svg]:h-5"
                          dangerouslySetInnerHTML={{ __html: menu.icon }}
                        />
                      )}
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {menu.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {menu.path}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {menu.category}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {menu.roles.map((role) => (
                        <Badge key={role} size="sm" color="info">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={menu.isActive ? "success" : "error"}
                    >
                      {menu.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-end text-theme-sm">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/menu/${menu.id}`}
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
                        onClick={() => handleDelete(menu.id)}
                        disabled={isDeleting === menu.id}
                        className="text-error-500 hover:text-error-600 dark:text-error-400 disabled:opacity-50 font-medium text-sm transition-colors flex items-center gap-1"
                        title="Hapus"
                      >
                        {isDeleting === menu.id ? "..." : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {menus.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada menu yang ditambahkan.
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



