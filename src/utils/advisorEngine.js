import careersData from '../data/careers.json'
import resourcesData from '../data/resources.json'

// Keyword → trait mapping for intent detection
const INTENT_KEYWORDS = {
  coding: ['coding', 'code', 'programming', 'developer', 'software', 'app', 'website', 'web', 'tech'],
  data: ['data', 'analytics', 'statistics', 'ai', 'ml', 'machine learning', 'python', 'sql'],
  medicine: ['doctor', 'medicine', 'medical', 'health', 'patient', 'hospital', 'surgery', 'nurse'],
  helping: ['help', 'helping', 'people', 'counsel', 'therapy', 'psychology', 'care'],
  creative: ['design', 'art', 'creative', 'draw', 'paint', 'visual', 'logo', 'ui', 'ux'],
  writing: ['write', 'writing', 'content', 'blog', 'author', 'copy', 'story'],
  business: ['business', 'entrepreneur', 'startup', 'founder', 'company', 'ceo'],
  money: ['money', 'finance', 'salary', 'rich', 'wealth', 'invest', 'bank', 'accounting', 'ca'],
  teaching: ['teach', 'teacher', 'professor', 'education', 'school', 'students'],
  government: ['government', 'ias', 'civil', 'admin', 'officer', 'bureaucrat', 'policy'],
  engineering: ['engineer', 'mechanical', 'electrical', 'civil', 'machine', 'robot', 'physics'],
  law: ['law', 'lawyer', 'legal', 'court', 'justice'],
}

// Map intent → relevant career IDs
const INTENT_TO_CAREERS = {
  coding: ['software-engineer', 'cybersecurity-analyst', 'data-scientist'],
  data: ['data-scientist', 'software-engineer', 'cybersecurity-analyst'],
  medicine: ['doctor', 'nurse', 'physiotherapist'],
  helping: ['psychologist', 'doctor', 'teacher', 'nurse'],
  creative: ['ux-designer', 'graphic-designer', 'film-director', 'architect'],
  writing: ['content-writer', 'film-director', 'teacher'],
  business: ['entrepreneur', 'marketing-manager', 'hr-manager', 'investment-banker'],
  money: ['chartered-accountant', 'investment-banker', 'entrepreneur'],
  teaching: ['teacher', 'professor', 'psychologist'],
  government: ['ias-officer', 'defence-officer'],
  engineering: ['mechanical-engineer', 'electrical-engineer', 'civil-engineer', 'software-engineer'],
  law: ['ias-officer', 'hr-manager'],
}

// Career-specific response templates
function getCareerResponse(career) {
  return {
    text: `Based on what you shared, **${career.title}** sounds like a strong fit. Here's a quick look:`,
    careers: [career.id],
    resources: null,
  }
}

// Main advisor function
export function getAdvisorResponse(userInput, context = {}) {
  const input = userInput.toLowerCase().trim()
  if (!input) return null

  // Empty or greeting
  if (['hi', 'hello', 'hey', 'help', 'start'].includes(input)) {
    return {
      text: `Hi! I'm your Career Advisor. Tell me what you enjoy or what you're curious about — for example:
• "I love coding and building things"
• "I want to help people"
• "I'm good at math and money"`,
      careers: [],
      resources: null,
    }
  }

  // Salary question
  if (input.includes('salary') || input.includes('earn') || input.includes('pay')) {
    const topPaying = [...careersData]
      .sort((a, b) => b.salaryMax - a.salaryMax)
      .slice(0, 4)
    return {
      text: `Here are the **highest-paying careers** in our bank (senior-level):`,
      careers: topPaying.map((c) => c.id),
      resources: null,
    }
  }

  // Quiz prompt
  if (input.includes('quiz') || input.includes('test') || input.includes('which career')) {
    return {
      text: `The best way to find your match is the **Interest Quiz** — 8 quick questions, 2 minutes. Based on your traits, it recommends a stream and matching careers.`,
      careers: [],
      resources: null,
      cta: { label: 'Take the Quiz', to: '/quiz' },
    }
  }

  // Detect intents
  const matchedIntents = []
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some((kw) => input.includes(kw))) {
      matchedIntents.push(intent)
    }
  }

  if (matchedIntents.length === 0) {
    // Fallback: search careers for keyword match
    const matches = careersData.filter(
      (c) =>
        c.title.toLowerCase().includes(input) ||
        c.industry.toLowerCase().includes(input) ||
        c.description.toLowerCase().includes(input) ||
        c.skills.some((s) => s.toLowerCase().includes(input))
    ).slice(0, 3)

    if (matches.length > 0) {
      return {
        text: `I found ${matches.length} career${matches.length !== 1 ? 's' : ''} matching "${userInput}":`,
        careers: matches.map((c) => c.id),
        resources: null,
      }
    }

    return {
      text: `I'm not sure I got that. Try telling me what you enjoy — like "coding", "helping people", "design", "math", or "writing". Or ask me "what pays well?" or "which career for me?".`,
      careers: [],
      resources: null,
    }
  }

  // Aggregate careers from matched intents
  const careerIds = new Set()
  matchedIntents.forEach((intent) => {
    (INTENT_TO_CAREERS[intent] || []).forEach((id) => careerIds.add(id))
  })

  const topCareers = [...careerIds]
    .map((id) => careersData.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 3)

  // Detect related resources
  const relatedResources = (resourcesData.resources || [])
    .filter((r) => r.category.toLowerCase().includes(matchedIntents[0]))
    .slice(0, 2)

  const intentLabel = matchedIntents[0]
  const text = `Got it — you're into **${intentLabel}**. Here are careers that match that interest well:`

  return {
    text,
    careers: topCareers.map((c) => c.id),
    resources: relatedResources.length > 0 ? relatedResources : null,
  }
}