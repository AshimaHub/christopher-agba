import type { CompanyId } from '../content/demoCompanies.ts'

export type SampleDay = {
  id: string
  machineId: string
  date: string
  worked: number
  idle: number
  note: string
  status: 'draft' | 'logged' | 'disputed' | 'accepted' | 'queried'
}

type Book = {
  machines: { id: string; name: string; supplier: string; place: string; rate: number }[]
  days: SampleDay[]
}

function week(machineId: string, notes: [string, string, string, string, string]): SampleDay[] {
  return [
    { id: 'day-12', machineId, date: '2026-10-12', worked: 8, idle: 1, note: notes[0], status: 'logged' },
    { id: 'day-13', machineId, date: '2026-10-13', worked: 7, idle: 2, note: notes[1], status: 'logged' },
    { id: 'day-14', machineId, date: '2026-10-14', worked: 8, idle: 0, note: notes[3], status: 'logged' },
    { id: 'day-15', machineId, date: '2026-10-15', worked: 6, idle: 4, note: notes[2], status: 'disputed' },
    { id: 'day-16', machineId, date: '2026-10-16', worked: 5, idle: 3, note: notes[4], status: 'draft' },
  ]
}

export const hireSamples: Record<CompanyId, Book> = {
  harbour: {
    machines: [
      { id: 'focus', name: 'Excavator, 20 tonne', supplier: 'Greenfield Plant Hire', place: 'Harbour Pump Station', rate: 45000 },
      { id: 'side', name: 'Concrete mixer', supplier: 'Westline Hire', place: 'Central yard', rate: 18000 },
    ],
    days: [
      ...week('focus', [
        'Full shift on the pump station.',
        'Access was slow after lunch.',
        'Operator says the site was not ready for four hours.',
        'Clear day on the excavation.',
        'Friday hours still to be logged.',
      ]),
      { id: 'side-13', machineId: 'side', date: '2026-10-13', worked: 6, idle: 0, note: 'Mixer on the yard pour.', status: 'logged' },
    ],
  },
  mile12: {
    machines: [
      { id: 'focus', name: 'Box truck', supplier: 'Lagos Van Hire', place: 'Mile 12 Warehouse', rate: 22000 },
      { id: 'side', name: 'Forklift', supplier: 'Yard Hire', place: 'Mile 12 Warehouse', rate: 12000 },
    ],
    days: [
      ...week('focus', [
        'Market run completed.',
        'Queue at the gate in the afternoon.',
        'Driver says the bay was blocked for four hours.',
        'Abuja delivery, no waiting.',
        'Friday hours still to be logged.',
      ]),
      { id: 'side-13', machineId: 'side', date: '2026-10-13', worked: 5, idle: 1, note: 'Forklift on the inbound bay.', status: 'logged' },
    ],
  },
  lekki: {
    machines: [
      { id: 'focus', name: 'Generator, 100 kVA', supplier: 'Island Power Hire', place: 'Cutting floor', rate: 15000 },
      { id: 'side', name: 'Steam press', supplier: 'Floor Hire', place: 'Sewing hall', rate: 9500 },
    ],
    days: [
      ...week('focus', [
        'Power for the cutting floor.',
        'Two hours while the line was reset.',
        'Operator says the floor was idle for four hours.',
        'Full production day.',
        'Friday hours still to be logged.',
      ]),
      { id: 'side-13', machineId: 'side', date: '2026-10-13', worked: 7, idle: 0, note: 'Press on the finishing line.', status: 'logged' },
    ],
  },
  sahel: {
    machines: [
      { id: 'focus', name: 'Lowbed trailer', supplier: 'North Plant Hire', place: 'Abuja yard', rate: 28000 },
      { id: 'side', name: 'Mobile crane', supplier: 'Kano Lift', place: 'Kano terminal', rate: 55000 },
    ],
    days: [
      ...week('focus', [
        'Loaded for the morning departure.',
        'Waiting on the return load.',
        'Driver says the yard was closed for four hours.',
        'Clear haul to Kaduna.',
        'Friday hours still to be logged.',
      ]),
      { id: 'side-13', machineId: 'side', date: '2026-10-13', worked: 4, idle: 1, note: 'Crane on the Kano lift.', status: 'logged' },
    ],
  },
}
