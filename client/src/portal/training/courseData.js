// ============================================================
// COURSE DATA — Expert Witness Foundations
// ============================================================
// Lesson content for lessons 1.2–4.3 will be added after
// design confirmation. Each lesson object follows the same
// shape as lesson 1.1.
// ============================================================

export const LESSONS = {
  '1.1': {
    id: '1.1',
    title: 'What Expert Witnesses Actually Do',
    unitId: 'unit-1',
    unitTitle: 'The Expert Witness Role',
    estimatedMinutes: 8,
    heading: 'The Expert Witness: Educator, Not Advocate',
    body: [
      'An expert witness is retained to educate the trier of fact — judge or jury — on a subject beyond ordinary knowledge. Unlike a treating physician or forensic analyst working for a client, the expert\'s primary duty runs to the court, not to the party who hired them.',
      'Your role is to offer an independent, well-reasoned opinion based on your training, experience, and review of the case materials. You are allowed — and expected — to reach conclusions that the retaining attorney may not love, as long as those conclusions are supported by your analysis.',
      'Practically, this means reviewing records, writing reports, sitting for depositions, and testifying at trial or arbitration. Each phase has its own conventions, risks, and opportunities to either strengthen or undermine your credibility.',
    ],
    bullets: [
      'You educate the court — you do not advocate for a side',
      'Your duty of independence is what makes your opinion credible and admissible',
      'Expert testimony must be grounded in sufficient facts, reliable methodology, and sound reasoning (Daubert / Frye / California Evidence Code § 801)',
      'A poorly prepared expert can expose retaining counsel to sanctions and the client to adverse judgment',
      'Veracity manages your engagements so you can focus on analysis — not logistics',
    ],
    keyTakeaway:
      'The moment an expert appears to be an advocate rather than an educator, their credibility — and the value of their opinion — collapses. Independence is not a limitation; it is the source of your power as a witness.',
  },

  '1.2': {
    id: '1.2',
    title: 'Ethics, Independence & the Hired Gun Problem',
    unitId: 'unit-1',
    unitTitle: 'The Expert Witness Role',
    estimatedMinutes: 9,
    heading: 'Staying Independent in an Adversarial System',
    body: [
      'Content for this lesson will be authored after design confirmation.',
    ],
    bullets: [
      'Placeholder bullet 1',
      'Placeholder bullet 2',
    ],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '2.1': {
    id: '2.1',
    title: 'Deposition Basics — Anatomy & Preparation',
    unitId: 'unit-2',
    unitTitle: 'How Depositions Work',
    estimatedMinutes: 12,
    heading: 'Anatomy of a Deposition',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '2.2': {
    id: '2.2',
    title: 'Deposition Demeanor & Answering Strategy',
    unitId: 'unit-2',
    unitTitle: 'How Depositions Work',
    estimatedMinutes: 10,
    heading: 'How to Answer Deposition Questions',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '3.1': {
    id: '3.1',
    title: 'The Goals of Cross-Examination',
    unitId: 'unit-3',
    unitTitle: 'Handling Cross-Examination',
    estimatedMinutes: 6,
    heading: 'Understanding What Opposing Counsel Wants',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '3.2': {
    id: '3.2',
    title: 'Handling the Hard Questions — Fees, Bias & Treatise Attacks',
    unitId: 'unit-3',
    unitTitle: 'Handling Cross-Examination',
    estimatedMinutes: 8,
    heading: 'Defusing the Most Common Attacks',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '3.3': {
    id: '3.3',
    title: 'Staying Composed Under Pressure',
    unitId: 'unit-3',
    unitTitle: 'Handling Cross-Examination',
    estimatedMinutes: 6,
    heading: 'Composure as a Professional Skill',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '4.1': {
    id: '4.1',
    title: 'What Attorneys Need from You — Plaintiff & Defense',
    unitId: 'unit-4',
    unitTitle: 'What Attorneys Want & California Rules',
    estimatedMinutes: 8,
    heading: 'Meeting Attorneys Where They Are',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '4.2': {
    id: '4.2',
    title: 'California Evidence Code 720 — Expert Qualifications',
    unitId: 'unit-4',
    unitTitle: 'What Attorneys Want & California Rules',
    estimatedMinutes: 5,
    heading: 'Qualifying as an Expert in California',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },

  '4.3': {
    id: '4.3',
    title: 'California-Specific Rules & Procedures',
    unitId: 'unit-4',
    unitTitle: 'What Attorneys Want & California Rules',
    estimatedMinutes: 5,
    heading: 'Navigating California\'s Expert Witness Landscape',
    body: ['Content for this lesson will be authored after design confirmation.'],
    bullets: ['Placeholder bullet 1', 'Placeholder bullet 2'],
    keyTakeaway: 'Lesson content coming soon.',
  },
};

export const UNITS = [
  {
    id: 'unit-1',
    title: 'The Expert Witness Role',
    estimatedMinutes: 17,
    lessons: ['1.1', '1.2'],
    quizId: 'unit-1',
  },
  {
    id: 'unit-2',
    title: 'How Depositions Work',
    estimatedMinutes: 22,
    lessons: ['2.1', '2.2'],
    quizId: 'unit-2',
    scenarioId: 'scenario-a',
  },
  {
    id: 'unit-3',
    title: 'Handling Cross-Examination',
    estimatedMinutes: 20,
    lessons: ['3.1', '3.2', '3.3'],
    quizId: 'unit-3',
    scenarioId: 'scenario-b',
  },
  {
    id: 'unit-4',
    title: 'What Attorneys Want & California Rules',
    estimatedMinutes: 18,
    lessons: ['4.1', '4.2', '4.3'],
    quizId: 'unit-4',
  },
];

// All lesson IDs in sequential order (used for prev/next navigation)
export const LESSON_SEQUENCE = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '3.3', '4.1', '4.2', '4.3'];

export const TOTAL_LESSONS = LESSON_SEQUENCE.length;

// Returns the lesson that follows lessonId in the sequence,
// or null if it is the final lesson.
export function getNextLesson(lessonId) {
  const idx = LESSON_SEQUENCE.indexOf(lessonId);
  if (idx === -1 || idx === LESSON_SEQUENCE.length - 1) return null;
  return LESSON_SEQUENCE[idx + 1];
}

// Returns the unit a lesson belongs to.
export function getUnitForLesson(lessonId) {
  return UNITS.find((u) => u.lessons.includes(lessonId)) || null;
}

// Returns which lesson index (1-based) a lessonId is in the overall sequence.
export function getLessonIndex(lessonId) {
  return LESSON_SEQUENCE.indexOf(lessonId) + 1;
}
