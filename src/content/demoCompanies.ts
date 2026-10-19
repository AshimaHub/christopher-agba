export const demoCompanies = [
  { id: 'harbour', name: 'Harbour Works', trade: 'Construction' },
  { id: 'mile12', name: 'Mile 12 Provisions', trade: 'Distribution' },
  { id: 'lekki', name: 'Lekki Stitch', trade: 'Manufacturing' },
  { id: 'sahel', name: 'Sahel Haulage', trade: 'Logistics' },
] as const

export type CompanyId = (typeof demoCompanies)[number]['id']

export function isCompanyId(value: unknown): value is CompanyId {
  return demoCompanies.some((company) => company.id === value)
}

export function demoCompany(id: CompanyId) {
  return demoCompanies.find((company) => company.id === id) ?? demoCompanies[0]
}
