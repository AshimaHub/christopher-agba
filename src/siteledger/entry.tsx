import { Route, Routes } from 'react-router-dom'
import { SiteLedgerDemo } from './SiteLedgerDemo.tsx'
import { ActivityScreen, CardScreen, IssuesScreen, OverviewScreen, ReceiptsScreen, StockScreen } from './screens.tsx'

export default function SiteLedgerEntry() {
  return (
    <Routes>
      <Route element={<SiteLedgerDemo />}>
        <Route index element={<OverviewScreen />} />
        <Route path="stock" element={<StockScreen />} />
        <Route path="stock/:placeId/:itemId" element={<CardScreen />} />
        <Route path="receipts" element={<ReceiptsScreen />} />
        <Route path="issues" element={<IssuesScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
