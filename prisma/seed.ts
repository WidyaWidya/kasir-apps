import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Seed admin user
  const password = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password,
      fullName: 'Administrator',
      role: UserRole.ADMIN,
    },
  })

  // Upsert settings — selalu update ke data default
  const existingSetting = await prisma.setting.findFirst()
  const settingData = {
    storeName: 'OEMAH ELEKTRONIK',
    storeAddress: 'JL TAMAN INDAH V NO 8, TAMAN, SEPANJANG SIDOARJO',
    storePhone: '08559039000',
    storeEmail: 'OEMAHELEKTRONIKA@GMAIL.COM',

    cashierName: 'RIFAT',
    discountMethod: 'Persen',
    defaultTax: 0,
    transactionType: 'Invoice',
    printMethod: 'Export ke PDF',

    logo: null,

    bank1Name: 'BCA',
    bank1AccountNumber: '4290670778',
    bank1AccountName: 'M RIFAT ZHORIIF M',

    bank2Name: 'BCA',
    bank2AccountNumber: '5550141517',
    bank2AccountName: 'LIA WIDYA SARI',

    receiptFooter1: 'Terima kasih atas kunjungan Anda!',
    receiptFooter2: 'Kami tunggu kedatangan Anda kembali.',
    receiptFooter3: 'Semoga hari Anda menyenangkan :)',

    invoiceFooter1: 'Terima kasih atas kepercayaan Anda.',
    invoiceFooter2: 'Mohon simpan dokumen ini sebagai bukti.',
    invoiceFooter3: '',

    regards: 'OEMAH ELEKTRONIK',
  }

  if (existingSetting) {
    await prisma.setting.update({
      where: { id: existingSetting.id },
      data: settingData,
    })
    console.log('Settings updated to OEMAH ELEKTRONIK.')
  } else {
    await prisma.setting.create({ data: settingData })
    console.log('Default settings created.')
  }

  console.log('Seeder success')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })