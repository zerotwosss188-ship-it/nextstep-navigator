import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import Navbar from './components/Navbar'
import Breadcrumbs from './components/Breadcrumbs'
import ScrollToTop from './components/ScrollToTop'
import SkipLink from './components/SkipLink'
import Footer from './components/Footer'
import CompareBar from './components/CompareBar'
import ProtectedRoute from './components/ProtectedRoute'
import SwipeNavigator from './components/SwipeNavigator'
import SwipeHint from './components/SwipeHint'
import CommandPalette from './components/CommandPalette'
import AdvisorChat from './components/AdvisorChat'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'

const CareerBank = lazy(() => import('./pages/CareerBank'))
const Bookmarks = lazy(() => import('./pages/Bookmarks'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Multimedia = lazy(() => import('./pages/Multimedia'))
const SuccessStories = lazy(() => import('./pages/SuccessStories'))
const ResourceLibrary = lazy(() => import('./pages/ResourceLibrary'))
const Admission = lazy(() => import('./pages/Admission'))
const Feedback = lazy(() => import('./pages/Feedback'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const Profile = lazy(() => import('./pages/Profile'))
const Compare = lazy(() => import('./pages/Compare'))
const Courses = lazy(() => import('./pages/Courses'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-navy/10 border-t-saffron rounded-full animate-spin" />
        <p className="text-xs text-navy/40 font-medium">Loading…</p>
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="animate-page-in">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/career-bank" element={<ProtectedRoute><CareerBank /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/multimedia" element={<ProtectedRoute><Multimedia /></ProtectedRoute>} />
        <Route path="/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourceLibrary /></ProtectedRoute>} />
        <Route path="/admission" element={<ProtectedRoute><Admission /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
        <Route path="*" element={
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
            <h1 className="font-heading font-bold text-6xl text-navy mb-4">404</h1>
            <p className="text-navy/60 mb-8">This page doesn't exist.</p>
            <a href="/" className="bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-xl transition">
              Go Home
            </a>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('nsn-intro-shown')
    }
    return true
  })

  const handleLoaderComplete = () => {
    sessionStorage.setItem('nsn-intro-shown', 'true')
    setLoading(false)
  }

  return (
    <BrowserRouter>
      {loading && <LoadingScreen onComplete={handleLoaderComplete} duration={600} />}
      {!loading && (
        <>
          <ScrollToTop />
          <SwipeNavigator />
          <SwipeHint />
          <SkipLink />
          <div className="min-h-screen flex flex-col bg-offwhite">
            <Navbar />
            <Breadcrumbs />
            <main id="main-content" className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
              </Suspense>
            </main>
            <Footer />
            <CompareBar />
            <CommandPalette />
            <AdvisorChat />
          </div>
        </>
      )}
    </BrowserRouter>
  )
}