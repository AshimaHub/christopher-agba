import { Route, Routes } from 'react-router-dom'
import { RepairLogDemo } from './RepairLogDemo.tsx'
import { ActivityScreen, AssetScreen, JobScreen, LogScreen } from './screens.tsx'

export default function RepairLogEntry() {
  return (
    <Routes>
      <Route element={<RepairLogDemo />}>
        <Route index element={<LogScreen />} />
        <Route path="jobs/:id" element={<JobScreen />} />
        <Route path="assets/:id" element={<AssetScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
