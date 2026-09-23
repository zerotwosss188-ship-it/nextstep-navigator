import careersData from '../data/careers.json'
import resourcesData from '../data/resources.json'

// Normalize input: lowercase, remove punctuation
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Intent keywords — expanded with fuzzy matching
const INTENT_KEYWORDS = {
  coding: ['code', 'coding', 'programming', 'programmer', 'developer', 'software', 'app', 'website', 'web dev', 'frontend', 'backend', 'fullstack', 'full stack', 'javascript', 'python dev'],
  data: ['data', 'analytics', 'analyst', 'statistics', 'stats', 'ai', 'ml', 'machine learning', 'deep learning', 'python', 'sql', 'dataset', 'kaggle'],
  cyber: ['cyber', 'security', 'hacker', 'hacking', 'cybersecurity', 'infosec', 'penetration', 'pentest'],
  medicine: ['doctor', 'medicine', 'medical', 'physician', 'health', 'patient', 'hospital', 'surgery', 'surgeon', 'mbbs', 'med school', 'premed', 'pre med'],
  nursing: ['nurse', 'nursing', 'rn', 'bsn'],
  therapy: ['therapy', 'therapist', 'physiotherapy', 'physiotherapist', 'rehab', 'rehabilitation'],
  mind: ['psychology', 'psychologist', 'counsel', 'counselor', 'counselling', 'mental health', 'therapy session'],
  design: ['design', 'designer', 'ui', 'ux', 'product design', 'figma', 'visual', 'graphic', 'logo', 'branding'],
  art: ['art', 'artist', 'drawing', 'illustration', 'paint', 'painter'],
  writing: ['write', 'writing', 'writer', 'content', 'blog', 'blogger', 'author', 'copywriter', 'journalist', 'journalism'],
  film: ['film', 'movie', 'director', 'cinema', 'video editor', 'filmmaking'],
  business: ['business', 'entrepreneur', 'startup', 'founder', 'company', 'ceo', 'manager'],
  money: ['money', 'finance', 'financial', 'salary', 'earn', 'rich', 'wealth', 'invest', 'bank', 'accounting', 'accountant', 'ca', 'cpa', 'chartered'],
  teaching: ['teach', 'teacher', 'professor', 'education', 'educator', 'school', 'students', 'tutor'],
  govt: ['government', 'govt', 'civil service', 'civil servant', 'officer', 'policy', 'admin', 'administrator', 'ias', 'bureaucrat'],
  military: ['military', 'army', 'navy', 'airforce', 'defense', 'defence', 'officer training', 'nda'],
  eng: ['engineer', 'engineering', 'mechanical', 'electrical', 'civil', 'machine', 'robot', 'robotics', 'physics'],
  law: ['law', 'lawyer', 'legal', 'attorney', 'court', 'justice', 'litigation'],
  architecture: ['architect', 'architecture', 'buildings', 'urban design'],
}

const INTENT_TO_CAREERS = {
  coding: ['software-engineer', 'cybersecurity-analyst', 'data-scientist'],
  data: ['data-scientist', 'software-engineer', 'cybersecurity-analyst'],
  cyber: ['cybersecurity-analyst', 'software-engineer'],
  medicine: ['doctor', 'nurse', 'physiotherapist'],
  nursing: ['nurse', 'doctor', 'physiotherapist'],
  therapy: ['physiotherapist', 'nurse', 'psychologist'],
  mind: ['psychologist', 'doctor', 'teacher'],
  design: ['ux-designer', 'graphic-designer', 'architect'],
  art: ['graphic-designer', 'architect', 'film-director'],
  writing: ['content-writer', 'film-director', 'teacher'],
  film: ['film-director', 'content-writer', 'graphic-designer'],
  business: ['entrepreneur', 'marketing-manager', 'hr-manager', 'investment-banker'],
  money: ['chartered-accountant', 'investment-banker', 'entrepreneur'],
  teaching: ['teacher', 'professor', 'psychologist'],
  govt: ['ias-officer', 'hr-manager'],
  military: ['defence-officer', 'ias-officer'],
  eng: ['mechanical-engineer', 'electrical-engineer', 'civil-engineer', 'software-engineer'],
  law: ['ias-officer', 'hr-manager', 'marketing-manager'],
  architecture: ['architect', 'civil-engineer', 'ux-designer'],
}

