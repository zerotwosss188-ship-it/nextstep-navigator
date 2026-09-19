import badgesData from '../data/badges.json'
import careersData from '../data/careers.json'

const QUIZ_KEY = 'nsn-quiz-history'

function getQuizHistory() {
  try {
    const raw = localStorage.getItem(QUIZ_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function computeBadges(bookmarks, recentlyViewed) {
  const bookmarkedCareers = careersData.filter((c) => bookmarks.includes(c.id))
  const industries = new Set(bookmarkedCareers.map((c) => c.industry))
  const quizzes = getQuizHistory()

  const unlocked = new Set()

  // Always unlocked (user is logged in)
  unlocked.add('first-step')

  if (bookmarks.length >= 1) unlocked.add('explorer')
  if (bookmarks.length >= 5) unlocked.add('curator')
  if (industries.size >= 3) unlocked.add('voyager')
  if (quizzes.length >= 1) unlocked.add('scholar')
  if (quizzes.length >= 4) unlocked.add('sage')
  if (recentlyViewed.length >= 5) unlocked.add('time-traveler')

  // Master unlocks if 5+ total (excluding master itself)
  if (unlocked.size >= 5) unlocked.add('master')

  return badgesData.badges.map((b) => ({
    ...b,
    unlocked: unlocked.has(b.id),
  }))
}

export function getPassportStats(bookmarks, recentlyViewed) {
  const badges = computeBadges(bookmarks, recentlyViewed)
  const total = badges.length
  const unlocked = badges.filter((b) => b.unlocked).length
  return { badges, total, unlocked }
}