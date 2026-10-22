import type { CompanyId } from '../content/demoCompanies.ts'

export type ShiftStatus = 'open' | 'worked' | 'idle' | 'down'

export type SampleMachine = {
  id: string
  name: string
  status: ShiftStatus
  note: string
  followUp: string
}

function shift(names: [string, string, string, string], idleNote: string, downNote: string): { machines: SampleMachine[] } {
  return {
    machines: [
      { id: 'shift-1', name: names[0], status: 'worked', note: 'Full shift on the job.', followUp: '' },
      { id: 'shift-2', name: names[1], status: 'idle', note: idleNote, followUp: '' },
      { id: 'shift-3', name: names[2], status: 'open', note: '', followUp: '' },
      { id: 'shift-4', name: names[3], status: 'down', note: downNote, followUp: '' },
    ],
  }
}

export const shiftSamples: Record<CompanyId, { machines: SampleMachine[] }> = {
  harbour: shift(
    ['Excavator, 20 tonne', 'Tipper', 'Concrete mixer', 'Pump'],
    'No loads after lunch.',
    'Hydraulic leak from midday.',
  ),
  mile12: shift(
    ['Box truck', 'Delivery van', 'Forklift', 'Cold room unit'],
    'The market queue stopped the second run.',
    'The cold room lost power after 3pm.',
  ),
  lekki: shift(
    ['Cutting line', 'Steam press', 'Generator, 100 kVA', 'Boiler'],
    'The line waited on cotton.',
    'The boiler dropped pressure after lunch.',
  ),
  sahel: shift(
    ['Lowbed trailer', 'Curtain trailer', 'Mobile crane', 'Yard tanker'],
    'No return load today.',
    'The tanker would not start after the Kaduna trip.',
  ),
}
