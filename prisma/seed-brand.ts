import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const brands = [
  { name: 'SHARP' },
  { name: 'RSA' },
  { name: 'GEA' },
  { name: 'AQUA' },
  { name: 'LG' },
  { name: 'HISENSE' },
  { name: 'PANASONIC' },
  { name: 'TCL' },
  { name: 'XIAOMI' },
  { name: 'ONGKIR' },
  { name: 'LAINNYA' },
]

async function main() {
  console.log('⏳ Seeding brands...')

  let created = 0
  let skipped = 0

  for (const brand of brands) {
    const existing = await prisma.brand.findFirst({
      where: { name: brand.name },
    })

    if (existing) {
      skipped++
      console.log(`  ↻  Skipped  : ${brand.name} (Already exists)`)
    } else {
      await prisma.brand.create({ data: brand })
      created++
      console.log(`  ✓  Created  : ${brand.name}`)
    }
  }

  console.log(`\n✅ Done! Created: ${created}  |  Skipped: ${skipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeder error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
