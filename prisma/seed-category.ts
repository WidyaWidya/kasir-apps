import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'FREEZER', isActive: true },
  { name: 'SHOWCASE', isActive: true },
  { name: 'AIR CONDITIONER', isActive: true },
  { name: 'TV', isActive: true },
  { name: 'MESIN CUCI DAN DRYER', isActive: true },
  { name: 'ACC DAN IOT', isActive: true },
  { name: 'PERALATAN DAPUR', isActive: true },
  { name: 'JASA PASANG', isActive: true },
  { name: 'KULKAS', isActive: true },
]

async function main() {
  console.log('⏳ Seeding categories...')

  let created = 0
  let skipped = 0

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name },
    })

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { isActive: cat.isActive },
      })
      skipped++
      console.log(`  ↻  Updated  : ${cat.name}`)
    } else {
      await prisma.category.create({ data: cat })
      created++
      console.log(`  ✓  Created  : ${cat.name}`)
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
