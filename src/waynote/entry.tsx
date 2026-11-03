import { Route, Routes } from 'react-router-dom'
import { WaynoteDemo } from './WaynoteDemo.tsx'
import {
  ActivityScreen,
  NewNoteScreen,
  NoteDetailScreen,
  NotesScreen,
  OverviewScreen,
  ReceiveScreen,
  ReleaseScreen,
  ReportsScreen,
} from './screens.tsx'

export default function WaynoteEntry() {
  return (
    <Routes>
      <Route element={<WaynoteDemo />}>
        <Route index element={<OverviewScreen />} />
        <Route path="notes" element={<NotesScreen />} />
        <Route path="notes/new" element={<NewNoteScreen />} />
        <Route path="notes/:id" element={<NoteDetailScreen />} />
        <Route path="release" element={<ReleaseScreen />} />
        <Route path="receive" element={<ReceiveScreen />} />
        <Route path="activity" element={<ActivityScreen />} />
        <Route path="reports" element={<ReportsScreen />} />
      </Route>
    </Routes>
  )
}
