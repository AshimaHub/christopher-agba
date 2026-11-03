import { Route, Routes } from 'react-router-dom'
import { FuelWatchDemo } from './FuelWatchDemo.tsx'
import { ActivityScreen, IssueScreen, IssuesScreen, MachinesScreen, OverviewScreen } from './screens.tsx'

export default function FuelWatchEntry() {
  return (
    <Routes>
      <Route element={<FuelWatchDemo />}>
        <Route index element={<OverviewScreen />} />
        <Route path="issues" element={<IssuesScreen />} />
        <Route path="issues/:id" element={<IssueScreen />} />
        <Route path="machines" element={<MachinesScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
