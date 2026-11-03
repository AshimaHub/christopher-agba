import { Route, Routes } from 'react-router-dom'
import { PlantDayDemo } from './PlantDayDemo.tsx'
import { ActivityScreen, MachineScreen, ShiftScreen } from './screens.tsx'

export default function PlantDayEntry() {
  return (
    <Routes>
      <Route element={<PlantDayDemo />}>
        <Route index element={<ShiftScreen />} />
        <Route path="machines/:id" element={<MachineScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
