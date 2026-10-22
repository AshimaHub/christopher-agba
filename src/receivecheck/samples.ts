import type { CompanyId } from '../content/demoCompanies.ts'

export type BillStatus = 'waiting' | 'mismatch' | 'held' | 'matched' | 'accepted'

export type SampleBill = {
  id: string
  number: string
  supplier: string
  goods: string
  billedQty: number
  receivedQty: number | null
  yardQty: number | null
  rate: number
  status: BillStatus
  opened: string
  recordedBy?: string
  note?: string
}

function bills(matched: [string, string, number, number], open: [string, string, number, number]): { bills: SampleBill[] } {
  return {
    bills: [
      {
        id: 'bill-80',
        number: 'RC-80',
        supplier: matched[0],
        goods: matched[1],
        billedQty: matched[2],
        receivedQty: matched[2],
        yardQty: null,
        rate: matched[3],
        status: 'matched',
        opened: '2026-10-14',
        recordedBy: 'Ifeoma Bassey',
      },
      {
        id: 'bill-100',
        number: 'RC-100',
        supplier: open[0],
        goods: open[1],
        billedQty: 100,
        receivedQty: null,
        yardQty: 90,
        rate: open[3],
        status: 'waiting',
        opened: '2026-10-22',
      },
    ],
  }
}

export const receiveSamples: Record<CompanyId, { bills: SampleBill[] }> = {
  harbour: bills(['Harbour Aggregate', 'Stone', 40, 6200], ['Northwharf Cement', 'Cement bags', 100, 8500]),
  mile12: bills(['Mile Sweet House', 'Sugar bags', 20, 16000], ['Mile Grain Stores', 'Rice bags', 100, 18000]),
  lekki: bills(['Lekki Findings', 'Thread cones', 30, 4200], ['Lagoon Cotton', 'Cotton rolls', 100, 12500]),
  sahel: bills(['Kano Webbing', 'Trailer straps', 12, 9500], ['Sahel Rubber', 'Tyres', 100, 75000]),
}
