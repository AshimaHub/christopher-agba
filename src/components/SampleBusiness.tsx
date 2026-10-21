import { demoCompanies, type CompanyId } from '../content/demoCompanies.ts'

export function SampleBusiness({ value, onChange }: { value: CompanyId; onChange: (id: CompanyId) => void }) {
  return (
    <label className="min-w-0">
      <span className="sr-only">Sample business</span>
      <select
        className="h-10 max-w-56 rounded-full border border-line bg-white/80 px-3 text-sm text-ink dark:bg-white/5"
        aria-label="Sample business"
        value={value}
        onChange={(event) => onChange(event.target.value as CompanyId)}
      >
        {demoCompanies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </label>
  )
}
