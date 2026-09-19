import { TRAIT_TO_CAREERS } from './recommendation'

// Invert TRAIT_TO_CAREERS: for each career, which traits recommend it
const CAREER_TO_TRAITS = {}
for (const [trait, ids] of Object.entries(TRAIT_TO_CAREERS)) {
  ids.forEach((id) => {
    if (!CAREER_TO_TRAITS[id]) CAREER_TO_TRAITS[id] = []
    CAREER_TO_TRAITS[id].push(trait)
  })
}

// Compute a 0-100 match score for a career given the user's trait scores
export function computeCareerMatch(careerId, traitScores) {
  if (!traitScores || Object.keys(traitScores).length === 0) return null

  const matchingTraits = CAREER_TO_TRAITS[careerId] || []
  if (matchingTraits.length === 0) return null

  const topScore = Math.max(...Object.values(traitScores))
  const matchSum = matchingTraits.reduce(
    (sum, trait) => sum + (traitScores[trait] || 0),
    0
  )

  if (matchSum === 0) return null

  // Ratio of career's trait fit vs user's top trait strength
  const ratio = matchSum / topScore

  // Scale to 55-98 range for natural "matches"
  const pct = Math.min(98, Math.round(55 + ratio * 20))

  return {
    score: pct,
    traits: matchingTraits,
  }
}

// Get the match color tier
export function getMatchTier(score) {
  if (score === null) return null
  if (score >= 85) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500' }
  if (score >= 70) return { label: 'Strong', color: 'text-saffron', bg: 'bg-saffron/10', bar: 'bg-saffron' }
  if (score >= 55) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-500/10', bar: 'bg-blue-500' }
  return { label: 'Fair', color: 'text-navy/60', bg: 'bg-navy/5', bar: 'bg-navy/40' }
}