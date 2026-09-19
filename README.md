# NextStep Navigator — Your Guide to the Future

A fully static, responsive Single-Page Application (SPA) for career guidance — built for students (Grades 8–12), graduates, and working professionals.

**Category:** Responsive NextGen Website Development  
**Theme:** Career Passport

---

## 🚀 Live Demo

- **Local:** `npm run dev` → http://localhost:5173
- **Live (optional):** [your-deployed-url]

---

## ✨ Features

- **User Type Selection** — Personalized dashboard for students / graduates / professionals
- **Career Bank** — 24 careers across 7 industries with filter, sort, search, and detail modal
- **Interest-Based Quiz** — 4 quiz tracks (Science, Commerce, Arts, Technology) × 8 questions each, with trait-based stream & career recommendation
- **Multimedia Guidance** — Videos & podcasts filterable by category
- **Success Stories** — 12 real journeys across 9 domains
- **Resource Library** — 20 resources grouped as Articles / eBooks / Checklists / Webinars
- **Admission & Coaching** — Accordion guides on stream selection, study abroad, interviews, resumes
- **Bookmarking System** — Save careers + add personal notes + export as .txt + share via Web Share API
- **Recently Viewed** — Auto-tracked, shown on Bookmarks page
- **Feedback Form** — With validation and confirmation screen
- **Contact** — Team info + Google Maps embed
- **About** — Mission, values, tech stack transparency
- **UI Features** — Breadcrumbs, live clock, visitor counter, geolocation, related content suggestions
- **PWA** — Installable, offline-capable
- **Fully Responsive** — Mobile → tablet → desktop
- **Accessibility** — Skip-to-content, ARIA labels, keyboard nav, reduced-motion support

---

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v3 (custom design system) |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | React Context + localStorage + sessionStorage |
| Data | Static JSON files (no backend, no DB) |
| Fonts | Google Fonts — Sora (headings), Inter (body) |

---

## 📁 Project Structure

```
nextstep-navigator/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Breadcrumbs.jsx
│   │   ├── Clock.jsx
│   │   ├── VisitorCounter.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── SkipLink.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CareerBank.jsx
│   │   ├── Quiz.jsx
│   │   ├── Multimedia.jsx
│   │   ├── SuccessStories.jsx
│   │   ├── ResourceLibrary.jsx
│   │   ├── Admission.jsx
│   │   ├── Feedback.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── Contact.jsx
│   │   └── About.jsx
│   ├── context/
│   │   ├── UserContext.jsx
│   │   └── BookmarkContext.jsx
│   ├── data/
│   │   ├── careers.json       # 24 careers
│   │   ├── quiz.json          # 4 quizzes × 8 questions
│   │   ├── stories.json       # 12 success stories
│   │   ├── media.json         # 12 videos/podcasts
│   │   └── resources.json     # 20 resources
│   ├── utils/
│   │   └── recommendation.js  # Quiz scoring engine
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 💻 Installation

### Prerequisites
- **Node.js 20+** — https://nodejs.org
- **npm** (comes with Node)
- Modern browser (Chrome, Firefox, Edge, Safari)

### Steps

```bash
# 1. Clone or extract the project
cd nextstep-navigator

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev
# → opens at http://localhost:5173

# 4. Build for production
npm run build
# → creates /dist folder

# 5. Preview production build
npm run preview
```

---

## ⚙️ Assumptions

1. **No backend** — All data is served from static JSON files in `src/data/`. No server storage, per SRS constraints.
2. **Session-only user data** — User info is stored in `sessionStorage`; clears when tab closes.
3. **Bookmarks & notes** — Stored in `localStorage`; persist across sessions on the same device.
4. **Placeholder YouTube IDs** — `media.json` uses placeholder video IDs. Replace with real IDs for production.
5. **Geolocation** — May be blocked on `http://localhost` by some browsers. Works on HTTPS.
6. **Google Maps** — Requires internet; shows Newyork as placeholder office.
7. **Feedback form** — Does not submit anywhere (as specified in SRS); shows a confirmation screen only.

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Navy | `#0B1E3F` | Primary text, navbar, footers |
| Saffron | `#FF8A00` | CTAs, accents, active state |
| Teal | `#00C2A8` | Secondary accents, success |
| Off-white | `#F7F9FC` | Page background |
| Heading font | Sora | All H1–H6 |
| Body font | Inter | Paragraphs, UI text |

---

## 🤖 AI Tools Used

- **Claude (Anthropic)** — Used as a **learning and debugging aid only**. All code was written and understood by the developer; no code was copied blindly.
- **No AI-generated images are included** — All graphics are emoji + Lucide SVG icons.
- **Avatars in Success Stories** — Placeholder service `i.pravatar.cc` (free, attribution-free).

**Note:** No third-party templates, boilerplates, or ThemeForest themes were used. All UI is hand-built.

---

## 📋 SRS Compliance

Every requirement from the SRS (v1.0) is implemented:

- ✅ Landing page with user type selection
- ✅ Career Bank with filter / sort / search
- ✅ Interest-based quiz with recommendations
- ✅ Multimedia guidance (videos + podcasts)
- ✅ Success stories
- ✅ Resource library
- ✅ Feedback form
- ✅ Admission & Coaching section
- ✅ Contact Us with Google Maps
- ✅ About Us
- ✅ Bookmarking system with notes + export + share
- ✅ Recently viewed tracking
- ✅ Related content suggestions
- ✅ Personalized greeting
- ✅ Simulated visitor counter
- ✅ Real-time clock
- ✅ Geolocation
- ✅ Breadcrumb navigation
- ✅ Dummy login/signup buttons
- ✅ Fully responsive
- ✅ No server storage

---

## 📜 License

Educational project. Free to use and modify.

---

**Built with ❤️ for students everywhere.**