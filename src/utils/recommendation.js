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

export function computeResult(answers, quizData) {
  const scores = {}

  answers.forEach((optionIndex, qIndex) => {
    const question = quizData.questions[qIndex]
    if (!question) return
    const option = question.options[optionIndex]
    if (!option) return
    option.traits.forEach((trait) => {
      scores[trait] = (scores[trait] || 0) + 1
    })
  })

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([trait, score]) => ({ trait, score }))

  const topTrait = ranked[0]?.trait || 'analytical'

  const careerIds = TRAIT_TO_CAREERS[topTrait] || []
  const careers = careerIds
    .map((id) => careersData.find((c) => c.id === id))
    .filter(Boolean)

  return {
    topTrait,
    ranked,
    stream: TRAIT_TO_STREAM[topTrait] || 'Explore broadly',
    careers,
    totalScore: ranked.reduce((sum, r) => sum + r.score, 0),
  }
}