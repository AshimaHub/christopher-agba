import { Route, Routes } from 'react-router-dom'
import { HireHoursDemo } from './HireHoursDemo.tsx'
import { ActivityScreen, DayScreen, DaysScreen, MachineScreen, OverviewScreen, PlantScreen } from './screens.tsx'

export default function HireHoursEntry() {
  return (
    <Routes>
      <Route element={<HireHoursDemo />}>
        <Route index element={<OverviewScreen />} />
        <Route path="plant" element={<PlantScreen />} />
        <Route path="plant/:machineId" element={<MachineScreen />} />
        <Route path="days" element={<DaysScreen />} />
        <Route path="days/:id" element={<DayScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
