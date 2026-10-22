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
import { BeneficiariesPage } from './pages/BeneficiariesPage.tsx'
import { FleetBoardPage } from './pages/FleetBoardPage.tsx'
import { PlantDayPage } from './pages/PlantDayPage.tsx'
import { ReceiveCheckPage } from './pages/ReceiveCheckPage.tsx'
import { RepairLogPage } from './pages/RepairLogPage.tsx'
import { WaitingPage } from './pages/WaitingPage.tsx'
import { FuelWatchPage } from './pages/FuelWatchPage.tsx'
import { HireHoursPage } from './pages/HireHoursPage.tsx'
import { SiteLedgerPage } from './pages/SiteLedgerPage.tsx'
import { SpendGatePage } from './pages/SpendGatePage.tsx'
import { WaynotePage } from './pages/WaynotePage.tsx'
import { WorkPage } from './pages/WorkPage.tsx'
import { ReceiveCheckDemo } from './receivecheck/ReceiveCheckDemo.tsx'
import {
  ActivityScreen as ReceiveActivityScreen,
  BillScreen,
  BillsScreen,
} from './receivecheck/screens.tsx'
import { RepairLogDemo } from './repairlog/RepairLogDemo.tsx'
import {
  ActivityScreen as RepairActivityScreen,
  AssetScreen,
  JobScreen,
  LogScreen,
} from './repairlog/screens.tsx'
import { WaitingDemo } from './waiting/WaitingDemo.tsx'
import {
  ActivityScreen as WaitActivityScreen,
  InboxScreen,
  ItemScreen,
} from './waiting/screens.tsx'
import { PlantDayDemo } from './plantday/PlantDayDemo.tsx'
import {
  ActivityScreen as PlantActivityScreen,
  MachineScreen as PlantMachineScreen,
  ShiftScreen,
} from './plantday/screens.tsx'
import { FleetBoardDemo } from './fleetboard/FleetBoardDemo.tsx'
import {
  ActivityScreen as FleetActivityScreen,
  BoardScreen,
  UnitScreen,
} from './fleetboard/screens.tsx'
import { FuelWatchDemo } from './fuelwatch/FuelWatchDemo.tsx'
import {
  ActivityScreen as FuelActivityScreen,
  IssueScreen,
  IssuesScreen as FuelIssuesScreen,
  MachinesScreen,
  OverviewScreen as FuelOverviewScreen,
} from './fuelwatch/screens.tsx'
import { BeneficiariesDemo } from './beneficiaries/BeneficiariesDemo.tsx'
import {
  ActivityScreen as PayeeActivityScreen,
  NewPayeeScreen,
  OverviewScreen as PayeeOverviewScreen,
  PayeeScreen,
  PayeesScreen,
} from './beneficiaries/screens.tsx'
import { HireHoursDemo } from './hirehours/HireHoursDemo.tsx'
import {
  ActivityScreen as HireActivityScreen,
  DayScreen,
  DaysScreen,
  MachineScreen,
  OverviewScreen as HireOverviewScreen,
  PlantScreen,
} from './hirehours/screens.tsx'
import { SiteLedgerDemo } from './siteledger/SiteLedgerDemo.tsx'
import {
  ActivityScreen as LedgerActivityScreen,
  CardScreen,
  IssuesScreen,
  OverviewScreen as LedgerOverviewScreen,
  ReceiptsScreen,
  StockScreen,
} from './siteledger/screens.tsx'
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
        <Route path="robes/demo/receivecheck" element={<ReceiveCheckDemo />}>
          <Route index element={<BillsScreen />} />
          <Route path="bills/:id" element={<BillScreen />} />
          <Route path="activity" element={<ReceiveActivityScreen />} />
        </Route>
        <Route path="robes/demo/repairlog" element={<RepairLogDemo />}>
          <Route index element={<LogScreen />} />
          <Route path="jobs/:id" element={<JobScreen />} />
          <Route path="assets/:id" element={<AssetScreen />} />
          <Route path="activity" element={<RepairActivityScreen />} />
        </Route>
        <Route path="robes/demo/waiting" element={<WaitingDemo />}>
          <Route index element={<InboxScreen />} />
          <Route path="items/:id" element={<ItemScreen />} />
          <Route path="activity" element={<WaitActivityScreen />} />
        </Route>
        <Route path="robes/demo/plantday" element={<PlantDayDemo />}>
          <Route index element={<ShiftScreen />} />
          <Route path="machines/:id" element={<PlantMachineScreen />} />
          <Route path="activity" element={<PlantActivityScreen />} />
        </Route>
        <Route path="robes/demo/fleetboard" element={<FleetBoardDemo />}>
          <Route index element={<BoardScreen />} />
          <Route path="units/:id" element={<UnitScreen />} />
          <Route path="activity" element={<FleetActivityScreen />} />
        </Route>
        <Route path="robes/demo/fuelwatch" element={<FuelWatchDemo />}>
          <Route index element={<FuelOverviewScreen />} />
          <Route path="issues" element={<FuelIssuesScreen />} />
          <Route path="issues/:id" element={<IssueScreen />} />
          <Route path="machines" element={<MachinesScreen />} />
          <Route path="activity" element={<FuelActivityScreen />} />
        </Route>
        <Route path="robes/demo/beneficiaries" element={<BeneficiariesDemo />}>
          <Route index element={<PayeeOverviewScreen />} />
          <Route path="payees" element={<PayeesScreen />} />
          <Route path="payees/new" element={<NewPayeeScreen />} />
          <Route path="payees/:id" element={<PayeeScreen />} />
          <Route path="activity" element={<PayeeActivityScreen />} />
        </Route>
        <Route path="robes/demo/hirehours" element={<HireHoursDemo />}>
          <Route index element={<HireOverviewScreen />} />
          <Route path="plant" element={<PlantScreen />} />
          <Route path="plant/:machineId" element={<MachineScreen />} />
          <Route path="days" element={<DaysScreen />} />
          <Route path="days/:id" element={<DayScreen />} />
          <Route path="activity" element={<HireActivityScreen />} />
        </Route>
        <Route path="robes/demo/siteledger" element={<SiteLedgerDemo />}>
          <Route index element={<LedgerOverviewScreen />} />
          <Route path="stock" element={<StockScreen />} />
          <Route path="stock/:placeId/:itemId" element={<CardScreen />} />
          <Route path="receipts" element={<ReceiptsScreen />} />
          <Route path="issues" element={<IssuesScreen />} />
          <Route path="activity" element={<LedgerActivityScreen />} />
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
          <Route path="robes/solutions/siteledger" element={<SiteLedgerPage />} />
          <Route path="robes/solutions/hirehours" element={<HireHoursPage />} />
          <Route path="robes/solutions/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="robes/solutions/fuelwatch" element={<FuelWatchPage />} />
          <Route path="robes/solutions/fleetboard" element={<FleetBoardPage />} />
          <Route path="robes/solutions/plantday" element={<PlantDayPage />} />
          <Route path="robes/solutions/waiting" element={<WaitingPage />} />
          <Route path="robes/solutions/repairlog" element={<RepairLogPage />} />
          <Route path="robes/solutions/receivecheck" element={<ReceiveCheckPage />} />
          <Route path="robes/leadership" element={<RobesLeadershipPage />} />
          <Route path="robes/contact" element={<RobesContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
