import { PrismaClient, PaymentType } from '@prisma/client'

const prisma = new PrismaClient()

const paymentMethods = [
  { name: 'Tunai', type: PaymentType.CASH, isActive: true },
  { name: 'DP', type: PaymentType.CASH, isActive: true },
  { name: 'QRIS', type: PaymentType.QRIS, isActive: true },
  { name: 'TF BCA', type: PaymentType.TRANSFER, isActive: true },
  { name: 'Debit BNI', type: PaymentType.DEBIT, isActive: true },
  { name: 'Debit BCA', type: PaymentType.DEBIT, isActive: true },
  { name: 'Debit BRI', type: PaymentType.DEBIT, isActive: true },
  { name: 'OVO', type: PaymentType.E_WALLET, isActive: true },
  { name: 'Gopay', type: PaymentType.E_WALLET, isActive: true },
  { name: 'SPAYLATER LIMIT EXTRA', type: PaymentType.E_WALLET, isActive: true },
  { name: 'SHOOPE', type: PaymentType.E_WALLET, isActive: true },
  { name: 'TOKOPEDIA', type: PaymentType.E_WALLET, isActive: true },
]

async function main() {
  console.log('⏳ Seeding payment methods...')

  let created = 0
  let skipped = 0

  for (const method of paymentMethods) {
    const existing = await prisma.paymentMethod.findFirst({
      where: { name: method.name },
    })

    if (existing) {
      await prisma.paymentMethod.update({
        where: { id: existing.id },
        data: {
          isActive: method.isActive,
          type: method.type,
        },
      })
      skipped++
      console.log(`  ↻  Updated  : ${method.name}`)
    } else {
      await prisma.paymentMethod.create({ data: method })
      created++
      console.log(`  ✓  Created  : ${method.name}`)
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
