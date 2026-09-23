import { Moon, Sun, MonitorSmartphone } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bookmark, Menu, X, ChevronDown, Search, User } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useBookmarks } from '../context/BookmarkContext'

export default function Navbar() {
  
  const { user } = useUser()
  const { bookmarks } = useBookmarks()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const { dark, mode, cycleMode } = useTheme()

  const navLinkClass = ({ isActive }) =>
    `transition ${isActive ? 'text-saffron' : 'hover:text-saffron'}`

  const exploreLinks = [
    { to: '/multimedia', label: 'Multimedia' },
    { to: '/success-stories', label: 'Success Stories' },
    { to: '/resources', label: 'Resource Library' },
    { to: '/admission', label: 'Admission & Coaching' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/courses', label: 'Courses' },
  ]

  const links = [
    { to: '/', label: 'Home' },
    { to: '/career-bank', label: 'Career Bank' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/courses', label: 'Courses' },
  ]

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent('nsn-open-palette'))
  }

  return (
    <nav className="bg-navy text-white px-4 md:px-6 py-3 md:py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Logo */}
        <Link to="/" className="text-lg md:text-2xl font-heading font-bold whitespace-nowrap shrink-0">
          NextStep <span className="text-saffron">Navigator</span>
        </Link>

        {/* Nav links — desktop only */}
        {user && (
          <ul className="hidden lg:flex gap-5 text-sm font-medium items-center">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={navLinkClass} end={l.to === '/'}>
                  {l.label}
                </NavLink>
              </li>
            ))}

            {/* Explore dropdown */}
            <li className="relative">
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                onBlur={() => setTimeout(() => setExploreOpen(false), 200)}
                className="flex items-center gap-1 hover:text-saffron transition"
              >
                Explore{' '}
                <ChevronDown
                  size={14}
                  className={exploreOpen ? 'rotate-180 transition' : 'transition'}
                />
              </button>
              {exploreOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden py-2 border border-white/60">
                    {exploreLinks.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={() => setExploreOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 text-sm transition ${
                            isActive
                              ? 'bg-saffron/10 text-saffron'
                              : 'text-navy hover:bg-navy/5'
                          }`
                        }
                      >
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li>
              <NavLink to="/bookmarks" className={navLinkClass}>
                <span className="relative inline-flex items-center gap-1.5">
                  <Bookmark size={14} />
                  Bookmarks
                  {bookmarks.length > 0 && (
                    <span className="bg-saffron text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                      {bookmarks.length}
                    </span>
                  )}
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </li>
          </ul>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search icon (desktop) */}
          {user && (
  <button
    onClick={cycleMode}
    className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
    aria-label={`Theme: ${mode}`}
    title={`Mode: ${mode} (click to cycle)`}
  >
    {mode === 'light' && <Sun size={18} />}
    {mode === 'dark' && <Moon size={18} />}
    {mode === 'auto' && <MonitorSmartphone size={18} />}
  </button>
)}
          {user && (
            <>
              <button
                onClick={openPalette}
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-full pl-3 pr-3 py-2 transition-all group w-[180px] lg:w-[240px]"
                aria-label="Open search"
              >
                <Search size={14} className="text-white/60 group-hover:text-saffron transition shrink-0" />
                <span className="text-xs text-white/50 group-hover:text-white/80 transition flex-1 text-left truncate">
                  Search...
                </span>
              </button>

              <button
                onClick={openPalette}
                className="md:hidden w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </>
          )}

          {/* Avatar — VISIBLE ON ALL SCREENS */}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full p-1 md:px-3 md:py-1.5 transition-all cursor-pointer group shrink-0"
              title="View profile"
            >
              <span className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-saffron flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-semibold">Hi, {user.name.split(' ')[0]}</p>
                <p className="text-[10px] text-white/60">{user.greeting}</p>
              </div>
            </Link>
          ) : null}

          {/* Mobile hamburger */}
          {user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && mobileOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-1 bg-navy/95 backdrop-blur-2xl -mx-4 px-4 pb-4">
          {/* Search row */}
          <button
            onClick={() => {
              setMobileOpen(false)
              openPalette()
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition text-left mb-2"
          >
            <Search size={16} className="text-saffron" />
            <span className="text-white/70">Search careers, pages...</span>
          </button>

          {/* Profile — NEW */}
          <NavLink
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive ? 'bg-white/10 text-saffron' : 'hover:bg-white/5'
              }`
            }
          >
            <User size={16} className="text-saffron" />
            <span className="flex-1">My Profile</span>
            <span className="text-[10px] text-white/40">
              {user.name.split(' ')[0]}
            </span>
          </NavLink>

          {/* Other links */}
          {[
            { to: '/', label: 'Home' },
            { to: '/career-bank', label: 'Career Bank' },
            { to: '/quiz', label: 'Quiz' },
            ...exploreLinks,
            { to: '/bookmarks', label: `Bookmarks${bookmarks.length > 0 ? ` (${bookmarks.length})` : ''}` },
            { to: '/about', label: 'About' },
            { to: '/contact', label: 'Contact' },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive ? 'bg-white/10 text-saffron' : 'hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}