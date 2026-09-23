import careersData from '../data/careers.json'

export const TRAIT_TO_STREAM = {
  analytical: 'Science / Engineering / Data',
  building: 'Engineering / Technology',
  logic: 'Science / Technology / Commerce',
  research: 'Science / Academia / Healthcare',
  helping: 'Healthcare / Education / Social Work',
  creative: 'Arts / Design / Media',
  communication: 'Business / Media / Law',
  leadership: 'Business / Management / Entrepreneurship',
}

export const TRAIT_TO_CAREERS = {
  analytical: ['data-scientist', 'chartered-accountant', 'investment-banker', 'civil-engineer'],
  building: ['software-engineer', 'civil-engineer', 'mechanical-engineer', 'architect'],
  logic: ['software-engineer', 'data-scientist', 'electrical-engineer', 'chartered-accountant'],
  research: ['doctor', 'professor', 'data-scientist', 'psychologist'],
  helping: ['doctor', 'nurse', 'teacher', 'psychologist', 'physiotherapist'],
  creative: ['graphic-designer', 'ux-designer', 'content-writer', 'film-director', 'architect'],
  communication: ['marketing-manager', 'hr-manager', 'content-writer', 'teacher'],
  leadership: ['entrepreneur', 'ias-officer', 'investment-banker', 'defence-officer', 'marketing-manager'],
}

// Trait synergy — pairs that amplify each other
const TRAIT_SYNERGY = {
  'analytical+logic': 1.15,
  'building+creative': 1.12,
  'helping+communication': 1.18,
  'research+analytical': 1.15,
  'leadership+communication': 1.20,
  'creative+communication': 1.10,
  'logic+building': 1.12,
  'research+helping': 1.15,
}

export function computeResult(answers, quizData) {
  const scores = {}

  answers.forEach((optionIndex, qIndex) => {
    const question = quizData.questions[qIndex]
    if (!question) return
    const option = question.options[optionIndex]
    if (!option) return

    // Weighted scoring: primary trait gets 2x, secondary gets 1x
    option.traits.forEach((trait, idx) => {
      const weight = idx === 0 ? 2 : 1
      scores[trait] = (scores[trait] || 0) + weight
    })
  })

  // Apply synergy bonuses
  const entries = Object.entries(scores)
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const key1 = `${entries[i][0]}+${entries[j][0]}`
      const key2 = `${entries[j][0]}+${entries[i][0]}`
      const multiplier = TRAIT_SYNERGY[key1] || TRAIT_SYNERGY[key2]
      if (multiplier) {
        scores[entries[i][0]] *= multiplier
        scores[entries[j][0]] *= multiplier
      }
    }
  }

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([trait, score]) => ({ trait, score: Math.round(score * 10) / 10 }))

  // Use TOP 3 traits to find careers (not just top 1)
  const topTraits = ranked.slice(0, 3).map((r) => r.trait)
  const careerCount = {}
  topTraits.forEach((trait, idx) => {
    const weight = idx === 0 ? 3 : idx === 1 ? 2 : 1
    ;(TRAIT_TO_CAREERS[trait] || []).forEach((id) => {
      careerCount[id] = (careerCount[id] || 0) + weight
    })
  })

  const careerIds = Object.entries(careerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id)

  const careers = careerIds
    .map((id) => careersData.find((c) => c.id === id))
    .filter(Boolean)

  const topTrait = ranked[0]?.trait || 'analytical'
  const totalScore = ranked.reduce((sum, r) => sum + r.score, 0)

  return {
    topTrait,
    topTraits,
    ranked,
    stream: TRAIT_TO_STREAM[topTrait] || 'Explore broadly',
    careers,
    totalScore,
  }
}