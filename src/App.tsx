import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ClearRequestDemo } from './clearrequest/ClearRequestDemo.tsx'
import {
  ActivityScreen,
  ApprovalsScreen,
  IssuingScreen,
  NewRequestScreen,
  OverviewScreen,
  ReportsScreen,
  RequestDetailScreen,
  RequestsScreen,
} from './clearrequest/screens.tsx'
import { Layout } from './components/Layout.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { CaseStudyPage } from './pages/CaseStudyPage.tsx'
import { ContactPage } from './pages/ContactPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { SolutionsPage } from './pages/SolutionsPage.tsx'
import { RobesContactPage } from './pages/RobesContactPage.tsx'
import { RobesHomePage } from './pages/RobesHomePage.tsx'
import { RobesLeadershipPage } from './pages/RobesLeadershipPage.tsx'
import { RobesSolutionsPage } from './pages/RobesSolutionsPage.tsx'
import { ClearRequestPage } from './pages/ClearRequestPage.tsx'
import { SpendGatePage } from './pages/SpendGatePage.tsx'
import { WaynotePage } from './pages/WaynotePage.tsx'
import { WorkPage } from './pages/WorkPage.tsx'
import { SpendGateDemo } from './spendgate/SpendGateDemo.tsx'
import {
  ActivityScreen as SpendActivityScreen,
  ClaimDetailScreen,
  ClaimsScreen,
  FinanceScreen,
  FundingScreen,
  NewClaimScreen,
  OverviewScreen as SpendOverviewScreen,
  ReviewScreen,
} from './spendgate/screens.tsx'
import { WaynoteDemo } from './waynote/WaynoteDemo.tsx'
import {
  ActivityScreen as WaynoteActivityScreen,
  NewNoteScreen,
  NoteDetailScreen,
  NotesScreen,
  OverviewScreen as WaynoteOverviewScreen,
  ReceiveScreen,
  ReleaseScreen,
  ReportsScreen as WaynoteReportsScreen,
} from './waynote/screens.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="robes/demo/clearrequest" element={<ClearRequestDemo />}>
          <Route index element={<OverviewScreen />} />
          <Route path="requests" element={<RequestsScreen />} />
          <Route path="requests/new" element={<NewRequestScreen />} />
          <Route path="requests/:id" element={<RequestDetailScreen />} />
          <Route path="approvals" element={<ApprovalsScreen />} />
          <Route path="issuing" element={<IssuingScreen />} />
          <Route path="activity" element={<ActivityScreen />} />
          <Route path="reports" element={<ReportsScreen />} />
        </Route>
        <Route path="robes/demo/waynote" element={<WaynoteDemo />}>
          <Route index element={<WaynoteOverviewScreen />} />
          <Route path="notes" element={<NotesScreen />} />
          <Route path="notes/new" element={<NewNoteScreen />} />
          <Route path="notes/:id" element={<NoteDetailScreen />} />
          <Route path="release" element={<ReleaseScreen />} />
          <Route path="receive" element={<ReceiveScreen />} />
          <Route path="activity" element={<WaynoteActivityScreen />} />
          <Route path="reports" element={<WaynoteReportsScreen />} />
        </Route>
        <Route path="robes/demo/spendgate" element={<SpendGateDemo />}>
          <Route index element={<SpendOverviewScreen />} />
          <Route path="claims" element={<ClaimsScreen />} />
          <Route path="claims/new" element={<NewClaimScreen />} />
          <Route path="claims/:id" element={<ClaimDetailScreen />} />
          <Route path="review" element={<ReviewScreen />} />
          <Route path="finance" element={<FinanceScreen />} />
          <Route path="funding" element={<FundingScreen />} />
          <Route path="activity" element={<SpendActivityScreen />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<CaseStudyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="robes" element={<RobesHomePage />} />
          <Route path="robes/solutions" element={<RobesSolutionsPage />} />
          <Route path="robes/solutions/clearrequest" element={<ClearRequestPage />} />
          <Route path="robes/solutions/waynote" element={<WaynotePage />} />
          <Route path="robes/solutions/spendgate" element={<SpendGatePage />} />
          <Route path="robes/leadership" element={<RobesLeadershipPage />} />
          <Route path="robes/contact" element={<RobesContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
