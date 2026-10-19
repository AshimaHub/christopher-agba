import { demoCompanies, type CompanyId } from '../content/demoCompanies.ts'

export function SampleBusiness({ value, onChange }: { value: CompanyId; onChange: (id: CompanyId) => void }) {
  return (
    <label className="grid min-w-56 gap-1 text-xs text-muted">
      Sample business
      <select className="field" aria-label="Sample business" value={value} onChange={(event) => onChange(event.target.value as CompanyId)}>
        {demoCompanies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name} · {company.trade}
          </option>
        ))}
      </select>
    </label>
  )
}
