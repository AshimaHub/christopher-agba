import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { Load } from './routing/Load.tsx'
import {
  AboutPage,
  BeneficiariesDemo,
  BeneficiariesPage,
  CaseStudyPage,
  ClearRequestDemo,
  ClearRequestPage,
  ContactPage,
  FleetBoardDemo,
  FleetBoardPage,
  FuelWatchDemo,
  FuelWatchPage,
  HireHoursDemo,
  HireHoursPage,
  KnowledgeDeskPage,
  OperationsHubPage,
  PlantDayDemo,
  PlantDayPage,
  ReceiveCheckDemo,
  ReceiveCheckPage,
  RepairLogDemo,
  RepairLogPage,
  RobesContactPage,
  RobesHomePage,
  RobesLeadershipPage,
  RobesSolutionsPage,
  ServicesPage,
  SiteLedgerDemo,
  SiteLedgerPage,
  SolutionsPage,
  SpendGateDemo,
  SpendGatePage,
  WaitingDemo,
  WaitingPage,
  WaynoteDemo,
  WaynotePage,
  WorkPage,
} from './routing/pages.ts'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="robes/demo/clearrequest/*" element={<Load><ClearRequestDemo /></Load>} />
        <Route path="robes/demo/waynote/*" element={<Load><WaynoteDemo /></Load>} />
        <Route path="robes/demo/receivecheck/*" element={<Load><ReceiveCheckDemo /></Load>} />
        <Route path="robes/demo/repairlog/*" element={<Load><RepairLogDemo /></Load>} />
        <Route path="robes/demo/waiting/*" element={<Load><WaitingDemo /></Load>} />
        <Route path="robes/demo/plantday/*" element={<Load><PlantDayDemo /></Load>} />
        <Route path="robes/demo/fleetboard/*" element={<Load><FleetBoardDemo /></Load>} />
        <Route path="robes/demo/fuelwatch/*" element={<Load><FuelWatchDemo /></Load>} />
        <Route path="robes/demo/beneficiaries/*" element={<Load><BeneficiariesDemo /></Load>} />
        <Route path="robes/demo/hirehours/*" element={<Load><HireHoursDemo /></Load>} />
        <Route path="robes/demo/siteledger/*" element={<Load><SiteLedgerDemo /></Load>} />
        <Route path="robes/demo/spendgate/*" element={<Load><SpendGateDemo /></Load>} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="solutions" element={<Load><SolutionsPage /></Load>} />
          <Route path="services" element={<Load><ServicesPage /></Load>} />
          <Route path="work" element={<Load><WorkPage /></Load>} />
          <Route path="case-studies" element={<Load><WorkPage /></Load>} />
          <Route path="work/:slug" element={<Load><CaseStudyPage /></Load>} />
          <Route path="case-studies/:slug" element={<Load><CaseStudyPage /></Load>} />
          <Route path="about" element={<Load><AboutPage /></Load>} />
          <Route path="contact" element={<Load><ContactPage /></Load>} />
          <Route path="robes" element={<Load><RobesHomePage /></Load>} />
          <Route path="robes/solutions" element={<Load><RobesSolutionsPage /></Load>} />
          <Route path="robes/solutions/clearrequest" element={<Load><ClearRequestPage /></Load>} />
          <Route path="robes/solutions/operations-hub" element={<Load><OperationsHubPage /></Load>} />
          <Route path="robes/solutions/knowledgedesk" element={<Load><KnowledgeDeskPage /></Load>} />
          <Route path="robes/solutions/waynote" element={<Load><WaynotePage /></Load>} />
          <Route path="robes/solutions/spendgate" element={<Load><SpendGatePage /></Load>} />
          <Route path="robes/solutions/siteledger" element={<Load><SiteLedgerPage /></Load>} />
          <Route path="robes/solutions/hirehours" element={<Load><HireHoursPage /></Load>} />
          <Route path="robes/solutions/beneficiaries" element={<Load><BeneficiariesPage /></Load>} />
          <Route path="robes/solutions/fuelwatch" element={<Load><FuelWatchPage /></Load>} />
          <Route path="robes/solutions/fleetboard" element={<Load><FleetBoardPage /></Load>} />
          <Route path="robes/solutions/plantday" element={<Load><PlantDayPage /></Load>} />
          <Route path="robes/solutions/waiting" element={<Load><WaitingPage /></Load>} />
          <Route path="robes/solutions/repairlog" element={<Load><RepairLogPage /></Load>} />
          <Route path="robes/solutions/receivecheck" element={<Load><ReceiveCheckPage /></Load>} />
          <Route path="robes/leadership" element={<Load><RobesLeadershipPage /></Load>} />
          <Route path="robes/contact" element={<Load><RobesContactPage /></Load>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
