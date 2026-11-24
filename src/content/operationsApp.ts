/** Workflows inside the one operations demonstration. Each keeps its own sample records. */
export const operationsModules = [
  { name: 'Material Requisition', to: '/robes/demo/clearrequest' },
  { name: 'Waynote', to: '/robes/demo/waynote' },
  { name: 'SpendGate', to: '/robes/demo/spendgate' },
  { name: 'Stock Ledger', to: '/robes/demo/siteledger' },
  { name: 'Plant Hire Hours', to: '/robes/demo/hirehours' },
  { name: 'Beneficiaries', to: '/robes/demo/beneficiaries' },
  { name: 'Fuel Issues', to: '/robes/demo/fuelwatch' },
  { name: 'Morning Fleet Board', to: '/robes/demo/fleetboard' },
  { name: 'Shift Close', to: '/robes/demo/plantday' },
  { name: 'Waiting On You', to: '/robes/demo/waiting' },
  { name: 'Repair Log', to: '/robes/demo/repairlog' },
  { name: 'Receive Check', to: '/robes/demo/receivecheck' },
] as const

export const operationsAppEntry = operationsModules[0].to
