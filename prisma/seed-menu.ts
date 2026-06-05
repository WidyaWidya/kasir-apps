import { PrismaClient, UserRole, MenuCategory } from '@prisma/client'

const prisma = new PrismaClient()

const menus = [
  // ─── DASHBOARD ───────────────────────────────────────────────
  {
    name: 'Dashboard',
    path: '/',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M3 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2 0h4v4H5V5Zm8 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5Zm2 0h4v4h-4V5ZM3 15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Zm2 0h4v4H5v-4Zm8 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4Zm2 0h4v4h-4v-4Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.DASHBOARD,
    roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.OWNER],
    isActive: true,
  },

  // ─── MASTER ──────────────────────────────────────────────────
  {
    name: 'Master Produk',
    path: '/produk',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M3.172 5.172A4 4 0 0 1 6 4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8a4 4 0 0 1 1.172-2.828ZM6 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6Zm1 3a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Master Kategori',
    path: '/kategori',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm13-2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Master Merk',
    path: '/merk',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M11.097 2.518a2 2 0 0 1 1.806 0l8 4A2 2 0 0 1 22 8.236v7.528a2 2 0 0 1-1.097 1.789l-8 4a2 2 0 0 1-1.806 0l-8-4A2 2 0 0 1 2 15.764V8.236a2 2 0 0 1 1.097-1.718l8-4ZM12 4.337 4.437 8.1 12 11.618l7.563-3.519L12 4.337ZM20 9.764l-7 3.257v6.635l7-3.5V9.764ZM11 19.656v-6.635l-7-3.257v6.392l7 3.5Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Master Supplier',
    path: '/supplier',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M4 4a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h.17A3.001 3.001 0 0 0 10 19h4a3.001 3.001 0 0 0 5.83-.001L20 19a3 3 0 0 0 3-3v-4.382a2 2 0 0 0-.211-.894l-2-4A2 2 0 0 0 19 6h-5V5a1 1 0 0 0-1-1H4Zm0 2h8v9H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm10 0h5l2 4H14V6Zm0 6h7v3a1 1 0 0 1-1 1h-.17A3.001 3.001 0 0 0 14 14.17V12Zm-2 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Master Pelanggan',
    path: '/pelanggan',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M8 7a4 4 0 1 0 0 8A4 4 0 0 0 8 7ZM2 11a6 6 0 1 1 12 0A6 6 0 0 1 2 11Zm14.5-3a1 1 0 0 1 1-1A4.5 4.5 0 0 1 22 12.5 4.5 4.5 0 0 1 17.5 17a1 1 0 1 1 0-2 2.5 2.5 0 0 0 0-5 1 1 0 0 1-1-1ZM0 20a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3H5a3 3 0 0 0-3 3 1 1 0 1 1-2 0Zm22 0a1 1 0 1 0-2 0 3 3 0 0 0-3-3 1 1 0 1 1 0-2 5 5 0 0 1 5 5Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Metode Pembayaran',
    path: '/payment-method',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v1H2V7Zm0 3h20v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-7Zm3 3a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2H5Zm4 0a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Manajemen User',
    path: '/pengguna',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2ZM9 7a3 3 0 1 1 6 0A3 3 0 0 1 9 7Zm-4 8a3 3 0 0 0-3 3v1a1 1 0 1 0 2 0v-1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1a1 1 0 1 0 2 0v-1a3 3 0 0 0-3-3H5Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN],
    isActive: true,
  },
  {
    name: 'Manajemen Menu',
    path: '/menu',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M3 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN],
    isActive: true,
  },
  {
    name: 'Pengaturan',
    path: '/pengaturan',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.MASTER,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },

  // ─── TRANSAKSI ───────────────────────────────────────────────
  {
    name: 'Penjualan (POS)',
    path: '/penjualan',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5h-9Zm-3 1.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v13.5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3V5.25Zm4.5 6a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm0-6a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.TRANSAKSI,
    roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Pembelian',
    path: '/pembelian',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M7.5 6h-1A2.5 2.5 0 0 0 4 8.5v1A2.5 2.5 0 0 0 6.5 12H9v1H6.5A2.5 2.5 0 0 0 4 15.5v1A2.5 2.5 0 0 0 6.5 19H9v1.5a.5.5 0 0 0 1 0V19h4v1.5a.5.5 0 0 0 1 0V19h2.5A2.5 2.5 0 0 0 20 16.5v-1A2.5 2.5 0 0 0 17.5 13H15v-1h2.5A2.5 2.5 0 0 0 20 9.5v-1A2.5 2.5 0 0 0 17.5 6h-1V4.5a.5.5 0 0 0-1 0V6h-4V4.5a.5.5 0 0 0-1 0V6Zm1 5h4V8H8.5A.5.5 0 0 0 8 8.5v2a.5.5 0 0 0 .5.5Zm-1 3H6.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H9v-2H8Zm3 2h2v-2h-2v2Zm3 0h2.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H16v2Zm1-5h.5a.5.5 0 0 0 .5-.5v-1A.5.5 0 0 0 17.5 8H16v3h1Zm-2 0V8h-2v3h2Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.TRANSAKSI,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Stok Opname',
    path: '/stok-opname',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3V3a1 1 0 0 0-1-1H9Zm0 2h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM5 6h3v.5a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V6h3v14H5V6Zm9.707 5.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L10 14.586l3.293-3.293a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.TRANSAKSI,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },

  // ─── REPORT ──────────────────────────────────────────────────
  {
    name: 'Laporan Penjualan',
    path: '/laporan/penjualan',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M2 13a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7Zm2 1v5h1v-5H4Zm5-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V9Zm2 1v10h1V10h-1Zm5-6a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V4Zm2 1v14h1V5h-1Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.REPORT,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Laporan Pembelian',
    path: '/laporan/pembelian',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm10 0v4H5V3h10Zm2 0 2 2h-2V3Zm2 4H5v12h14V7ZM8 11a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H8Zm0 4a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2H8Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.REPORT,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Laporan Stok',
    path: '/laporan/stok',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 1.5a8.25 8.25 0 1 1 0 16.5A8.25 8.25 0 0 1 3.75 12Zm-.75 4.5a.75.75 0 0 1 1.5 0V12h2.25a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75V8.25Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.REPORT,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
  {
    name: 'Laporan Laba Rugi',
    path: '/laporan/laba-rugi',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75ZM3 17.25a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V18a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V18a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"/>
    </svg>`,
    category: MenuCategory.REPORT,
    roles: [UserRole.ADMIN, UserRole.OWNER],
    isActive: true,
  },
]

async function main() {
  console.log('⏳ Seeding menus...')

  let created = 0
  let skipped = 0

  for (const menu of menus) {
    const existing = await prisma.menu.findFirst({
      where: { path: menu.path },
    })

    if (existing) {
      // Update icon & data but keep existing settings
      await prisma.menu.update({
        where: { id: existing.id },
        data: {
          name: menu.name,
          icon: menu.icon,
          category: menu.category,
          roles: menu.roles,
          isActive: menu.isActive,
        },
      })
      skipped++
      console.log(`  ↻  Updated  : ${menu.name} (${menu.path})`)
    } else {
      await prisma.menu.create({ data: menu })
      created++
      console.log(`  ✓  Created  : ${menu.name} (${menu.path})`)
    }
  }

  console.log(`\n✅ Done! Created: ${created}  |  Updated: ${skipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeder error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
