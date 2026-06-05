import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ICON_CATEGORY = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 8H17M7 12H17M7 16H12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="3" y="4" width="18" height="16" rx="2" stroke="#000000" stroke-width="2"/>
</svg>`;

const ICON_BRAND = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 7H7.01M12 3L3 12L12 21L21 12L12 3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const MENUS_TO_SEED = [
  {
    name: "Kategori",
    path: "/kategori",
    icon: ICON_CATEGORY,
    category: "MASTER" as const,
    roles: ["ADMIN", "OWNER"] as ("ADMIN" | "OWNER")[],
    isActive: true,
  },
  {
    name: "Merk",
    path: "/merk",
    icon: ICON_BRAND,
    category: "MASTER" as const,
    roles: ["ADMIN", "OWNER"] as ("ADMIN" | "OWNER")[],
    isActive: true,
  },
  {
    name: "Suplier",
    path: "/suplier",
    icon: `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M3 12h18M3 17h18" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>`,
    category: "MASTER" as const,
    roles: ["ADMIN", "OWNER"] as ("ADMIN" | "OWNER")[],
    isActive: true,
  },
  {
    name: "Metode Pembayaran",
    path: "/metode-pembayaran",
    icon: `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M4 12h16M4 17h10" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>`,
    category: "MASTER" as const,
    roles: ["ADMIN", "OWNER"] as ("ADMIN" | "OWNER")[],
    isActive: true,
  },
  {
    name: "Pelanggan",
    path: "/pelanggan",
    icon: `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a4 4 0 110 8 4 4 0 010-8zm0 10c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" stroke="#000" stroke-width="2"/></svg>`,
    category: "MASTER" as const,
    roles: ["ADMIN", "OWNER"] as ("ADMIN" | "OWNER")[],
    isActive: true,
  },
  {
    name: "Pengaturan",
    path: "/pengaturan",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="#000000" stroke-width="2"/><path d="M19.4 15A7.9 7.9 0 0 0 20 12A7.9 7.9 0 0 0 19.4 9M4.6 9A7.9 7.9 0 0 0 4 12A7.9 7.9 0 0 0 4.6 15M9 4.6A7.9 7.9 0 0 0 12 4A7.9 7.9 0 0 0 15 4.6M15 19.4A7.9 7.9 0 0 0 12 20A7.9 7.9 0 0 0 9 19.4" stroke="#000000" stroke-width="2"/></svg>`,
    category: "MASTER" as const,
    roles: ["ADMIN", "OWNER"] as ("ADMIN" | "OWNER")[],
    isActive: true,
  },
];

async function main() {
  console.log("Seeding menu Kategori & Merk...");

  for (const menuData of MENUS_TO_SEED) {
    const existing = await prisma.menu.findFirst({
      where: { path: menuData.path },
    });

    if (existing) {
      await prisma.menu.update({
        where: { id: existing.id },
        data: menuData,
      });
      console.log(`✓ Menu "${menuData.name}" diperbarui`);
    } else {
      await prisma.menu.create({ data: menuData });
      console.log(`✓ Menu "${menuData.name}" dibuat`);
    }
  }

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
