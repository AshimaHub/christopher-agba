import { Route, Routes } from 'react-router-dom'
import { ReceiveCheckDemo } from './ReceiveCheckDemo.tsx'
import { ActivityScreen, BillScreen, BillsScreen } from './screens.tsx'

export default function ReceiveCheckEntry() {
  return (
    <Routes>
      <Route element={<ReceiveCheckDemo />}>
        <Route index element={<BillsScreen />} />
        <Route path="bills/:id" element={<BillScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
