import type { CompanyId } from '../content/demoCompanies.ts'

type SampleSheet = {
  id: string
  number: string
  siteId: string
  status: 'draft' | 'submitted' | 'review' | 'approved' | 'rejected'
  purpose: string
  submitterName: string
  lines: { category: string; description: string; amount: number }[]
  created: [number, number]
  decision?: { action: 'approved' | 'rejected'; remark: string; at: [number, number] }
  reviewed?: [number, number]
}

export type SpendSample = {
  sites: { id: string; name: string }[]
  categories: string[]
  sheets: SampleSheet[]
}

const amaka = 'Amaka Nwosu'
const jonah = 'Jonah Hale'
const seyi = 'Seyi Adebanjo'

export const spendSamples: Record<CompanyId, SpendSample> = {
  harbour: {
    sites: [
      { id: 'harbour', name: 'Harbour Pump Station' },
      { id: 'westline', name: 'Westline Fabrication Bay' },
      { id: 'depot', name: 'North Depot Refit' },
    ],
    categories: ['Fuel', 'Site materials', 'Hired transport', 'Repairs', 'Travel'],
    sheets: [
      { id: 'sheet-220', number: 'ES-220', siteId: 'harbour', status: 'draft', purpose: 'Diesel for the standby generator through the shutdown weekend.', submitterName: amaka, lines: [{ category: 'Fuel', description: 'Diesel, standby generator', amount: 186_000 }], created: [18, 16] },
      { id: 'sheet-218', number: 'ES-218', siteId: 'westline', status: 'submitted', purpose: 'Overnight stay for the fabrication inspection.', submitterName: amaka, lines: [{ category: 'Travel', description: 'Hotel, one night', amount: 48_000 }], created: [17, 9] },
      { id: 'sheet-214', number: 'ES-214', siteId: 'depot', status: 'review', purpose: 'Roof sheets for the depot store.', submitterName: jonah, lines: [{ category: 'Site materials', description: 'Roof sheets and fixings', amount: 240_000 }], created: [16, 11], reviewed: [16, 12] },
      { id: 'sheet-210', number: 'ES-210', siteId: 'harbour', status: 'approved', purpose: 'Low-loader move for the spare pump.', submitterName: jonah, lines: [{ category: 'Hired transport', description: 'Low-loader, yard to harbour', amount: 420_000 }], created: [12, 10], decision: { action: 'approved', remark: 'Approved. The haulage receipt is on the sheet.', at: [12, 15] } },
      { id: 'sheet-206', number: 'ES-206', siteId: 'westline', status: 'rejected', purpose: 'Welding repairs with no supporting bill.', submitterName: seyi, lines: [{ category: 'Repairs', description: 'Crane welding', amount: 95_000 }], created: [9, 10], decision: { action: 'rejected', remark: 'Rejected. Attach the workshop bill and submit again.', at: [9, 16] } },
    ],
  },
  mile12: {
    sites: [
      { id: 'warehouse', name: 'Mile 12 Warehouse' },
      { id: 'ikeja', name: 'Ikeja Depot' },
      { id: 'abuja', name: 'Abuja Cold Room' },
    ],
    categories: ['Fuel', 'Stock purchases', 'Hired transport', 'Cold room', 'Travel'],
    sheets: [
      { id: 'sheet-220', number: 'ES-220', siteId: 'warehouse', status: 'draft', purpose: 'Diesel for the cold-room generator through the weekend market.', submitterName: amaka, lines: [{ category: 'Fuel', description: 'Diesel, cold-room generator', amount: 186_000 }], created: [18, 16] },
      { id: 'sheet-218', number: 'ES-218', siteId: 'ikeja', status: 'submitted', purpose: 'Overnight stay for the Ikeja stock count.', submitterName: amaka, lines: [{ category: 'Travel', description: 'Hotel, one night', amount: 48_000 }], created: [17, 9] },
      { id: 'sheet-214', number: 'ES-214', siteId: 'abuja', status: 'review', purpose: 'Rice bags for the Abuja standing order.', submitterName: jonah, lines: [{ category: 'Stock purchases', description: 'Rice, 50 kg bags', amount: 240_000 }], created: [16, 11], reviewed: [16, 12] },
      { id: 'sheet-210', number: 'ES-210', siteId: 'warehouse', status: 'approved', purpose: 'Truck hire to move oil to Abuja.', submitterName: jonah, lines: [{ category: 'Hired transport', description: 'Truck, warehouse to Abuja', amount: 420_000 }], created: [12, 10], decision: { action: 'approved', remark: 'Approved. The haulage receipt is on the sheet.', at: [12, 15] } },
      { id: 'sheet-206', number: 'ES-206', siteId: 'ikeja', status: 'rejected', purpose: 'Cold-room repair with no supporting bill.', submitterName: seyi, lines: [{ category: 'Cold room', description: 'Compressor repair', amount: 95_000 }], created: [9, 10], decision: { action: 'rejected', remark: 'Rejected. Attach the repair bill and submit again.', at: [9, 16] } },
    ],
  },
  lekki: {
    sites: [
      { id: 'cutting', name: 'Cutting floor' },
      { id: 'sewing', name: 'Sewing line B' },
      { id: 'finish', name: 'Finishing room' },
    ],
    categories: ['Power', 'Production materials', 'Hired transport', 'Machine repairs', 'Travel'],
    sheets: [
      { id: 'sheet-220', number: 'ES-220', siteId: 'cutting', status: 'draft', purpose: 'Diesel for the factory generator through the weekend run.', submitterName: amaka, lines: [{ category: 'Power', description: 'Diesel, factory generator', amount: 186_000 }], created: [18, 16] },
      { id: 'sheet-218', number: 'ES-218', siteId: 'sewing', status: 'submitted', purpose: 'Overnight stay for the buyer inspection.', submitterName: amaka, lines: [{ category: 'Travel', description: 'Hotel, one night', amount: 48_000 }], created: [17, 9] },
      { id: 'sheet-214', number: 'ES-214', siteId: 'finish', status: 'review', purpose: 'Cotton rolls for the finishing recut.', submitterName: jonah, lines: [{ category: 'Production materials', description: 'Cotton rolls', amount: 240_000 }], created: [16, 11], reviewed: [16, 12] },
      { id: 'sheet-210', number: 'ES-210', siteId: 'cutting', status: 'approved', purpose: 'Truck hire to collect fabric from the port.', submitterName: jonah, lines: [{ category: 'Hired transport', description: 'Truck, port to factory', amount: 420_000 }], created: [12, 10], decision: { action: 'approved', remark: 'Approved. The haulage receipt is on the sheet.', at: [12, 15] } },
      { id: 'sheet-206', number: 'ES-206', siteId: 'sewing', status: 'rejected', purpose: 'Machine repair with no supporting bill.', submitterName: seyi, lines: [{ category: 'Machine repairs', description: 'Sewing machine repair', amount: 95_000 }], created: [9, 10], decision: { action: 'rejected', remark: 'Rejected. Attach the workshop bill and submit again.', at: [9, 16] } },
    ],
  },
  sahel: {
    sites: [
      { id: 'abuja', name: 'Abuja yard' },
      { id: 'kano', name: 'Kano terminal' },
      { id: 'lagos', name: 'Lagos gate' },
    ],
    categories: ['Fuel', 'Tyres and parts', 'Hired trucks', 'Repairs', 'Driver travel'],
    sheets: [
      { id: 'sheet-220', number: 'ES-220', siteId: 'abuja', status: 'draft', purpose: 'Diesel for the Abuja yard pumps through the weekend departures.', submitterName: amaka, lines: [{ category: 'Fuel', description: 'Diesel, yard pumps', amount: 186_000 }], created: [18, 16] },
      { id: 'sheet-218', number: 'ES-218', siteId: 'kano', status: 'submitted', purpose: 'Driver overnight stay at the Kano terminal.', submitterName: amaka, lines: [{ category: 'Driver travel', description: 'Hotel, one night', amount: 48_000 }], created: [17, 9] },
      { id: 'sheet-214', number: 'ES-214', siteId: 'lagos', status: 'review', purpose: 'Tyres for the Lagos gate changeover.', submitterName: jonah, lines: [{ category: 'Tyres and parts', description: 'Tyres and fitting', amount: 240_000 }], created: [16, 11], reviewed: [16, 12] },
      { id: 'sheet-210', number: 'ES-210', siteId: 'abuja', status: 'approved', purpose: 'Hired truck for a load the fleet could not cover.', submitterName: jonah, lines: [{ category: 'Hired trucks', description: 'Hired truck, Abuja to Kano', amount: 420_000 }], created: [12, 10], decision: { action: 'approved', remark: 'Approved. The haulage receipt is on the sheet.', at: [12, 15] } },
      { id: 'sheet-206', number: 'ES-206', siteId: 'kano', status: 'rejected', purpose: 'Trailer repair with no supporting bill.', submitterName: seyi, lines: [{ category: 'Repairs', description: 'Trailer welding', amount: 95_000 }], created: [9, 10], decision: { action: 'rejected', remark: 'Rejected. Attach the workshop bill and submit again.', at: [9, 16] } },
    ],
  },
}
