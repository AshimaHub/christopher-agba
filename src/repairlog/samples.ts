import type { CompanyId } from '../content/demoCompanies.ts'

export type JobStatus = 'draft' | 'open' | 'scheduled' | 'closed'
export type FixKind = 'temporary' | 'proper'

export type SampleAsset = { id: string; name: string }

export type SampleJob = {
  id: string
  number: string
  assetId: string
  fault: string
  opened: string
  status: JobStatus
  fixKind?: FixKind
  fix?: string
  cost?: number
  by?: string
}

function book(assets: [string, string, string], faults: [string, string, string], fixes: [string, string], costs: [number, number]): { assets: SampleAsset[]; jobs: SampleJob[] } {
  return {
    assets: [
      { id: 'asset-1', name: assets[0] },
      { id: 'asset-2', name: assets[1] },
      { id: 'asset-3', name: assets[2] },
    ],
    jobs: [
      {
        id: 'job-14',
        number: 'RL-14',
        assetId: 'asset-1',
        fault: faults[0],
        opened: '2026-10-12',
        status: 'closed',
        fixKind: 'temporary',
        fix: fixes[0],
        cost: costs[0],
        by: 'Jonah Hale',
      },
      {
        id: 'job-18',
        number: 'RL-18',
        assetId: 'asset-2',
        fault: faults[1],
        opened: '2026-10-14',
        status: 'closed',
        fixKind: 'proper',
        fix: fixes[1],
        cost: costs[1],
        by: 'Jonah Hale',
      },
      {
        id: 'job-22',
        number: 'RL-22',
        assetId: 'asset-1',
        fault: faults[2],
        opened: '2026-10-22',
        status: 'draft',
      },
    ],
  }
}

export const repairSamples: Record<CompanyId, { assets: SampleAsset[]; jobs: SampleJob[] }> = {
  harbour: book(
    ['Concrete pump', 'Excavator', 'Concrete mixer'],
    ['Hydraulic leak', 'Loose track pin', 'Hydraulic leak'],
    ['Clamped the split hose', 'Fitted a new track pin'],
    [45000, 180000],
  ),
  mile12: book(
    ['Cold-room compressor', 'Forklift', 'Delivery van'],
    ['Gas leak at the seal', 'Worn mast chain', 'Gas leak at the seal'],
    ['Tightened the seal', 'Fitted a new chain'],
    [28000, 96000],
  ),
  lekki: book(
    ['Cutting machine', 'Workshop generator', 'Sewing motor'],
    ['Belt slip on the cutter', 'Generator will not start', 'Belt slip on the cutter'],
    ['Tightened the belt', 'Replaced the starter'],
    [15000, 74000],
  ),
  sahel: book(
    ['Trailer TR-4', 'Yard forklift', 'Workshop compressor'],
    ['Air leak on the trailer', 'Forklift steering play', 'Air leak on the trailer'],
    ['Plugged the airline', 'Replaced the joint'],
    [32000, 110000],
  ),
}
