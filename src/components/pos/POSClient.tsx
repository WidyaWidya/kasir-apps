"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { searchProducts, createTransaction } from "@/actions/pos";
import type { CartItem, TransactionData } from "@/actions/pos";
import CheckoutModal from "./CheckoutModal";

interface Product {
  id: string;
  sku: string;
  name: string;
  sellPrice: any; // Decimal from Prisma
  stock: number;
  image?: string | null;
}

interface POSClientProps {
  initialData: {
    customers: any[];
    salesUsers: any[];
    paymentMethods: any[];
    settings: any;
  };
  currentUser: {
    id: string;
    name: string;
  };
}

// Ensure unique keys for cart items if same product added multiple times?
// Standard POS aggregates same product by adding quantity.
interface POSCartItem extends CartItem {
  cartId: string;
  name: string;
  sku: string;
  stock: number;
}

export default function POSClient({ initialData, currentUser }: POSClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState(0);
  const [globalTaxPercent, setGlobalTaxPercent] = useState(0);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load default products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      const res = await searchProducts("");
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setIsLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  // Handle Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingProducts(true);
      const res = await searchProducts(searchQuery);
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setIsLoadingProducts(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Actions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      const price = Number(product.sellPrice);
      if (existing) {
        // limit stock checking?
        if (existing.quantity >= product.stock) {
          alert(`Stok ${product.name} tidak mencukupi. Sisa: ${product.stock}`);
          return prev;
        }
        return prev.map((item) => {
          if (item.productId === product.id) {
            const newQty = item.quantity + 1;
            return {
              ...item,
              quantity: newQty,
              subtotal: (price - item.discount) * newQty,
            };
          }
          return item;
        });
      }

      if (product.stock < 1) {
        alert(`Stok ${product.name} habis.`);
        return prev;
      }

      return [
        ...prev,
        {
          cartId: Math.random().toString(36).substr(2, 9),
          productId: product.id,
          name: product.name,
          sku: product.sku,
          stock: product.stock,
          price: price,
          discount: 0,
          quantity: 1,
          subtotal: price,
        },
      ];
    });
  };

  const updateCartItem = (cartId: string, field: "quantity" | "discount", value: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQuantity = field === "quantity" ? value : item.quantity;
          const newDiscount = field === "discount" ? value : item.discount;
          
          if (newQuantity > item.stock) {
            alert(`Maksimal stok ${item.name} adalah ${item.stock}`);
            return item;
          }

          return {
            ...item,
            quantity: newQuantity,
            discount: newDiscount,
            subtotal: (item.price - newDiscount) * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    if(confirm("Kosongkan keranjang?")) {
      setCart([]);
      setGlobalDiscountPercent(0);
    }
  };

  // Calculations
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);
  const globalDiscountAmount = useMemo(() => (subtotal * globalDiscountPercent) / 100, [subtotal, globalDiscountPercent]);
  const taxableAmount = subtotal - globalDiscountAmount;
  const globalTaxAmount = useMemo(() => (taxableAmount * globalTaxPercent) / 100, [taxableAmount, globalTaxPercent]);
  const grandTotal = taxableAmount + globalTaxAmount;

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Left Panel: Products Grid */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        {/* Header / Search */}
        <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-10 flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk, SKU, atau Barcode (F2)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-inner outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Product Grid (max 16 based on query limits) */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {isLoadingProducts ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`bg-white dark:bg-gray-800 rounded-2xl border ${product.stock > 0 ? 'border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-500 hover:shadow-lg hover:-translate-y-1' : 'border-red-200 dark:border-red-900 opacity-60 cursor-not-allowed'} overflow-hidden transition-all duration-200 flex flex-col group`}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex items-center justify-center text-gray-400">
                    {/* Placeholder for image, in real app render actual image */}
                    <svg className="w-12 h-12 opacity-50 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Habis</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.sku}</span>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2 leading-tight flex-1" title={product.name}>
                      {product.name}
                    </h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                        Rp {Number(product.sellPrice).toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                        Stok: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Produk tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className="w-full lg:w-[420px] xl:w-[480px] bg-white dark:bg-gray-800 flex flex-col h-[50vh] lg:h-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
        <div className="p-4 bg-brand-600 text-white shadow-md">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold tracking-wide">KERANJANG</h2>
            <button onClick={clearCart} className="text-brand-100 hover:text-white transition-colors" title="Kosongkan Keranjang">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <p className="text-brand-200 text-sm">Kasir: {currentUser.name}</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-gray-50 dark:bg-gray-900/50">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Keranjang masih kosong</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={item.cartId} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 relative group">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm leading-tight mb-1 truncate">{item.name}</h4>
                    <div className="flex items-center text-xs text-gray-500 mb-2 gap-2">
                      <span>Rp {item.price.toLocaleString("id-ID")}</span>
                      <span>•</span>
                      <span className="text-orange-500">Disc: Rp {item.discount.toLocaleString("id-ID")}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-8">
                        <button 
                          onClick={() => updateCartItem(item.cartId, "quantity", Math.max(1, item.quantity - 1))}
                          className="w-8 flex items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateCartItem(item.cartId, "quantity", parseInt(e.target.value) || 1)}
                          className="w-12 text-center text-sm font-medium border-x border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 outline-none appearance-none"
                          min="1"
                        />
                        <button 
                          onClick={() => updateCartItem(item.cartId, "quantity", item.quantity + 1)}
                          className="w-8 flex items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="font-bold text-gray-800 dark:text-white text-sm">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Button (Hover) */}
                  <button 
                    onClick={() => removeCartItem(item.cartId)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                Diskon Global
                <input 
                  type="number" 
                  value={globalDiscountPercent || ""}
                  onChange={(e) => setGlobalDiscountPercent(Number(e.target.value))}
                  placeholder="%" 
                  className="w-12 text-center border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-xs bg-gray-50 dark:bg-gray-900" 
                />
                %
              </span>
              <span className="font-medium text-red-500">- Rp {globalDiscountAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="flex items-center gap-2">
                Pajak (PPN)
                <input 
                  type="number" 
                  value={globalTaxPercent || ""}
                  onChange={(e) => setGlobalTaxPercent(Number(e.target.value))}
                  placeholder="%" 
                  className="w-12 text-center border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-xs bg-gray-50 dark:bg-gray-900" 
                />
                %
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">+ Rp {globalTaxAmount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-end pt-1">
              <span className="text-gray-800 dark:text-gray-200 font-bold text-lg">Total Akhir</span>
              <span className="text-3xl font-black text-brand-600 dark:text-brand-400 tracking-tight">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 text-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            BAYAR SEKARANG (F12)
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        subtotal={subtotal}
        discount={globalDiscountAmount}
        tax={globalTaxAmount}
        grandTotal={grandTotal}
        initialData={initialData}
        currentUser={currentUser}
        onSuccess={() => {
          setCart([]);
          setGlobalDiscountPercent(0);
          setIsCheckoutOpen(false);
          // Show PDF preview
          // window.open('/api/print-receipt?id=...', '_blank');
        }}
      />
    </div>
  );
}
