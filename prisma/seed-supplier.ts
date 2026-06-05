import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const suppliers = [
  { name: 'TRIWIRA TECNO MANDIRI { TTM }', address: 'SURABAYA', description: 'AC' },
  { name: 'BERKAH MITRA TRADING { BMT }', address: 'SURABAYA', description: 'BS LG' },
  { name: 'HERA ELEKTRONIK', address: 'SIDOARJO', description: 'BS SHARP' },
  { name: 'ONLINE', address: 'SHOOPE', description: 'ONLINE' },
  { name: 'OTHER', address: 'OTHER', description: 'OTHER' },
  { name: 'MIAMI ELEKTRONIK', address: 'SURABAYA', description: 'ELEKTRONIK' },
  { name: 'SOLUNA DAPURINDO', address: 'SURABAYA', description: 'PERALATAN DAPUR' },
]

async function main() {
  console.log(`⏳ Seeding suppliers...`)

  let created = 0
  let skipped = 0

  for (const item of suppliers) {
    const existing = await prisma.supplier.findFirst({
      where: { name: item.name },
    })

    const data = {
      name: item.name,
      address: item.address,
      description: item.description,
      isActive: true,
    }

    if (existing) {
      await prisma.supplier.update({
        where: { id: existing.id },
        data,
      })
      skipped++
      console.log(`  ↻  Updated  : ${item.name}`)
    } else {
      await prisma.supplier.create({
        data,
      })
      created++
      console.log(`  ✓  Created  : ${item.name}`)
    }
  }

  console.log(`\n✅ Done! Created: ${created}  |  Updated: ${skipped}\n`)
}

main()
  .catch((e) => {
    console.error(`❌ Seeder error:`, e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
