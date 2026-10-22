import type { CompanyId } from '../content/demoCompanies.ts'

export type SampleMove = {
  id: string
  number: string
  placeId: string
  itemId: string
  kind: 'receipt' | 'issue'
  quantity: number
  reference: string
  status: 'draft' | 'posted'
  created: [number, number]
  posted?: [number, number]
}

type Card = { placeId: string; itemId: string; opening: number }

type Book = {
  places: { id: string; name: string }[]
  items: { id: string; name: string; unit: string }[]
  cards: Card[]
  moves: SampleMove[]
}

const sharedMoves = (itemId: string, placeId: string, receiptRef: string, issueRef: string): SampleMove[] => [
  {
    id: 'move-1040',
    number: 'SL-1040',
    placeId,
    itemId,
    kind: 'receipt',
    quantity: 40,
    reference: receiptRef,
    status: 'posted',
    created: [12, 9],
    posted: [12, 10],
  },
  {
    id: 'move-1044',
    number: 'SL-1044',
    placeId,
    itemId,
    kind: 'issue',
    quantity: 12,
    reference: issueRef,
    status: 'posted',
    created: [14, 11],
    posted: [14, 11],
  },
  {
    id: 'move-1048',
    number: 'SL-1048',
    placeId,
    itemId,
    kind: 'receipt',
    quantity: 30,
    reference: 'Delivery waiting to be posted',
    status: 'draft',
    created: [18, 16],
  },
  {
    id: 'move-1050',
    number: 'SL-1050',
    placeId,
    itemId,
    kind: 'issue',
    quantity: 10,
    reference: 'Job waiting to be issued',
    status: 'draft',
    created: [18, 17],
  },
]

export const ledgerSamples: Record<CompanyId, Book> = {
  harbour: {
    places: [
      { id: 'harbour', name: 'Harbour Pump Station' },
      { id: 'yard', name: 'Central yard' },
    ],
    items: [
      { id: 'cement', name: 'Cement', unit: 'bag' },
      { id: 'cable', name: 'Cable, 2.5 mm', unit: 'metre' },
      { id: 'hose', name: 'Hydraulic hose', unit: 'length' },
    ],
    cards: [
      { placeId: 'harbour', itemId: 'cement', opening: 20 },
      { placeId: 'harbour', itemId: 'cable', opening: 80 },
      { placeId: 'yard', itemId: 'hose', opening: 6 },
    ],
    moves: sharedMoves('cement', 'harbour', 'Supplier delivery, morning load.', 'Night shift at the pump station.'),
  },
  mile12: {
    places: [
      { id: 'warehouse', name: 'Mile 12 Warehouse' },
      { id: 'abuja', name: 'Abuja Cold Room' },
    ],
    items: [
      { id: 'rice', name: 'Rice, 50 kg', unit: 'bag' },
      { id: 'sugar', name: 'Sugar', unit: 'bag' },
      { id: 'oil', name: 'Vegetable oil', unit: 'keg' },
    ],
    cards: [
      { placeId: 'warehouse', itemId: 'rice', opening: 20 },
      { placeId: 'warehouse', itemId: 'sugar', opening: 14 },
      { placeId: 'abuja', itemId: 'oil', opening: 8 },
    ],
    moves: sharedMoves('rice', 'warehouse', 'Market delivery for the week.', 'Abuja standing order.'),
  },
  lekki: {
    places: [
      { id: 'cutting', name: 'Cutting floor' },
      { id: 'sewing', name: 'Sewing hall' },
    ],
    items: [
      { id: 'cotton', name: 'Cotton rolls', unit: 'roll' },
      { id: 'thread', name: 'Thread', unit: 'cone' },
      { id: 'buttons', name: 'Buttons', unit: 'pack' },
    ],
    cards: [
      { placeId: 'cutting', itemId: 'cotton', opening: 20 },
      { placeId: 'cutting', itemId: 'thread', opening: 40 },
      { placeId: 'sewing', itemId: 'buttons', opening: 12 },
    ],
    moves: sharedMoves('cotton', 'cutting', 'Port delivery, cotton rolls.', 'Recut on the finishing line.'),
  },
  sahel: {
    places: [
      { id: 'abuja', name: 'Abuja yard' },
      { id: 'kano', name: 'Kano terminal' },
    ],
    items: [
      { id: 'diesel', name: 'Diesel drum', unit: 'drum' },
      { id: 'tarp', name: 'Tarpaulin', unit: 'piece' },
      { id: 'tyre', name: 'Tyre', unit: 'piece' },
    ],
    cards: [
      { placeId: 'abuja', itemId: 'diesel', opening: 20 },
      { placeId: 'abuja', itemId: 'tarp', opening: 9 },
      { placeId: 'kano', itemId: 'tyre', opening: 4 },
    ],
    moves: sharedMoves('diesel', 'abuja', 'Fuel delivery for the yard pumps.', 'Friday departure.'),
  },
}
