import React from "react";
import Link from "next/link";

export default function OpnameTable({ history }: { history: any[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      <div className="overflow-x-auto max-h-[calc(100vh-255px)] overflow-y-auto custom-scrollbar">
        <table className="min-w-full whitespace-nowrap text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">TANGGAL</th>
              <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">PRODUK</th>
              <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center">STOK SEBELUM</th>
              <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center">STOK FISIK</th>
              <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90 text-center">SELISIH</th>
              <th className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">ALASAN / CATATAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {history.length > 0 ? (
              history.map((item) => {
                const diff = Number(item.quantity);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {new Date(item.createdAt).toLocaleString("id-ID", {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{item.product?.name || "Produk Dihapus"}</div>
                      <div className="text-xs text-gray-500">{item.product?.sku}</div>
                    </td>
                    <td className="px-5 py-3 text-center text-gray-700 dark:text-gray-300">
                      {item.stockBefore}
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-gray-800 dark:text-white">
                      {item.stockAfter}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {diff === 0 ? (
                        <span className="text-gray-500 font-medium">Sama (0)</span>
                      ) : diff > 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-bold">+{diff}</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 font-bold">{diff}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400 italic max-w-xs truncate" title={item.notes}>
                      "{item.notes}"
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                  Belum ada data penyesuaian stok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
