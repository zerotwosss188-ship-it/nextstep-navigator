import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const LABELS = {
  'career-bank': 'Career Bank',
  'bookmarks': 'Bookmarks',
  'quiz': 'Interest Quiz',
  'multimedia': 'Multimedia',
  'success-stories': 'Success Stories',
  'resources': 'Resource Library',
  'admission': 'Admission & Coaching',
  'feedback': 'Feedback',
  'contact': 'Contact Us',
  'about': 'About Us',
}

export default function Breadcrumbs() {
  const { pathname } = useLocation()

  // Don't show breadcrumbs on home
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-navy/5">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <ol className="flex items-center gap-2 text-xs font-semibold text-navy flex-wrap">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-saffron transition"
            >
              <Home size={12} />
              Home
            </Link>
          </li>
          {segments.map((seg, i) => {
            const to = '/' + segments.slice(0, i + 1).join('/')
            const label = LABELS[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
            const isLast = i === segments.length - 1
            return (
              <li key={to} className="flex items-center gap-2">
                <ChevronRight size={12} className="text-navy/40" />
                {isLast ? (
                  <span className="text-saffron font-semibold">{label}</span>
                ) : (
                  <Link to={to} className="hover:text-saffron transition">
                    {label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}