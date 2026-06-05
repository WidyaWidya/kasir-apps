import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'BRAKET AC',
    categoryName: 'ACC DAN IOT',
    brandName: null,
    trackStock: true,
    costPrice: 30000,
    sellPrice: 50000,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: 2,
  },
  {
    name: 'AC SHARP 1PK AH-A9DEY2 (INDOOR)',
    categoryName: 'COOLER',
    brandName: 'SHARP',
    trackStock: true,
    costPrice: 2700000,
    sellPrice: 2699999,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: 'AC SHARP 1PK AU-A9DEY2(OUTDOOR)',
    categoryName: 'COOLER',
    brandName: 'SHARP',
    trackStock: true,
    costPrice: null,
    sellPrice: 1,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: 'TCL 50" P7K',
    categoryName: 'TV',
    brandName: 'TCL',
    trackStock: true,
    costPrice: 3500000,
    sellPrice: 4499000,
    wholesalePrice: null,
    promoPrice: 4199000,
    discount: null,
    stock: 2,
  },
  {
    name: 'XIOAMI GTV 65" UHD QLED 2026',
    categoryName: 'TV',
    brandName: 'XIAOMI',
    trackStock: true,
    costPrice: 6000000,
    sellPrice: 6999000,
    wholesalePrice: null,
    promoPrice: 6799000,
    discount: null,
    stock: 1,
  },
  {
    name: 'GEA AB 1200 TX',
    categoryName: 'FREEZER DAN SHOWCASE',
    brandName: 'GEA',
    trackStock: true,
    costPrice: 9950000,
    sellPrice: 10450000,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: 1,
  },
  {
    name: '(B) LG FV1205-S3VS',
    categoryName: 'MESIN CUCI DAN DRYER',
    brandName: 'LG',
    trackStock: true,
    costPrice: null,
    sellPrice: null,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: '(B) LG F2702 SVRV',
    categoryName: 'MESIN CUCI DAN DRYER',
    brandName: 'LG',
    trackStock: true,
    costPrice: 10000000,
    sellPrice: 11000000,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: 'ONGKIR',
    categoryName: 'ONGKIR',
    brandName: null,
    trackStock: false,
    costPrice: null,
    sellPrice: null,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: 'SHARP 32" 2T-C32HD1400I',
    categoryName: 'TV',
    brandName: 'SHARP',
    trackStock: true,
    costPrice: 1650000,
    sellPrice: 1850000,
    wholesalePrice: 1775000,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: 'RSA CF 600',
    categoryName: 'FREEZER',
    brandName: 'RSA',
    trackStock: true,
    costPrice: null,
    sellPrice: null,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: 1,
  },
  {
    name: 'FRONT LOADING LG 8,5 KG FV-1285-S5WS',
    categoryName: 'MESIN CUCI DAN DRYER',
    brandName: 'LG',
    trackStock: true,
    costPrice: 3450000,
    sellPrice: 3850000,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: 2,
  },
  {
    name: 'UP RIGHT FREEZER LG (B) GN-INV304SL',
    categoryName: 'FREEZER',
    brandName: 'LG',
    trackStock: true,
    costPrice: 2278000,
    sellPrice: 2750000,
    wholesalePrice: null,
    promoPrice: null,
    discount: 50000,
    stock: 1,
  },
  {
    name: 'MESIN CUCI 2 TABUNG 9KG (C) P1600RTB',
    categoryName: 'AIR CONDITIONER',
    brandName: 'LG',
    trackStock: true,
    costPrice: 2170000,
    sellPrice: null,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: 'MESIN CUCI TOP LOADING 9KG',
    categoryName: 'MESIN CUCI DAN DRYER',
    brandName: 'LG',
    trackStock: true,
    costPrice: 1800000,
    sellPrice: null,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: '(C) KULKAS LG 2 PINTU GN-B202SQIR',
    categoryName: 'KULKAS',
    brandName: 'LG',
    trackStock: true,
    costPrice: 2046000,
    sellPrice: 2650000,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
  {
    name: 'AC SHARP 0,5 PK AH-A5BEY2 (INDOOR)',
    categoryName: 'AIR CONDITIONER',
    brandName: 'SHARP',
    trackStock: true,
    costPrice: 2324999,
    sellPrice: 2449999,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: 3,
  },
  {
    name: 'AC SHARP 0,5 PK AU-A5BEY2 (OUTDOOR)',
    categoryName: 'AIR CONDITIONER',
    brandName: 'SHARP',
    trackStock: true,
    costPrice: 1,
    sellPrice: 1,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: 3,
  },
  {
    name: '(C) KULKAS 2 PINTU GNB-222-SQIB',
    categoryName: 'KULKAS',
    brandName: 'LG',
    trackStock: true,
    costPrice: 2108000,
    sellPrice: 2850000,
    wholesalePrice: null,
    promoPrice: null,
    discount: null,
    stock: null,
  },
]

async function getOrCreateCategory(name: string) {
  let category = await prisma.category.findFirst({ where: { name } })
  if (!category) {
    category = await prisma.category.create({ data: { name, isActive: true } })
  }
  return category.id
}

async function getOrCreateBrand(name: string | null) {
  if (!name) return null
  let brand = await prisma.brand.findFirst({ where: { name } })
  if (!brand) {
    brand = await prisma.brand.create({ data: { name } })
  }
  return brand.id
}

async function main() {
  console.log('⏳ Seeding products...')

  let created = 0
  let skipped = 0

  for (const item of products) {
    const categoryId = await getOrCreateCategory(item.categoryName)
    const brandId = await getOrCreateBrand(item.brandName)

    if (!categoryId) continue; // Make TS happy just in case
    
    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    })

    const productData = {
      sku: `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: item.name,
      categoryId,
      brandId,
      trackStock: item.trackStock,
      costPrice: item.costPrice || 0,
      sellPrice: item.sellPrice || 0,
      wholesalePrice: item.wholesalePrice,
      promoPrice: item.promoPrice,
      discount: item.discount,
      stock: item.stock || 0,
    }

    if (existing) {
      const { sku, ...updateData } = productData;
      await prisma.product.update({
        where: { id: existing.id },
        data: updateData,
      })
      skipped++
      console.log(`  ↻  Updated  : ${item.name}`)
    } else {
      await prisma.product.create({ data: productData })
      created++
      console.log(`  ✓  Created  : ${item.name}`)
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
