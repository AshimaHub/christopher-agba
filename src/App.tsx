import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import { WorkPage } from './pages/WorkPage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<CaseStudyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="robes" element={<RobesHomePage />} />
          <Route path="robes/solutions" element={<RobesSolutionsPage />} />
          <Route path="robes/leadership" element={<RobesLeadershipPage />} />
          <Route path="robes/contact" element={<RobesContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