// Detect user intent from text
function detectIntents(text) {
  const norm = normalize(text)
  const matched = []
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const score = keywords.reduce((sum, kw) => {
      if (norm.includes(kw)) return sum + kw.length // longer matches score higher
      return sum
    }, 0)
    if (score > 0) matched.push({ intent, score })
  }
  return matched.sort((a, b) => b.score - a.score).map((m) => m.intent)
}

// Detect special question types
function detectQuestionType(text) {
  const norm = normalize(text)
  if (/\b(salary|earn|pay|money|income|package|ctc)\b/.test(norm)) return 'salary'
  if (/\b(how long|duration|years|time|takes)\b/.test(norm)) return 'duration'
  if (/\b(hard|difficult|tough|easy|difficulty)\b/.test(norm)) return 'difficulty'
  if (/\b(future|demand|growth|scope|ai replace|automation)\b/.test(norm)) return 'future'
  if (/\b(which career|what career|suggest|recommend|help me choose|confused|dont know)\b/.test(norm)) return 'recommend'
  if (/\b(study|learn|course|where to start|begin)\b/.test(norm)) return 'learn'
  if (/\b(eligibility|requirements|qualification|need to)\b/.test(norm)) return 'eligibility'
  return null
}

// Find a specific career mentioned in the text
function findCareerByName(text) {
  const norm = normalize(text)
  for (const career of careersData) {
    const titleWords = normalize(career.title).split(' ').filter((w) => w.length > 3)
    for (const word of titleWords) {
      if (norm.includes(word)) return career
    }
  }
  return null
}

