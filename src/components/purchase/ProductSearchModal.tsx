"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getProducts } from "@/actions/product";
import Link from "next/link";

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: any) => void;
}

export default function ProductSearchModal({ isOpen, onClose, onSelect }: ProductSearchModalProps) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async (q: string = "") => {
    setIsLoading(true);
    const res = await getProducts({ search: q });
    if (res.success && res.data) {
      setProducts(res.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    } else {
      setSearch("");
    }
  }, [isOpen, fetchProducts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    fetchProducts(val);
  };

  const handleRefresh = () => {
    fetchProducts(search);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pilih Produk</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Cari nama produk atau SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
              title="Refresh Data Produk"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link 
              href="/produk/add" 
              target="_blank"
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Produk Baru
            </Link>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-5 custom-scrollbar min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-left transition-all group"
                >
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {p.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex gap-3">
                      <span>SKU: <span className="font-medium text-gray-700 dark:text-gray-300">{p.sku}</span></span>
                      <span>Stok: <span className="font-medium text-gray-700 dark:text-gray-300">{p.stock}</span></span>
                      <span>Harga Beli: <span className="font-medium text-gray-700 dark:text-gray-300">Rp {Number(p.costPrice).toLocaleString("id-ID")}</span></span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-2">Produk tidak ditemukan.</p>
              <p className="text-sm text-gray-400">Gunakan tombol "Produk Baru" di atas untuk menambahkan produk ke database.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
