import type { CompanyId } from '../content/demoCompanies.ts'

export type SampleRequest = {
  id: string
  number: string
  projectId: string
  requesterName: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'partial' | 'fulfilled'
  lines: { materialId: string; quantity: number; issued?: number }[]
  created: [number, number]
  decision?: { action: 'approved' | 'rejected'; comment: string; at: [number, number] }
  issues?: { at: [number, number]; lines: { materialId: string; quantity: number }[] }[]
}

export type ClearSample = {
  projects: { id: string; name: string }[]
  materials: { id: string; name: string; unit: string; reorder: number }[]
  stock: { materialId: string; onHand: number }[]
  requests: SampleRequest[]
}

const ada = 'Adaeze Okonkwo'
const jonah = 'Jonah Hale'
const seyi = 'Seyi Adebanjo'

export const clearSamples: Record<CompanyId, ClearSample> = {
  harbour: {
    projects: [
      { id: 'harbour', name: 'Harbour Pump Station' },
      { id: 'westline', name: 'Westline Fabrication Bay' },
      { id: 'depot', name: 'North Depot Refit' },
      { id: 'workshop', name: 'Riverside Workshop' },
    ],
    materials: [
      { id: 'hose', name: 'Hydraulic hose', unit: 'length', reorder: 8 },
      { id: 'gloves', name: 'Safety gloves', unit: 'pair', reorder: 24 },
      { id: 'cement', name: 'Cement', unit: 'bag', reorder: 20 },
      { id: 'cable', name: 'Cable, 2.5 mm', unit: 'metre', reorder: 50 },
      { id: 'bearing', name: 'Bearing set', unit: 'set', reorder: 4 },
      { id: 'filter', name: 'Diesel filter', unit: 'piece', reorder: 6 },
      { id: 'rods', name: 'Welding rods', unit: 'kg', reorder: 8 },
      { id: 'paint', name: 'Grey protective paint', unit: 'litre', reorder: 6 },
    ],
    stock: [
      { materialId: 'hose', onHand: 6 },
      { materialId: 'gloves', onHand: 36 },
      { materialId: 'cement', onHand: 28 },
      { materialId: 'cable', onHand: 140 },
      { materialId: 'bearing', onHand: 2 },
      { materialId: 'filter', onHand: 9 },
      { materialId: 'rods', onHand: 14 },
      { materialId: 'paint', onHand: 7 },
    ],
    requests: [
      { id: 'req-2408', number: 'CR-2408', projectId: 'harbour', requesterName: ada, reason: 'Pump coupling replacement during the Friday shutdown window.', status: 'pending', lines: [{ materialId: 'bearing', quantity: 6 }, { materialId: 'gloves', quantity: 10 }], created: [18, 16] },
      { id: 'req-2407', number: 'CR-2407', projectId: 'westline', requesterName: jonah, reason: 'Filters for the hired compressors before the night shift.', status: 'approved', lines: [{ materialId: 'filter', quantity: 4 }], created: [18, 11], decision: { action: 'approved', comment: 'Approved for the night shift. Issue from central stores.', at: [18, 13] } },
      { id: 'req-2406', number: 'CR-2406', projectId: 'depot', requesterName: jonah, reason: 'Extra cable for a lighting run that is not in this phase.', status: 'rejected', lines: [{ materialId: 'cable', quantity: 80 }], created: [17, 15], decision: { action: 'rejected', comment: 'This phase does not include the lighting run. Resubmit when the variation is agreed.', at: [17, 17] } },
      { id: 'req-2405', number: 'CR-2405', projectId: 'harbour', requesterName: ada, reason: 'Hose replacement on the discharge line. The rest can wait for the next delivery.', status: 'partial', lines: [{ materialId: 'hose', quantity: 8, issued: 4 }], created: [16, 9], decision: { action: 'approved', comment: 'Approved. Issue what is on the shelf and hold the balance.', at: [16, 10] }, issues: [{ at: [16, 14], lines: [{ materialId: 'hose', quantity: 4 }] }] },
      { id: 'req-2404', number: 'CR-2404', projectId: 'workshop', requesterName: seyi, reason: 'Protective paint for the refurbished guard rails.', status: 'fulfilled', lines: [{ materialId: 'paint', quantity: 6, issued: 6 }, { materialId: 'gloves', quantity: 8, issued: 8 }], created: [15, 8], decision: { action: 'approved', comment: 'Approved.', at: [15, 9] }, issues: [{ at: [15, 11], lines: [{ materialId: 'paint', quantity: 6 }, { materialId: 'gloves', quantity: 8 }] }] },
      { id: 'req-2403', number: 'CR-2403', projectId: 'westline', requesterName: ada, reason: 'Welding consumables for the bay door frame.', status: 'pending', lines: [{ materialId: 'rods', quantity: 5 }], created: [18, 8] },
      { id: 'req-2402', number: 'CR-2402', projectId: 'depot', requesterName: seyi, reason: 'Cement for the patching crew.', status: 'fulfilled', lines: [{ materialId: 'cement', quantity: 12, issued: 12 }], created: [14, 10], decision: { action: 'approved', comment: 'Approved against the depot refit.', at: [14, 12] }, issues: [{ at: [14, 15], lines: [{ materialId: 'cement', quantity: 12 }] }] },
    ],
  },
  mile12: {
    projects: [
      { id: 'warehouse', name: 'Mile 12 Warehouse' },
      { id: 'ikeja', name: 'Ikeja Depot' },
      { id: 'abuja', name: 'Abuja Cold Room' },
      { id: 'onitsha', name: 'Onitsha Dispatch' },
    ],
    materials: [
      { id: 'oil', name: 'Vegetable oil', unit: 'keg', reorder: 8 },
      { id: 'bags', name: 'Empty sacks', unit: 'bundle', reorder: 24 },
      { id: 'rice', name: 'Rice, 50 kg', unit: 'bag', reorder: 20 },
      { id: 'water', name: 'Bottled water', unit: 'pack', reorder: 50 },
      { id: 'sugar', name: 'Sugar', unit: 'bag', reorder: 4 },
      { id: 'tomato', name: 'Tomato cartons', unit: 'carton', reorder: 6 },
      { id: 'detergent', name: 'Detergent', unit: 'carton', reorder: 8 },
      { id: 'tape', name: 'Packing tape', unit: 'roll', reorder: 6 },
    ],
    stock: [
      { materialId: 'oil', onHand: 6 },
      { materialId: 'bags', onHand: 36 },
      { materialId: 'rice', onHand: 28 },
      { materialId: 'water', onHand: 140 },
      { materialId: 'sugar', onHand: 2 },
      { materialId: 'tomato', onHand: 9 },
      { materialId: 'detergent', onHand: 14 },
      { materialId: 'tape', onHand: 7 },
    ],
    requests: [
      { id: 'req-2408', number: 'CR-2408', projectId: 'warehouse', requesterName: ada, reason: 'Sugar for the Friday market pack at Mile 12.', status: 'pending', lines: [{ materialId: 'sugar', quantity: 6 }, { materialId: 'bags', quantity: 10 }], created: [18, 16] },
      { id: 'req-2407', number: 'CR-2407', projectId: 'ikeja', requesterName: jonah, reason: 'Tomato cartons for the night loading at Ikeja.', status: 'approved', lines: [{ materialId: 'tomato', quantity: 4 }], created: [18, 11], decision: { action: 'approved', comment: 'Approved for tonight’s loading. Issue from the warehouse.', at: [18, 13] } },
      { id: 'req-2406', number: 'CR-2406', projectId: 'abuja', requesterName: jonah, reason: 'Extra bottled water that is not on this week’s order.', status: 'rejected', lines: [{ materialId: 'water', quantity: 80 }], created: [17, 15], decision: { action: 'rejected', comment: 'This week’s order is already closed. Add it to the next buying list.', at: [17, 17] } },
      { id: 'req-2405', number: 'CR-2405', projectId: 'warehouse', requesterName: ada, reason: 'Oil for the Abuja cold room. The balance can wait for the next truck.', status: 'partial', lines: [{ materialId: 'oil', quantity: 8, issued: 4 }], created: [16, 9], decision: { action: 'approved', comment: 'Approved. Issue what is on the floor and hold the balance.', at: [16, 10] }, issues: [{ at: [16, 14], lines: [{ materialId: 'oil', quantity: 4 }] }] },
      { id: 'req-2404', number: 'CR-2404', projectId: 'onitsha', requesterName: seyi, reason: 'Tape and sacks for the Onitsha dispatch.', status: 'fulfilled', lines: [{ materialId: 'tape', quantity: 6, issued: 6 }, { materialId: 'bags', quantity: 8, issued: 8 }], created: [15, 8], decision: { action: 'approved', comment: 'Approved.', at: [15, 9] }, issues: [{ at: [15, 11], lines: [{ materialId: 'tape', quantity: 6 }, { materialId: 'bags', quantity: 8 }] }] },
      { id: 'req-2403', number: 'CR-2403', projectId: 'ikeja', requesterName: ada, reason: 'Detergent for the Ikeja counter refill.', status: 'pending', lines: [{ materialId: 'detergent', quantity: 5 }], created: [18, 8] },
      { id: 'req-2402', number: 'CR-2402', projectId: 'abuja', requesterName: seyi, reason: 'Rice for the Abuja standing order.', status: 'fulfilled', lines: [{ materialId: 'rice', quantity: 12, issued: 12 }], created: [14, 10], decision: { action: 'approved', comment: 'Approved against the standing order.', at: [14, 12] }, issues: [{ at: [14, 15], lines: [{ materialId: 'rice', quantity: 12 }] }] },
    ],
  },
  lekki: {
    projects: [
      { id: 'cutting', name: 'Cutting floor' },
      { id: 'sewing', name: 'Sewing line B' },
      { id: 'finish', name: 'Finishing room' },
      { id: 'sample', name: 'Sample room' },
    ],
    materials: [
      { id: 'elastic', name: 'Elastic', unit: 'roll', reorder: 8 },
      { id: 'thread', name: 'Thread cones', unit: 'cone', reorder: 24 },
      { id: 'cotton', name: 'Cotton roll', unit: 'roll', reorder: 20 },
      { id: 'labels', name: 'Woven labels', unit: 'pack', reorder: 50 },
      { id: 'dye', name: 'Fabric dye', unit: 'tin', reorder: 4 },
      { id: 'zips', name: 'Zippers', unit: 'pack', reorder: 6 },
      { id: 'buttons', name: 'Buttons', unit: 'gross', reorder: 8 },
      { id: 'oil', name: 'Machine oil', unit: 'litre', reorder: 6 },
    ],
    stock: [
      { materialId: 'elastic', onHand: 6 },
      { materialId: 'thread', onHand: 36 },
      { materialId: 'cotton', onHand: 28 },
      { materialId: 'labels', onHand: 140 },
      { materialId: 'dye', onHand: 2 },
      { materialId: 'zips', onHand: 9 },
      { materialId: 'buttons', onHand: 14 },
      { materialId: 'oil', onHand: 7 },
    ],
    requests: [
      { id: 'req-2408', number: 'CR-2408', projectId: 'cutting', requesterName: ada, reason: 'Dye for the Friday shade match on the cutting floor.', status: 'pending', lines: [{ materialId: 'dye', quantity: 6 }, { materialId: 'thread', quantity: 10 }], created: [18, 16] },
      { id: 'req-2407', number: 'CR-2407', projectId: 'sewing', requesterName: jonah, reason: 'Zippers for sewing line B before the night run.', status: 'approved', lines: [{ materialId: 'zips', quantity: 4 }], created: [18, 11], decision: { action: 'approved', comment: 'Approved for the night run. Issue from the fabric store.', at: [18, 13] } },
      { id: 'req-2406', number: 'CR-2406', projectId: 'finish', requesterName: jonah, reason: 'Extra labels for a buyer change that is not on this order.', status: 'rejected', lines: [{ materialId: 'labels', quantity: 80 }], created: [17, 15], decision: { action: 'rejected', comment: 'That buyer change is not confirmed. Resubmit when the order is revised.', at: [17, 17] } },
      { id: 'req-2405', number: 'CR-2405', projectId: 'cutting', requesterName: ada, reason: 'Elastic for the waistband run. The rest can wait for the next delivery.', status: 'partial', lines: [{ materialId: 'elastic', quantity: 8, issued: 4 }], created: [16, 9], decision: { action: 'approved', comment: 'Approved. Issue what is on the shelf and hold the balance.', at: [16, 10] }, issues: [{ at: [16, 14], lines: [{ materialId: 'elastic', quantity: 4 }] }] },
      { id: 'req-2404', number: 'CR-2404', projectId: 'sample', requesterName: seyi, reason: 'Machine oil and thread for the sample room.', status: 'fulfilled', lines: [{ materialId: 'oil', quantity: 6, issued: 6 }, { materialId: 'thread', quantity: 8, issued: 8 }], created: [15, 8], decision: { action: 'approved', comment: 'Approved.', at: [15, 9] }, issues: [{ at: [15, 11], lines: [{ materialId: 'oil', quantity: 6 }, { materialId: 'thread', quantity: 8 }] }] },
      { id: 'req-2403', number: 'CR-2403', projectId: 'sewing', requesterName: ada, reason: 'Buttons for the line B shirt order.', status: 'pending', lines: [{ materialId: 'buttons', quantity: 5 }], created: [18, 8] },
      { id: 'req-2402', number: 'CR-2402', projectId: 'finish', requesterName: seyi, reason: 'Cotton for the finishing room recut.', status: 'fulfilled', lines: [{ materialId: 'cotton', quantity: 12, issued: 12 }], created: [14, 10], decision: { action: 'approved', comment: 'Approved against the recut.', at: [14, 12] }, issues: [{ at: [14, 15], lines: [{ materialId: 'cotton', quantity: 12 }] }] },
    ],
  },
  sahel: {
    projects: [
      { id: 'abuja', name: 'Abuja yard' },
      { id: 'kano', name: 'Kano terminal' },
      { id: 'lagos', name: 'Lagos gate' },
      { id: 'enugu', name: 'Enugu stop' },
    ],
    materials: [
      { id: 'tarp', name: 'Tarpaulins', unit: 'piece', reorder: 8 },
      { id: 'gloves', name: 'Driver gloves', unit: 'pair', reorder: 24 },
      { id: 'diesel', name: 'Diesel drum', unit: 'drum', reorder: 20 },
      { id: 'straps', name: 'Straps', unit: 'piece', reorder: 50 },
      { id: 'belts', name: 'Fan belts', unit: 'piece', reorder: 4 },
      { id: 'pads', name: 'Brake pads', unit: 'set', reorder: 6 },
      { id: 'tyres', name: 'Tyres', unit: 'piece', reorder: 8 },
      { id: 'oil', name: 'Engine oil', unit: 'litre', reorder: 6 },
    ],
    stock: [
      { materialId: 'tarp', onHand: 6 },
      { materialId: 'gloves', onHand: 36 },
      { materialId: 'diesel', onHand: 28 },
      { materialId: 'straps', onHand: 140 },
      { materialId: 'belts', onHand: 2 },
      { materialId: 'pads', onHand: 9 },
      { materialId: 'tyres', onHand: 14 },
      { materialId: 'oil', onHand: 7 },
    ],
    requests: [
      { id: 'req-2408', number: 'CR-2408', projectId: 'abuja', requesterName: ada, reason: 'Fan belts for the Friday truck service at Abuja yard.', status: 'pending', lines: [{ materialId: 'belts', quantity: 6 }, { materialId: 'gloves', quantity: 10 }], created: [18, 16] },
      { id: 'req-2407', number: 'CR-2407', projectId: 'kano', requesterName: jonah, reason: 'Brake pads for the Kano trucks before the night departure.', status: 'approved', lines: [{ materialId: 'pads', quantity: 4 }], created: [18, 11], decision: { action: 'approved', comment: 'Approved for the night departure. Issue from the yard store.', at: [18, 13] } },
      { id: 'req-2406', number: 'CR-2406', projectId: 'lagos', requesterName: jonah, reason: 'Extra straps for a load that is not on this manifest.', status: 'rejected', lines: [{ materialId: 'straps', quantity: 80 }], created: [17, 15], decision: { action: 'rejected', comment: 'That load is not on the manifest. Resubmit when the trip is booked.', at: [17, 17] } },
      { id: 'req-2405', number: 'CR-2405', projectId: 'abuja', requesterName: ada, reason: 'Tarpaulins for the open trailers. The rest can wait for the next delivery.', status: 'partial', lines: [{ materialId: 'tarp', quantity: 8, issued: 4 }], created: [16, 9], decision: { action: 'approved', comment: 'Approved. Issue what is in the store and hold the balance.', at: [16, 10] }, issues: [{ at: [16, 14], lines: [{ materialId: 'tarp', quantity: 4 }] }] },
      { id: 'req-2404', number: 'CR-2404', projectId: 'enugu', requesterName: seyi, reason: 'Engine oil and gloves for the Enugu stop.', status: 'fulfilled', lines: [{ materialId: 'oil', quantity: 6, issued: 6 }, { materialId: 'gloves', quantity: 8, issued: 8 }], created: [15, 8], decision: { action: 'approved', comment: 'Approved.', at: [15, 9] }, issues: [{ at: [15, 11], lines: [{ materialId: 'oil', quantity: 6 }, { materialId: 'gloves', quantity: 8 }] }] },
      { id: 'req-2403', number: 'CR-2403', projectId: 'kano', requesterName: ada, reason: 'Tyres for the Kano terminal changeover.', status: 'pending', lines: [{ materialId: 'tyres', quantity: 5 }], created: [18, 8] },
      { id: 'req-2402', number: 'CR-2402', projectId: 'lagos', requesterName: seyi, reason: 'Diesel drums for the Lagos gate pumps.', status: 'fulfilled', lines: [{ materialId: 'diesel', quantity: 12, issued: 12 }], created: [14, 10], decision: { action: 'approved', comment: 'Approved against the gate pumps.', at: [14, 12] }, issues: [{ at: [14, 15], lines: [{ materialId: 'diesel', quantity: 12 }] }] },
    ],
  },
}
