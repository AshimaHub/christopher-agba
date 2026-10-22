import type { CompanyId } from '../content/demoCompanies.ts'

export type BoardStatus = 'unreported' | 'working' | 'idle' | 'down' | 'away'

export type SampleUnit = {
  id: string
  name: string
  assigned: string
  reported: string
  status: BoardStatus
  hours: number
  note: string
}

type Book = { units: SampleUnit[] }

function board(names: [string, string, string, string, string, string], places: [string, string, string], idleNote: string): Book {
  const [home, job, yard] = places
  return {
    units: [
      { id: 'unit-1', name: names[0], assigned: home, reported: home, status: 'working', hours: 6, note: 'On the job since morning.' },
      { id: 'unit-2', name: names[1], assigned: job, reported: job, status: 'working', hours: 7, note: 'Sent out and working.' },
      { id: 'unit-3', name: names[2], assigned: yard, reported: yard, status: 'unreported', hours: 0, note: '' },
      { id: 'unit-4', name: names[3], assigned: home, reported: home, status: 'idle', hours: 0, note: idleNote },
      { id: 'unit-5', name: names[4], assigned: home, reported: home, status: 'idle', hours: 0, note: '' },
      { id: 'unit-6', name: names[5], assigned: job, reported: yard, status: 'away', hours: 0, note: '' },
    ],
  }
}

export const fleetSamples: Record<CompanyId, Book> = {
  harbour: board(
    ['Excavator, 20 tonne', 'Tipper', 'Concrete mixer', 'Roller', 'Water bowser', 'Lowbed'],
    ['Harbour Pump Station', 'Access road', 'Central yard'],
    'Waiting on the grade before it can compact.',
  ),
  mile12: board(
    ['Box truck', 'Delivery van', 'Forklift', 'Cold van', 'Pallet jack', 'Abuja truck'],
    ['Mile 12 Warehouse', 'Market gate', 'Abuja bay'],
    'The cold room is full, so the van is standing.',
  ),
  lekki: board(
    ['Generator, 100 kVA', 'Cutting line', 'Steam press', 'Finishing table', 'Spare generator', 'Fabric van'],
    ['Cutting floor', 'Sewing hall', 'Lekki gate'],
    'The line is waiting on cotton.',
  ),
  sahel: board(
    ['Lowbed trailer', 'Curtain trailer', 'Mobile crane', 'Yard tanker', 'Escort pickup', 'Kano truck'],
    ['Abuja yard', 'Kaduna road', 'Kano terminal'],
    'The load is not ready, so the tanker is standing.',
  ),
}
