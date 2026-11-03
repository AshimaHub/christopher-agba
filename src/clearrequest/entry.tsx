import { Route, Routes } from 'react-router-dom'
import { ClearRequestDemo } from './ClearRequestDemo.tsx'
import {
  ActivityScreen,
  ApprovalsScreen,
  IssuingScreen,
  NewRequestScreen,
  OverviewScreen,
  ReportsScreen,
  RequestDetailScreen,
  RequestsScreen,
} from './screens.tsx'

export default function ClearRequestEntry() {
  return (
    <Routes>
      <Route element={<ClearRequestDemo />}>
        <Route index element={<OverviewScreen />} />
        <Route path="requests" element={<RequestsScreen />} />
        <Route path="requests/new" element={<NewRequestScreen />} />
        <Route path="requests/:id" element={<RequestDetailScreen />} />
        <Route path="approvals" element={<ApprovalsScreen />} />
        <Route path="issuing" element={<IssuingScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
        <Route path="reports" element={<ReportsScreen />} />
      </Route>
    </Routes>
  )
}
