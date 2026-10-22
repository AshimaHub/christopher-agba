import type { CompanyId } from '../content/demoCompanies.ts'

export const banks = [
  { id: 'harbour', name: 'Harbour Community Bank' },
  { id: 'mile', name: 'Mile Trust Bank' },
  { id: 'lekki', name: 'Lekki Mercantile' },
  { id: 'sahel', name: 'Sahel Savings Bank' },
] as const

export type BankId = (typeof banks)[number]['id']
export type PayeeCategory = 'company' | 'business' | 'individual'
export type PayeeStatus = 'draft' | 'pending' | 'approved' | 'returned'

export type SamplePayee = {
  id: string
  number: string
  accountNumber: string
  accountName: string
  verified: boolean
  bankId: BankId
  category: PayeeCategory
  status: PayeeStatus
  purpose: string
  decision?: { action: 'approved' | 'returned'; remark: string }
}

type Book = {
  accounts: { bankId: BankId; accountNumber: string; accountName: string }[]
  payees: SamplePayee[]
}

function book(
  approved: { name: string; account: string; bank: BankId; purpose: string },
  pending: { name: string; account: string; bank: BankId; purpose: string },
  returned: { name: string; account: string; bank: BankId; purpose: string; remark: string },
  draft: { name: string; account: string; bank: BankId; purpose: string },
): Book {
  return {
    accounts: [
      { bankId: approved.bank, accountNumber: approved.account, accountName: approved.name },
      { bankId: pending.bank, accountNumber: pending.account, accountName: pending.name },
      { bankId: returned.bank, accountNumber: returned.account, accountName: returned.name },
      { bankId: draft.bank, accountNumber: draft.account, accountName: draft.name },
    ],
    payees: [
      {
        id: 'payee-410',
        number: 'PB-410',
        accountNumber: approved.account,
        accountName: approved.name,
        verified: true,
        bankId: approved.bank,
        category: 'company',
        status: 'approved',
        purpose: approved.purpose,
        decision: { action: 'approved', remark: 'Account name matches the supplier we use.' },
      },
      {
        id: 'payee-420',
        number: 'PB-420',
        accountNumber: pending.account,
        accountName: pending.name,
        verified: true,
        bankId: pending.bank,
        category: 'business',
        status: 'pending',
        purpose: pending.purpose,
      },
      {
        id: 'payee-430',
        number: 'PB-430',
        accountNumber: returned.account,
        accountName: returned.name,
        verified: true,
        bankId: returned.bank,
        category: 'individual',
        status: 'returned',
        purpose: returned.purpose,
        decision: { action: 'returned', remark: returned.remark },
      },
      {
        id: 'payee-440',
        number: 'PB-440',
        accountNumber: draft.account,
        accountName: '',
        verified: false,
        bankId: draft.bank,
        category: 'company',
        status: 'draft',
        purpose: draft.purpose,
      },
    ],
  }
}

export const payeeSamples: Record<CompanyId, Book> = {
  harbour: book(
    { name: 'Greenfield Plant Hire', account: '9001100410', bank: 'harbour', purpose: 'Hired excavator for the pump station.' },
    { name: 'Westline Cement', account: '9001100420', bank: 'mile', purpose: 'Cement for the night pour.' },
    { name: 'Ibrahim Tanko', account: '9001100430', bank: 'sahel', purpose: 'Casual haulage for one weekend.', remark: 'The account name does not match the person on the job.' },
    { name: 'Palmline Aggregates', account: '9001100440', bank: 'lekki', purpose: 'Stone base for the access road.' },
  ),
  mile12: book(
    { name: 'Lagos Van Hire', account: '9002200410', bank: 'mile', purpose: 'Weekly market deliveries.' },
    { name: 'Kano Rice Shed', account: '9002200420', bank: 'sahel', purpose: 'Rice for the Abuja standing order.' },
    { name: 'Bola Mensah', account: '9002200430', bank: 'harbour', purpose: 'One-off porter payment.', remark: 'The account name does not match the person on the gate list.' },
    { name: 'Island Sugar Desk', account: '9002200440', bank: 'lekki', purpose: 'Sugar for the Friday load.' },
  ),
  lekki: book(
    { name: 'Island Power Hire', account: '9003300410', bank: 'lekki', purpose: 'Generator hire for the cutting floor.' },
    { name: 'Marina Thread', account: '9003300420', bank: 'harbour', purpose: 'Thread for the sewing hall.' },
    { name: 'Chioma Blake', account: '9003300430', bank: 'mile', purpose: 'Sample stitching, one week.', remark: 'The account name does not match the stitcher on the job card.' },
    { name: 'North Cotton Mill', account: '9003300440', bank: 'sahel', purpose: 'Cotton rolls for the next cut.' },
  ),
  sahel: book(
    { name: 'North Plant Hire', account: '9004400410', bank: 'sahel', purpose: 'Lowbed trailer for the Kaduna haul.' },
    { name: 'Yard Fuel Mart', account: '9004400420', bank: 'harbour', purpose: 'Diesel for the Abuja yard.' },
    { name: 'Musa Danladi', account: '9004400430', bank: 'lekki', purpose: 'Night watch for one week.', remark: 'The account name does not match the watchman on the roster.' },
    { name: 'Kano Lift', account: '9004400440', bank: 'mile', purpose: 'Crane hire at the terminal.' },
  ),
}
