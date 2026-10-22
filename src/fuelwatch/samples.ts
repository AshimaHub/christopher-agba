import type { CompanyId } from '../content/demoCompanies.ts'

export type IssueStatus = 'draft' | 'posted' | 'flagged' | 'explained'

export type SampleIssue = {
  id: string
  number: string
  machineId: string
  date: string
  litres: number
  hours: number
  status: IssueStatus
  note: string
  explanation?: string
}

type Book = {
  price: number
  machines: { id: string; name: string; place: string; litresPerHour: number }[]
  issues: SampleIssue[]
}

function week(names: [string, string, string], rates: [number, number, number], places: [string, string, string], notes: [string, string, string, string]): Book {
  return {
    price: 1200,
    machines: [
      { id: 'lead', name: names[0], place: places[0], litresPerHour: rates[0] },
      { id: 'second', name: names[1], place: places[1], litresPerHour: rates[1] },
      { id: 'third', name: names[2], place: places[2], litresPerHour: rates[2] },
    ],
    issues: [
      { id: 'issue-14a', number: 'FL-214', machineId: 'lead', date: '2026-10-14', litres: rates[0] * 8, hours: 8, status: 'posted', note: notes[0] },
      { id: 'issue-14b', number: 'FL-215', machineId: 'second', date: '2026-10-14', litres: rates[1] * 8, hours: 8, status: 'posted', note: notes[1] },
      { id: 'issue-14c', number: 'FL-216', machineId: 'third', date: '2026-10-14', litres: rates[2] * 8, hours: 8, status: 'posted', note: notes[2] },
      { id: 'issue-flag', number: 'FL-220', machineId: 'lead', date: '2026-10-15', litres: 180, hours: 2, status: 'flagged', note: 'Issued at the yard pump.' },
      { id: 'issue-draft', number: 'FL-221', machineId: 'second', date: '2026-10-16', litres: rates[1] * 5, hours: 5, status: 'draft', note: notes[3] },
    ],
  }
}

export const fuelSamples: Record<CompanyId, Book> = {
  harbour: week(
    ['Excavator, 20 tonne', 'Concrete mixer', 'Tipper'],
    [8, 4, 6],
    ['Harbour Pump Station', 'Central yard', 'Access road'],
    ['Day shift on the excavation.', 'Mixer on the yard pour.', 'Tipper on the access road.', 'Friday top-up for the mixer.'],
  ),
  mile12: week(
    ['Box truck', 'Forklift', 'Delivery van'],
    [7, 3, 5],
    ['Mile 12 Warehouse', 'Inbound bay', 'Abuja route'],
    ['Market run.', 'Bay work.', 'Abuja delivery.', 'Friday top-up for the forklift.'],
  ),
  lekki: week(
    ['Generator, 100 kVA', 'Boiler', 'Delivery van'],
    [6, 3, 5],
    ['Cutting floor', 'Finishing line', 'Lekki gate'],
    ['Power for the cutting floor.', 'Steam for finishing.', 'Fabric collection.', 'Friday top-up for the boiler.'],
  ),
  sahel: week(
    ['Lowbed trailer', 'Mobile crane', 'Yard tanker'],
    [9, 5, 4],
    ['Abuja yard', 'Kano terminal', 'Abuja pumps'],
    ['Kaduna haul.', 'Lift at the terminal.', 'Yard transfer.', 'Friday top-up for the crane.'],
  ),
}
