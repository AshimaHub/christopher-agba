import type { CompanyId } from '../content/demoCompanies.ts'

export type WaitStatus = 'draft' | 'waiting' | 'approved' | 'returned'

export type SampleItem = {
  id: string
  number: string
  kind: string
  title: string
  raisedBy: string
  raised: string
  status: WaitStatus
}

function inbox(items: [string, string, string, string]): { items: SampleItem[] } {
  return {
    items: [
      { id: 'wait-18', number: 'WO-18', kind: 'Request', title: items[0], raisedBy: 'Adaeze Okonkwo', raised: '2026-10-16', status: 'waiting' },
      { id: 'wait-24', number: 'WO-24', kind: 'Expense', title: items[1], raisedBy: 'Amaka Nwosu', raised: '2026-10-19', status: 'waiting' },
      { id: 'wait-31', number: 'WO-31', kind: 'Dispatch', title: items[2], raisedBy: 'Ngozi Eze', raised: '2026-10-21', status: 'waiting' },
      { id: 'wait-40', number: 'WO-40', kind: 'Fuel', title: items[3], raisedBy: 'Adaeze Okonkwo', raised: '2026-10-22', status: 'draft' },
    ],
  }
}

export const waitSamples: Record<CompanyId, { items: SampleItem[] }> = {
  harbour: inbox([
    'Cement for the pump station',
    'Night pour, site cash',
    'Stone to the access road',
    'Mixer top-up for Friday',
  ]),
  mile12: inbox([
    'Rice for the Abuja order',
    'Market gate labour',
    'Sugar to the cold room',
    'Forklift diesel for Friday',
  ]),
  lekki: inbox([
    'Cotton for the next cut',
    'Finishing-line thread',
    'Buttons to the sewing hall',
    'Generator diesel for Friday',
  ]),
  sahel: inbox([
    'Tarpaulins for the Kaduna haul',
    'Yard night watch',
    'Tyres to Kano',
    'Trailer diesel for Friday',
  ]),
}
