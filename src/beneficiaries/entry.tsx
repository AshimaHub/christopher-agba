import { Route, Routes } from 'react-router-dom'
import { BeneficiariesDemo } from './BeneficiariesDemo.tsx'
import { ActivityScreen, NewPayeeScreen, OverviewScreen, PayeeScreen, PayeesScreen } from './screens.tsx'

export default function BeneficiariesEntry() {
  return (
    <Routes>
      <Route element={<BeneficiariesDemo />}>
        <Route index element={<OverviewScreen />} />
        <Route path="payees" element={<PayeesScreen />} />
        <Route path="payees/new" element={<NewPayeeScreen />} />
        <Route path="payees/:id" element={<PayeeScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
