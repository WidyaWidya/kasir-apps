"use client";

import React, { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Checkbox from "../form/input/Checkbox";
import Switch from "../form/switch/Switch";
import Select from "../form/Select";
import { UserRole, MenuCategory } from "@prisma/client";
import { createMenu, updateMenu, MenuData } from "@/actions/menu";
import { useRouter } from "next/navigation";

interface MenuFormProps {
  initialData?: MenuData & { id: string };
}

const ALL_ROLES: UserRole[] = ["ADMIN", "CASHIER", "OWNER"];

export default function MenuForm({ initialData }: MenuFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initialData?.name || "");
  const [path, setPath] = useState(initialData?.path || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [category, setCategory] = useState<MenuCategory>(initialData?.category || "MASTER");
  const [roles, setRoles] = useState<UserRole[]>(initialData?.roles || []);
  const [isActive, setIsActive] = useState(
    initialData?.isActive !== undefined ? initialData.isActive : true
  );

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      setRoles((prev) => [...prev, role]);
    } else {
      setRoles((prev) => prev.filter((r) => r !== role));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !path) {
      setError("Name dan Path wajib diisi.");
      return;
    }
    
    if (roles.length === 0) {
      setError("Pilih minimal 1 role.");
      return;
    }

    setIsLoading(true);

    const data: MenuData = {
      name,
      path,
      icon: icon || undefined,
      category,
      roles,
      isActive,
    };

    let result;
    if (initialData?.id) {
      result = await updateMenu(initialData.id, data);
    } else {
      result = await createMenu(data);
    }

    setIsLoading(false);

    if (result.success) {
      router.push("/menu");
      router.refresh();
    } else {
      setError(result.error || "Terjadi kesalahan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-8 bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
        {initialData ? "Edit Menu" : "Tambah Menu Baru"}
      </h2>

      {error && (
        <div className="p-3 mb-6 text-sm text-error-500 bg-error-50 rounded-lg dark:bg-error-500/10 dark:text-error-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-1 md:col-span-2">
          <Label>Name <span className="text-error-500">*</span></Label>
          <Input
            type="text"
            placeholder="Contoh: Dashboard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Label>Path <span className="text-error-500">*</span></Label>
          <Input
            type="text"
            placeholder="Contoh: /dashboard"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Label>Icon Class/SVG (Opsional)</Label>
          <Input
            type="text"
            placeholder="Contoh: <svg>...</svg> atau nama icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Label>Kategori Menu <span className="text-error-500">*</span></Label>
          <Select
            value={category}
            onChange={(val) => setCategory(val as MenuCategory)}
            options={[
              { label: "Dashboard", value: "DASHBOARD" },
              { label: "Master", value: "MASTER" },
              { label: "Transaksi", value: "TRANSAKSI" },
              { label: "Report", value: "REPORT" },
            ]}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Label>Roles Akses <span className="text-error-500">*</span></Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {ALL_ROLES.map((role) => (
              <Checkbox
                key={role}
                label={role}
                checked={roles.includes(role)}
                onChange={(checked) => handleRoleChange(role, checked)}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Switch
            label="Is Active"
            defaultChecked={isActive}
            onChange={(checked) => setIsActive(checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => router.push("/menu")}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Menu"}
        </Button>
      </div>
    </form>
  );
}
