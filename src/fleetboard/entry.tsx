import { Route, Routes } from 'react-router-dom'
import { FleetBoardDemo } from './FleetBoardDemo.tsx'
import { ActivityScreen, BoardScreen, UnitScreen } from './screens.tsx'

export default function FleetBoardEntry() {
  return (
    <Routes>
      <Route element={<FleetBoardDemo />}>
        <Route index element={<BoardScreen />} />
        <Route path="units/:id" element={<UnitScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
