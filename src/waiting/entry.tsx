import { Route, Routes } from 'react-router-dom'
import { WaitingDemo } from './WaitingDemo.tsx'
import { ActivityScreen, InboxScreen, ItemScreen } from './screens.tsx'

export default function WaitingEntry() {
  return (
    <Routes>
      <Route element={<WaitingDemo />}>
        <Route index element={<InboxScreen />} />
        <Route path="items/:id" element={<ItemScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
      </Route>
    </Routes>
  )
}
