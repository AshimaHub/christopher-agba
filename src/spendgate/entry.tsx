import { Route, Routes } from 'react-router-dom'
import { SpendGateDemo } from './SpendGateDemo.tsx'
import {
  ActivityScreen,
  ClaimDetailScreen,
  ClaimsScreen,
  FinanceScreen,
  FundingScreen,
  NewClaimScreen,
  OverviewScreen,
  ReviewScreen,
} from './screens.tsx'

export default function SpendGateEntry() {
  return (
    <Routes>
      <Route element={<SpendGateDemo />}>
        <Route index element={<OverviewScreen />} />
        <Route path="claims" element={<ClaimsScreen />} />
        <Route path="claims/new" element={<NewClaimScreen />} />
        <Route path="claims/:id" element={<ClaimDetailScreen />} />
        <Route path="review" element={<ReviewScreen />} />
        <Route path="finance" element={<FinanceScreen />} />
        <Route path="funding" element={<FundingScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
