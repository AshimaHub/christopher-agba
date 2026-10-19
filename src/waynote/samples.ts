import type { CompanyId } from '../content/demoCompanies.ts'

type SampleLine = {
  goodsId: string
  sent: number
  conditionSent: 'New' | 'Good' | 'Used' | 'Damaged'
  arrived?: number
  conditionReceived?: 'New' | 'Good' | 'Used' | 'Damaged'
}

export type WaynoteSample = {
  places: { id: string; name: string }[]
  goods: { id: string; name: string; unit: string }[]
  notes: {
    id: string
    number: string
    originId: string
    destinationId: string
    carrier: string
    reference: string
    dispatcherName: string
    status: 'draft' | 'pending' | 'received' | 'disputed' | 'completed'
    lines: SampleLine[]
    created: [number, number]
    sent?: [number, number]
    receipt?: { by: string; at: [number, number]; comment: string }
  }[]
}

const ngozi = 'Ngozi Eze'
const jonah = 'Jonah Hale'
const seyi = 'Seyi Adebanjo'
const halima = 'Halima Yusuf'

export const waynoteSamples: Record<CompanyId, WaynoteSample> = {
  harbour: {
    places: [
      { id: 'yard', name: 'Central Yard' },
      { id: 'harbour', name: 'Harbour Pump Station' },
      { id: 'westline', name: 'Westline Fabrication Bay' },
      { id: 'depot', name: 'North Depot' },
    ],
    goods: [
      { id: 'cement', name: 'Cement', unit: 'bag' },
      { id: 'hose', name: 'Hydraulic hose', unit: 'length' },
      { id: 'gloves', name: 'Safety gloves', unit: 'pair' },
      { id: 'filter', name: 'Diesel filter', unit: 'piece' },
      { id: 'cable', name: 'Cable, 2.5 mm', unit: 'metre' },
      { id: 'paint', name: 'Grey protective paint', unit: 'litre' },
    ],
    notes: [
      { id: 'note-1807', number: 'WN-1807', originId: 'yard', destinationId: 'harbour', carrier: 'Meridian Haulage', reference: 'Cement for the Friday shutdown. Not yet sent.', dispatcherName: ngozi, status: 'draft', lines: [{ goodsId: 'cement', sent: 40, conditionSent: 'Good' }], created: [18, 16] },
      { id: 'note-1805', number: 'WN-1805', originId: 'yard', destinationId: 'westline', carrier: 'Own truck', reference: 'Filters for the night-shift compressors.', dispatcherName: jonah, status: 'pending', lines: [{ goodsId: 'filter', sent: 6, conditionSent: 'New' }], created: [18, 9], sent: [18, 11] },
      { id: 'note-1804', number: 'WN-1804', originId: 'yard', destinationId: 'depot', carrier: 'Own truck', reference: 'Hoses for the depot workshop.', dispatcherName: ngozi, status: 'disputed', lines: [{ goodsId: 'hose', sent: 8, conditionSent: 'Good', arrived: 6, conditionReceived: 'Damaged' }], created: [16, 8], sent: [16, 9], receipt: { by: halima, at: [16, 14], comment: 'Two lengths arrived damaged and were not accepted.' } },
      { id: 'note-1803', number: 'WN-1803', originId: 'yard', destinationId: 'westline', carrier: 'Own truck', reference: 'Paint for the guard rails.', dispatcherName: seyi, status: 'received', lines: [{ goodsId: 'paint', sent: 6, conditionSent: 'New', arrived: 6, conditionReceived: 'New' }], created: [15, 10], sent: [15, 11], receipt: { by: seyi, at: [15, 15], comment: 'Quantity and condition match the note.' } },
      { id: 'note-1801', number: 'WN-1801', originId: 'yard', destinationId: 'harbour', carrier: 'Meridian Haulage', reference: 'Gloves for the pump crew.', dispatcherName: ngozi, status: 'completed', lines: [{ goodsId: 'gloves', sent: 20, conditionSent: 'New', arrived: 20, conditionReceived: 'New' }], created: [13, 9], sent: [13, 10], receipt: { by: halima, at: [13, 16], comment: 'Received in full and closed.' } },
    ],
  },
  mile12: {
    places: [
      { id: 'warehouse', name: 'Central warehouse' },
      { id: 'abuja', name: 'Abuja cold room' },
      { id: 'ikeja', name: 'Ikeja depot' },
      { id: 'onitsha', name: 'Onitsha dispatch' },
    ],
    goods: [
      { id: 'rice', name: 'Rice, 50 kg', unit: 'bag' },
      { id: 'oil', name: 'Vegetable oil', unit: 'keg' },
      { id: 'sugar', name: 'Sugar', unit: 'bag' },
      { id: 'tomato', name: 'Tomato cartons', unit: 'carton' },
      { id: 'water', name: 'Bottled water', unit: 'pack' },
      { id: 'tape', name: 'Packing tape', unit: 'roll' },
    ],
    notes: [
      { id: 'note-1807', number: 'WN-1807', originId: 'warehouse', destinationId: 'abuja', carrier: 'Mile 12 truck', reference: 'Rice for the Friday market. Not yet sent.', dispatcherName: ngozi, status: 'draft', lines: [{ goodsId: 'rice', sent: 40, conditionSent: 'Good' }], created: [18, 16] },
      { id: 'note-1805', number: 'WN-1805', originId: 'warehouse', destinationId: 'ikeja', carrier: 'Own truck', reference: 'Tomato cartons for the night loading.', dispatcherName: jonah, status: 'pending', lines: [{ goodsId: 'tomato', sent: 6, conditionSent: 'New' }], created: [18, 9], sent: [18, 11] },
      { id: 'note-1804', number: 'WN-1804', originId: 'warehouse', destinationId: 'onitsha', carrier: 'Own truck', reference: 'Oil for the Onitsha dispatch.', dispatcherName: ngozi, status: 'disputed', lines: [{ goodsId: 'oil', sent: 8, conditionSent: 'Good', arrived: 6, conditionReceived: 'Damaged' }], created: [16, 8], sent: [16, 9], receipt: { by: halima, at: [16, 14], comment: 'Two kegs arrived leaking and were not accepted.' } },
      { id: 'note-1803', number: 'WN-1803', originId: 'warehouse', destinationId: 'ikeja', carrier: 'Own truck', reference: 'Tape for the Ikeja packing bench.', dispatcherName: seyi, status: 'received', lines: [{ goodsId: 'tape', sent: 6, conditionSent: 'New', arrived: 6, conditionReceived: 'New' }], created: [15, 10], sent: [15, 11], receipt: { by: seyi, at: [15, 15], comment: 'Quantity and condition match the note.' } },
      { id: 'note-1801', number: 'WN-1801', originId: 'warehouse', destinationId: 'abuja', carrier: 'Mile 12 truck', reference: 'Sugar for the Abuja counter.', dispatcherName: ngozi, status: 'completed', lines: [{ goodsId: 'sugar', sent: 20, conditionSent: 'New', arrived: 20, conditionReceived: 'New' }], created: [13, 9], sent: [13, 10], receipt: { by: halima, at: [13, 16], comment: 'Received in full and closed.' } },
    ],
  },
  lekki: {
    places: [
      { id: 'store', name: 'Fabric store' },
      { id: 'cutting', name: 'Cutting floor' },
      { id: 'sewing', name: 'Sewing line B' },
      { id: 'finish', name: 'Finishing room' },
    ],
    goods: [
      { id: 'cotton', name: 'Cotton roll', unit: 'roll' },
      { id: 'elastic', name: 'Elastic', unit: 'roll' },
      { id: 'thread', name: 'Thread cones', unit: 'cone' },
      { id: 'zips', name: 'Zippers', unit: 'pack' },
      { id: 'labels', name: 'Woven labels', unit: 'pack' },
      { id: 'dye', name: 'Fabric dye', unit: 'tin' },
    ],
    notes: [
      { id: 'note-1807', number: 'WN-1807', originId: 'store', destinationId: 'cutting', carrier: 'Factory trolley', reference: 'Cotton for the Friday cut. Not yet sent.', dispatcherName: ngozi, status: 'draft', lines: [{ goodsId: 'cotton', sent: 40, conditionSent: 'Good' }], created: [18, 16] },
      { id: 'note-1805', number: 'WN-1805', originId: 'store', destinationId: 'sewing', carrier: 'Factory trolley', reference: 'Zippers for the night run on line B.', dispatcherName: jonah, status: 'pending', lines: [{ goodsId: 'zips', sent: 6, conditionSent: 'New' }], created: [18, 9], sent: [18, 11] },
      { id: 'note-1804', number: 'WN-1804', originId: 'store', destinationId: 'finish', carrier: 'Factory trolley', reference: 'Elastic for the finishing room.', dispatcherName: ngozi, status: 'disputed', lines: [{ goodsId: 'elastic', sent: 8, conditionSent: 'Good', arrived: 6, conditionReceived: 'Damaged' }], created: [16, 8], sent: [16, 9], receipt: { by: halima, at: [16, 14], comment: 'Two rolls arrived stained and were not accepted.' } },
      { id: 'note-1803', number: 'WN-1803', originId: 'store', destinationId: 'sewing', carrier: 'Factory trolley', reference: 'Dye for the shade check.', dispatcherName: seyi, status: 'received', lines: [{ goodsId: 'dye', sent: 6, conditionSent: 'New', arrived: 6, conditionReceived: 'New' }], created: [15, 10], sent: [15, 11], receipt: { by: seyi, at: [15, 15], comment: 'Quantity and condition match the note.' } },
      { id: 'note-1801', number: 'WN-1801', originId: 'store', destinationId: 'cutting', carrier: 'Factory trolley', reference: 'Thread for the cutting floor.', dispatcherName: ngozi, status: 'completed', lines: [{ goodsId: 'thread', sent: 20, conditionSent: 'New', arrived: 20, conditionReceived: 'New' }], created: [13, 9], sent: [13, 10], receipt: { by: halima, at: [13, 16], comment: 'Received in full and closed.' } },
    ],
  },
  sahel: {
    places: [
      { id: 'yard', name: 'Abuja yard' },
      { id: 'kano', name: 'Kano terminal' },
      { id: 'lagos', name: 'Lagos gate' },
      { id: 'enugu', name: 'Enugu stop' },
    ],
    goods: [
      { id: 'diesel', name: 'Diesel drum', unit: 'drum' },
      { id: 'tarp', name: 'Tarpaulins', unit: 'piece' },
      { id: 'gloves', name: 'Driver gloves', unit: 'pair' },
      { id: 'pads', name: 'Brake pads', unit: 'set' },
      { id: 'straps', name: 'Straps', unit: 'piece' },
      { id: 'oil', name: 'Engine oil', unit: 'litre' },
    ],
    notes: [
      { id: 'note-1807', number: 'WN-1807', originId: 'yard', destinationId: 'kano', carrier: 'Sahel truck', reference: 'Diesel for the Friday departure. Not yet sent.', dispatcherName: ngozi, status: 'draft', lines: [{ goodsId: 'diesel', sent: 40, conditionSent: 'Good' }], created: [18, 16] },
      { id: 'note-1805', number: 'WN-1805', originId: 'yard', destinationId: 'lagos', carrier: 'Own truck', reference: 'Brake pads for the Lagos gate service.', dispatcherName: jonah, status: 'pending', lines: [{ goodsId: 'pads', sent: 6, conditionSent: 'New' }], created: [18, 9], sent: [18, 11] },
      { id: 'note-1804', number: 'WN-1804', originId: 'yard', destinationId: 'enugu', carrier: 'Own truck', reference: 'Tarpaulins for the Enugu stop.', dispatcherName: ngozi, status: 'disputed', lines: [{ goodsId: 'tarp', sent: 8, conditionSent: 'Good', arrived: 6, conditionReceived: 'Damaged' }], created: [16, 8], sent: [16, 9], receipt: { by: halima, at: [16, 14], comment: 'Two tarpaulins arrived torn and were not accepted.' } },
      { id: 'note-1803', number: 'WN-1803', originId: 'yard', destinationId: 'lagos', carrier: 'Own truck', reference: 'Engine oil for the Lagos service bay.', dispatcherName: seyi, status: 'received', lines: [{ goodsId: 'oil', sent: 6, conditionSent: 'New', arrived: 6, conditionReceived: 'New' }], created: [15, 10], sent: [15, 11], receipt: { by: seyi, at: [15, 15], comment: 'Quantity and condition match the note.' } },
      { id: 'note-1801', number: 'WN-1801', originId: 'yard', destinationId: 'kano', carrier: 'Sahel truck', reference: 'Gloves for the Kano drivers.', dispatcherName: ngozi, status: 'completed', lines: [{ goodsId: 'gloves', sent: 20, conditionSent: 'New', arrived: 20, conditionReceived: 'New' }], created: [13, 9], sent: [13, 10], receipt: { by: halima, at: [13, 16], comment: 'Received in full and closed.' } },
    ],
  },
}