// Generate a response
export function getAdvisorResponse(userInput, context = {}) {
  const input = userInput.trim()
  if (!input) return null

  const norm = normalize(input)

  // Greetings
  if (['hi', 'hello', 'hey', 'yo', 'sup', 'start', 'help'].includes(norm)) {
    return {
      text: `Hi! I'm your Career Advisor. I can help you with:\n\n• Finding careers based on your interests\n• Salary info for any career\n• How long careers take to enter\n• What skills to learn first\n• Free courses and resources\n\nTry: "I love coding", "how much do doctors earn?", or "suggest a career for me"`,
      careers: [],
      resources: null,
    }
  }

  // Thanks
  if (/\b(thanks|thank you|thx|ty)\b/.test(norm)) {
    return {
      text: "You're welcome! Ask me anything else about careers. 🚀",
      careers: [],
      resources: null,
    }
  }

  // Check for specific career mentioned
  const mentionedCareer = findCareerByName(input)

  if (mentionedCareer) {
    const questionType = detectQuestionType(input)

    if (questionType === 'salary') {
      return {
        text: `**${mentionedCareer.title}** salary range:\n\n• **Entry level:** $${mentionedCareer.salaryMin.toLocaleString('en-US')}/year\n• **Senior level:** $${mentionedCareer.salaryMax.toLocaleString('en-US')}/year\n\nNote: Actual pay varies by city, company size, and experience.`,
        careers: [mentionedCareer.id],
        resources: null,
      }
    }

    if (questionType === 'duration') {
      return {
        text: `**${mentionedCareer.title}** educational path:\n\n${mentionedCareer.educationPath}\n\nMost people enter the field within 4–7 years after high school.`,
        careers: [mentionedCareer.id],
        resources: null,
      }
    }

    if (questionType === 'eligibility') {
      return {
        text: `To become a **${mentionedCareer.title}**:\n\n${mentionedCareer.educationPath}\n\n**Required skills:**\n${mentionedCareer.skills.map((s) => `• ${s}`).join('\n')}`,
        careers: [mentionedCareer.id],
        resources: null,
      }
    }

    if (questionType === 'difficulty') {
      return {
        text: `**${mentionedCareer.title}** — Reality check:\n\n• **Stress:** ${mentionedCareer.reality?.stress || 'Medium'}\n• **Work-life:** ${mentionedCareer.reality?.workLife || 'Variable'}\n• **Future outlook:** ${mentionedCareer.reality?.future || 'Stable'}\n\nEvery career has challenges. The question is — can you tolerate *this* career's specific challenges?`,
        careers: [mentionedCareer.id],
        resources: null,
      }
    }

    if (questionType === 'future') {
      return {
        text: `**${mentionedCareer.title}** future outlook: ${mentionedCareer.reality?.future || 'Stable with steady demand.'}\n\nWays to future-proof:\n• Learn AI-adjacent skills\n• Build a portfolio of real work\n• Stay current with industry trends`,
        careers: [mentionedCareer.id],
        resources: null,
      }
    }

    if (questionType === 'learn') {
      return {
        text: `Best way to start **${mentionedCareer.title}**:\n\n${mentionedCareer.roadmap ? mentionedCareer.roadmap.map((s) => `• **${s.stage}:** ${s.action}`).join('\n') : 'Check the Career Bank for the full roadmap.'}`,
        careers: [mentionedCareer.id],
        resources: mentionedCareer.freeResources
          ? mentionedCareer.freeResources.slice(0, 3).map((r) => ({ name: r.name, type: r.type }))
          : null,
      }
    }

    // Generic career response
    return {
      text: `Here's what I know about **${mentionedCareer.title}**:\n\n${mentionedCareer.description}\n\n**Salary:** $${mentionedCareer.salaryMin.toLocaleString('en-US')} – $${mentionedCareer.salaryMax.toLocaleString('en-US')} p.a.\n\nAsk me about salary, skills, difficulty, or how to start.`,
      careers: [mentionedCareer.id],
      resources: null,
    }
  }

  // Special question types without a specific career
  const questionType = detectQuestionType(input)

  if (questionType === 'salary') {
    const topPaying = [...careersData].sort((a, b) => b.salaryMax - a.salaryMax).slice(0, 5)
    return {
      text: `Here are the **highest-paying careers** in our bank (senior-level):`,
      careers: topPaying.map((c) => c.id),
      resources: null,
    }
  }

  if (questionType === 'recommend') {
    return {
      text: `The best way to find your match is the **Interest Quiz** — 8 quick questions, 2 minutes. Based on your personality traits, it recommends a stream and matching careers.\n\nOr just tell me what you enjoy — like "I love coding" or "I want to help people".`,
      careers: [],
      resources: null,
      cta: { label: 'Take the Quiz', to: '/quiz' },
    }
  }

  if (questionType === 'learn') {
    return {
      text: `We have a full **Courses** section with 24 free courses from Harvard, Google, Microsoft, Kaggle, Y Combinator, and more. It's the fastest way to start learning any career skill.`,
      careers: [],
      resources: null,
      cta: { label: 'Browse Courses', to: '/courses' },
    }
  }

  // Intent detection
  const intents = detectIntents(input)

  if (intents.length === 0) {
    return {
      text: `I'm not sure I got that. Try:\n\n• "I love coding and building things"\n• "I want to help people"\n• "What pays well?"\n• "How much do doctors earn?"\n• "Suggest a career for me"\n\nOr ask about any specific career.`,
      careers: [],
      resources: null,
    }
  }

  // Aggregate careers from all matched intents
  const careerCount = {}
  intents.forEach((intent, idx) => {
    const weight = idx === 0 ? 3 : 1
    ;(INTENT_TO_CAREERS[intent] || []).forEach((id) => {
      careerCount[id] = (careerCount[id] || 0) + weight
    })
  })

  const topCareers = Object.entries(careerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => careersData.find((c) => c.id === id))
    .filter(Boolean)

  const intentLabel = intents[0]
  const text = `Got it — you're into **${intentLabel}**. Here are some careers that match:`

  return {
    text,
    careers: topCareers.map((c) => c.id),
    resources: null,
  }
}