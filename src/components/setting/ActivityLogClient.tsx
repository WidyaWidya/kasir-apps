"use client";

import React, { useState, useEffect } from "react";
import { getActivityLogs, ActivityLogFilter } from "@/actions/activity-log";

export default function ActivityLogClient() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ActivityLogFilter>({
    startDate: "",
    endDate: "",
    actionType: ""
  });

  async function fetchLogs() {
    setLoading(true);
    const res = await getActivityLogs(filters);
    if (res.success && res.data) {
      setLogs(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Filter Aktivitas</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-500">Mulai Tanggal</label>
            <input 
              type="date" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-500">Sampai Tanggal</label>
            <input 
              type="date" 
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-500">Jenis Aksi</label>
            <select 
              name="actionType"
              value={filters.actionType}
              onChange={handleFilterChange}
              className="rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-800 dark:text-white"
            >
              <option value="">Semua Aksi</option>
              <option value="CREATE">Create (Tambah)</option>
              <option value="UPDATE">Update (Ubah)</option>
              <option value="DELETE">Delete (Hapus)</option>
              <option value="SALE">Penjualan</option>
              <option value="PURCHASE">Pembelian</option>
              <option value="OPNAME">Stock Opname</option>
            </select>
          </div>
          <button 
            onClick={fetchLogs}
            className="rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
          >
            Terapkan Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">Waktu</th>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">Aksi</th>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">Keterangan</th>
                <th className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">Pelaku (User)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Memuat log aktivitas...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("id-ID", {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        log.action.includes('DELETE') ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20' :
                        log.action.includes('UPDATE') ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20' :
                        log.action.includes('SALE') ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20' :
                        'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {log.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {log.user ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{log.user.fullName}</span>
                          <span className="text-xs text-gray-500">{log.user.role}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Sistem / Tidak Diketahui</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada aktivitas yang terekam pada filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
