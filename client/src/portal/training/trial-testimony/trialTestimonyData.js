// ============================================================
// trialTestimonyData.js
// All content for the "Trial Testimony as an Expert Witness"
// training module.
//
// Lesson content structure per lesson:
//   title           string
//   estimatedMinutes number
//   sections        Array<{
//     subheading?     string
//     body            string[]
//     bullets?        string[]
//     numberedList?   string[]
//     afterList?      string    (paragraph rendered after numbered list)
//     comparisonTable? Array<Record<string, string>>
//   }>
//   keyTakeaway     string
// ============================================================

export const MODULE_TITLE = 'Trial Testimony as an Expert Witness'
export const MODULE_SUBTITLE =
  '~75 minutes \u00b7 10 Lessons \u00b7 1 Scenario \u00b7 1 Knowledge Check'

export const LESSON_SEQUENCE = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
]
export const TOTAL_LESSONS = 10

export function getNextLesson(lessonId) {
  const idx = LESSON_SEQUENCE.indexOf(lessonId)
  return idx >= 0 && idx < LESSON_SEQUENCE.length - 1
    ? LESSON_SEQUENCE[idx + 1]
    : null
}

export function getLessonIndex(lessonId) {
  return LESSON_SEQUENCE.indexOf(lessonId) + 1 // 1-based
}

// ============================================================
// LESSONS
// ============================================================

export const LESSONS = {
  1: {
    title: 'The Role of an Expert Witness at Trial',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'Trial testimony is the culmination of everything you have done as an expert witness. Your report, your deposition, your preparation -- all of it leads to this moment. The courtroom is the only place where your opinions will be tested in front of the people who decide the outcome: the judge and jury.',
          'Unlike a deposition, where opposing counsel controls the questioning, trial testimony is a structured performance. You will be guided through your opinions by retaining counsel on direct examination, challenged by opposing counsel on cross-examination, and potentially rehabilitated on redirect. Understanding this structure is the foundation of effective trial testimony.',
        ],
      },
      {
        subheading: 'Why Trial Testimony Is Different',
        body: [
          'In a deposition, you are speaking to lawyers who already understand the case. At trial, you are speaking to jurors who may have no background in your field. This fundamental difference changes everything -- your vocabulary, your pace, your use of visual aids, and your communication style.',
        ],
        comparisonTable: [
          {
            setting: 'Deposition',
            audience: 'Attorneys',
            purpose: 'Discovery and impeachment',
            tone: 'Precise, concise, defensive',
          },
          {
            setting: 'Trial',
            audience: 'Judge and jury',
            purpose: 'Persuasion and education',
            tone: 'Clear, accessible, authoritative',
          },
        ],
      },
      {
        subheading: "The Expert's Dual Obligation",
        body: [
          'An expert witness at trial serves two masters simultaneously. You are retained by one party, but your obligation is to the truth. Jurors are remarkably perceptive -- they can sense when a witness is advocating rather than educating. The most effective experts present their opinions with conviction while maintaining objectivity.',
        ],
        bullets: [
          'You are an educator, not an advocate -- the attorney advocates, you explain.',
          'Your credibility is your most valuable asset. Once lost, it cannot be recovered during the trial.',
          'Jurors decide credibility based on demeanor, clarity, and fairness -- not just substance.',
          'The judge controls what the jury hears; the jury decides what they believe.',
        ],
      },
      {
        subheading: 'The Phases of Trial Testimony',
        body: [
          'Your time on the witness stand follows a predictable sequence. Understanding each phase allows you to prepare specifically for what each requires.',
        ],
        numberedList: [
          'Voir dire (qualification): Opposing counsel may challenge whether you should be allowed to testify at all.',
          'Direct examination: Retaining counsel walks you through your opinions in a logical, jury-friendly order.',
          'Cross-examination: Opposing counsel tests your opinions, methodology, and credibility.',
          'Redirect examination: Retaining counsel addresses issues raised during cross.',
          'Recross (rare): Opposing counsel may briefly follow up on redirect topics.',
        ],
      },
    ],
    keyTakeaway:
      'Trial testimony is not a repeat of your deposition. You are now speaking to jurors who need you to translate complex concepts into clear, accessible language while maintaining the precision and objectivity the court demands.',
  },

  2: {
    title: 'Pre-Trial Preparation',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'The quality of your trial testimony is determined long before you take the stand. Preparation for trial is more intensive than preparation for a deposition because the stakes are higher, the audience is different, and the format demands a different kind of readiness.',
        ],
      },
      {
        subheading: 'Know Your Report Cold',
        body: [
          'By the time you reach trial, your report may be months or even years old. You must re-master it completely. Every opinion, every basis, every assumption, every limitation. Opposing counsel will have spent hours identifying inconsistencies between your report, your deposition, and your trial testimony. Any gap is an invitation for impeachment.',
        ],
        bullets: [
          'Re-read your report as if you were opposing counsel looking for weaknesses.',
          'Compare your report to your deposition transcript -- identify any variations in language or emphasis.',
          'Review all exhibits and demonstratives referenced in your report.',
          'Confirm that your opinions have not changed since the report was issued; if they have, discuss supplementation with counsel.',
        ],
      },
      {
        subheading: 'The Pre-Trial Conference with Counsel',
        body: [
          'Your preparation session with retaining counsel before trial is fundamentally different from your deposition prep. At trial, counsel needs to build a narrative -- a story that the jury can follow from beginning to end. Your role is to anchor that narrative with expert opinions.',
        ],
        bullets: [
          'Review the direct examination outline -- know the order and flow of questions.',
          'Discuss anticipated cross-examination topics and prepare responses.',
          'Identify the 3-5 key points the jury must understand from your testimony.',
          'Review demonstrative exhibits and practice explaining them to a non-technical audience.',
          'Discuss timing -- how long your direct is expected to last, when breaks will occur.',
          "Ask about the judge's preferences and courtroom rules (standing vs. sitting, use of technology).",
        ],
      },
      {
        subheading: 'Reviewing the Deposition Transcript',
        body: [
          'Opposing counsel will have your deposition transcript on the podium during cross-examination. They will look for any deviation between what you said then and what you say now. Consistency is critical.',
        ],
        bullets: [
          'Read your entire deposition transcript before trial -- not just the key sections.',
          'Flag any answers that could be read differently than you intended.',
          'If your understanding has evolved since the deposition, be prepared to explain why.',
          'Never say at trial something that contradicts your deposition testimony without a clear, documented basis for the change.',
        ],
      },
      {
        subheading: 'Courtroom Familiarization',
        body: [
          'If possible, visit the courtroom before you testify. Knowing the physical layout reduces anxiety and allows you to plan your communication strategy.',
        ],
        bullets: [
          'Where will the jury be seated relative to the witness stand?',
          'Where will the screen for demonstrative exhibits be placed?',
          'Is there a document camera or ELMO for physical exhibits?',
          'Will you be standing at a podium or seated in a witness box?',
          'What technology is available (laptop connections, projectors, screens)?',
        ],
      },
    ],
    keyTakeaway:
      'Preparation for trial is not just about knowing your opinions -- it is about knowing how to deliver them to a lay audience in a courtroom setting, while remaining perfectly consistent with everything you have said before.',
  },

  3: {
    title: 'Voir Dire and Qualification',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'Before you offer a single opinion, opposing counsel may challenge your qualifications through voir dire -- a mini-hearing in which the court determines whether you should be permitted to testify as an expert. This is not a formality. A successful challenge can exclude your testimony entirely.',
        ],
      },
      {
        subheading: 'What Is Expert Voir Dire?',
        body: [
          'Under Federal Rule of Evidence 702 and its state equivalents, a witness may testify as an expert if they have specialized knowledge that will help the trier of fact. The court must determine that the expert is qualified by "knowledge, skill, experience, training, or education." Opposing counsel\'s job during voir dire is to convince the judge that you do not meet this threshold.',
        ],
        bullets: [
          'FRE 702 sets the baseline: the witness must be qualified in the specific subject matter at issue.',
          'Qualifications are assessed relative to the opinions being offered -- a board-certified physician may not be qualified to opine on biomechanics.',
          'The judge decides qualification as a matter of law; the jury never hears a failed qualification challenge.',
          'Even if qualified, the weight of your testimony is for the jury to determine.',
        ],
      },
      {
        subheading: 'Common Qualification Challenges',
        body: [
          'Opposing counsel will probe for gaps between your credentials and the specific opinions you intend to offer. Understanding their typical lines of attack allows you to prepare.',
        ],
        comparisonTable: [
          {
            challenge: 'Lack of specific experience',
            example:
              '"You\'ve never worked on a case involving this exact type of failure, have you?"',
            response:
              'Emphasize transferable expertise and the breadth of your training and methodology.',
          },
          {
            challenge: 'No board certification',
            example:
              '"You are not board-certified in this subspecialty, correct?"',
            response:
              'Explain that board certification is not the only measure of expertise; emphasize years of practice and case experience.',
          },
          {
            challenge: 'Outdated credentials',
            example:
              '"Your last publication on this topic was twelve years ago."',
            response:
              'Explain that your active practice keeps you current even without recent publications.',
          },
          {
            challenge: 'Limited publications',
            example:
              '"You have never published a peer-reviewed article on this methodology."',
            response:
              'Distinguish between academic publishing and applied professional expertise.',
          },
        ],
      },
      {
        subheading: 'Presenting Your Qualifications Effectively',
        body: [
          'On direct examination, retaining counsel will walk you through your credentials. This is your opportunity to establish authority with the jury before you ever discuss the case.',
        ],
        numberedList: [
          'Lead with your most relevant qualifications -- the ones directly tied to the opinions you will offer.',
          'Quantify your experience: "I have inspected over 500 buildings" is more powerful than "I have extensive experience."',
          'Mention teaching, training, or mentoring others -- it reinforces your role as an educator.',
          'Be genuine -- jurors distrust witnesses who appear to inflate their credentials.',
          'If you have testified before, state how many times and for which side (plaintiff and defense both, if applicable).',
        ],
      },
      {
        subheading: 'Surviving a Daubert or Kelly/Frye Challenge',
        body: [
          'In some cases, a formal motion to exclude your testimony (Daubert motion in federal court, Kelly/Frye in certain state courts) will have been decided before trial. But in others, the challenge occurs during voir dire. If the judge permits you to testify despite the challenge, the jury never knows it happened.',
        ],
        bullets: [
          'Be prepared to articulate why your methodology is reliable and generally accepted.',
          'Know the error rate, testing procedures, and peer review status of your methods.',
          'Understand whether you are in a Daubert or Kelly/Frye jurisdiction -- the standard is different.',
          'If you completed the Admissibility Standards module, review those materials before trial.',
        ],
      },
    ],
    keyTakeaway:
      'Qualification is not guaranteed. Prepare to defend your credentials with specificity and confidence, and connect every qualification directly to the opinions you are offering in this case.',
  },

  4: {
    title: 'Direct Examination',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'Direct examination is your opportunity to present your opinions to the jury in a clear, logical, and persuasive manner. Unlike cross-examination, where opposing counsel controls the pace and direction, direct examination is a collaboration between you and retaining counsel.',
        ],
      },
      {
        subheading: 'The Structure of Direct Examination',
        body: [
          'A well-organized direct examination follows a predictable arc. Retaining counsel will use open-ended questions to guide you through your testimony in a sequence the jury can follow.',
        ],
        numberedList: [
          'Qualifications: Your credentials, experience, and background.',
          'Engagement: How you became involved in the case and what you were asked to do.',
          'Materials reviewed: The documents, data, and evidence you considered.',
          'Methodology: How you conducted your analysis and why your approach is reliable.',
          'Opinions: Your conclusions, stated clearly and tied to the evidence.',
          'Bases: The facts and reasoning that support each opinion.',
        ],
      },
      {
        subheading: 'Rules for Effective Direct Testimony',
        body: [
          'Direct examination is governed by rules that differ from deposition testimony. The most important difference: on direct, you should explain. At deposition, the rule is "answer only what was asked." At trial on direct, the rule is "help the jury understand."',
        ],
        bullets: [
          'Speak to the jury, not to the attorney. Make eye contact with jurors when explaining your opinions.',
          'Use plain language. Avoid jargon or define it immediately when you must use it.',
          'Tell a story. Jurors remember narratives better than lists of facts.',
          'Use demonstrative exhibits to illustrate complex points -- photos, diagrams, timelines.',
          'Vary your pace. Slow down for critical opinions; speak naturally for background.',
          "If you don't understand a question from retaining counsel, say so -- it helps the jury too.",
        ],
      },
      {
        subheading: 'Stating Your Opinions',
        body: [
          'The moment you state your opinions is the most important part of your testimony. Every word matters. Your opinions should be clear, specific, and stated with appropriate confidence.',
        ],
        comparisonTable: [
          {
            quality: 'Weak',
            example:
              '"I think it\'s possible that the roof failed due to improper installation."',
          },
          {
            quality: 'Better',
            example:
              '"Based on my inspection and analysis, it is my opinion to a reasonable degree of professional certainty that the roof system failed due to improper installation of the flashing at the wall-to-roof transition."',
          },
        ],
        afterList:
          'Notice the difference: the strong opinion identifies the specific failure, the specific location, and the standard of certainty. Jurors need specificity to make decisions.',
      },
      {
        subheading: 'Handling Exhibits on Direct',
        body: [
          'Exhibits are the backbone of effective trial testimony. A well-chosen photograph, diagram, or document can communicate in seconds what words alone cannot.',
        ],
        bullets: [
          'Practice with every exhibit before trial -- know them by number or letter.',
          'When counsel asks you to refer to an exhibit, orient the jury first: "This is a photograph I took on March 15, 2025, showing the north elevation of the building."',
          "Use a pointer or annotation tool to direct the jury's attention to the specific area.",
          'Pause after displaying an exhibit -- give the jury time to absorb what they are seeing.',
          'Relate the exhibit back to your opinion: "This photograph shows the condition I described as improper installation."',
        ],
      },
    ],
    keyTakeaway:
      'Direct examination is your opportunity to teach the jury. Speak clearly, use exhibits effectively, and state your opinions with specificity and confidence. The jury should leave your direct understanding exactly what you concluded and why.',
  },

  5: {
    title: 'Cross-Examination Survival',
    estimatedMinutes: 9,
    sections: [
      {
        subheading: null,
        body: [
          'Cross-examination is where trial testimony is won or lost. Opposing counsel has one objective: to diminish the weight the jury gives to your opinions. They will challenge your methodology, probe for inconsistencies, test your objectivity, and attempt to get you to concede points that undermine your conclusions.',
          'The good news: cross-examination at trial is not fundamentally different from a deposition. The techniques are the same -- leading questions, hypotheticals, impeachment by prior statement. But the audience is different. Everything you say is now being evaluated in real time by the people who will decide the case.',
        ],
      },
      {
        subheading: 'The Rules of Cross-Examination',
        body: [
          "At trial, cross-examination should not go beyond the subject matter of direct examination and matters affecting the witness's credibility (FRE 611(b)), though the court may permit inquiry into additional matters. This is a critical protection: opposing counsel cannot ask you about topics you did not cover on direct. However, credibility is always fair game.",
        ],
        bullets: [
          'Leading questions are permitted and expected on cross -- the attorney controls the framing.',
          "You are not required to accept the attorney's framing. If a question misstates your opinion, correct it.",
          'Your answers should be responsive but not volunteered -- answer what was asked, then stop.',
          'If a question is compound, ambiguous, or contains an incorrect assumption, say so.',
        ],
      },
      {
        subheading: 'Impeachment by Prior Statement',
        body: [
          'The most powerful cross-examination technique is impeachment -- showing the jury that what you said at deposition is inconsistent with what you are saying at trial. Opposing counsel will have your deposition transcript bookmarked and ready.',
        ],
        numberedList: [
          'Counsel reads a portion of your deposition testimony.',
          'Counsel asks whether you gave that testimony under oath.',
          'Counsel highlights the inconsistency with your current testimony.',
          'The jury draws its own conclusion about your credibility.',
        ],
        afterList:
          'The best defense against impeachment is consistency. If your testimony at trial is identical to your deposition testimony, there is nothing to impeach.',
      },
      {
        subheading: 'Common Cross-Examination Techniques at Trial',
        body: [
          'Opposing counsel will employ a range of techniques designed to extract concessions or undermine your credibility in front of the jury.',
        ],
        comparisonTable: [
          {
            technique: 'Looping',
            description:
              'Using your own concession from the previous answer as the premise for the next question',
            defense:
              'Listen to each question independently. Do not let your prior answer lock you into a position you did not intend.',
          },
          {
            technique: 'Cherry-picking',
            description:
              'Selecting one piece of evidence that supports their theory while ignoring the rest',
            defense:
              '"My opinion is based on the totality of the evidence, not any single document in isolation."',
          },
          {
            technique: 'The concession cascade',
            description:
              'Getting you to agree to small, seemingly harmless points that build to a damaging conclusion',
            defense:
              'Before agreeing to any premise, consider where the line of questioning is heading.',
          },
          {
            technique: 'Reading from your report',
            description:
              'Reading a sentence from your report out of context to suggest a different meaning',
            defense:
              '"That sentence should be read in the context of the full paragraph [or section]."',
          },
        ],
      },
      {
        subheading: 'The Three-Word Shield',
        body: [
          'When cross-examination becomes intense, fall back on the fundamentals. Three phrases will protect you in almost any situation:',
        ],
        numberedList: [
          '"That is not what I said." -- When opposing counsel mischaracterizes your testimony.',
          '"That is not my opinion." -- When opposing counsel attributes a conclusion to you that you did not reach.',
          '"I would need to see the full context." -- When counsel reads a fragment of your report or deposition out of context.',
        ],
      },
    ],
    keyTakeaway:
      'Cross-examination is a test of preparation, not a test of intelligence. If you have prepared thoroughly, maintained consistency with your deposition, and refuse to accept false premises, you will emerge with your credibility intact.',
  },

  6: {
    title: 'Redirect and Rehabilitation',
    estimatedMinutes: 6,
    sections: [
      {
        subheading: null,
        body: [
          "Redirect examination is retaining counsel's opportunity to repair any damage done during cross-examination. It is limited to topics raised during cross -- counsel cannot introduce entirely new subject matter. For the expert, redirect is the chance to clarify, complete, and contextualize answers that may have been cut short or taken out of context.",
        ],
      },
      {
        subheading: 'When Redirect Is Most Valuable',
        body: [
          'Not every cross-examination requires rehabilitation. Retaining counsel must decide whether redirect will help or simply give opposing counsel another opportunity for recross. The best redirect is surgical -- it addresses the one or two most damaging points and moves on.',
        ],
        bullets: [
          'Incomplete answers: Cross-examination often cuts off your explanation. Redirect lets you finish.',
          'Out-of-context quotes: If opposing counsel read a sentence from your report in isolation, redirect lets you provide the full context.',
          'Concessions that need qualification: If you agreed to something on cross that needs clarification, redirect is the place.',
          'Impeachment repair: If opposing counsel showed an inconsistency, redirect lets you explain the apparent discrepancy.',
        ],
      },
      {
        subheading: 'How to Handle Redirect Effectively',
        body: [
          'Redirect requires a different mindset than cross-examination. On cross, you are defensive -- concise, careful, precise. On redirect, you are back to teaching mode.',
        ],
        numberedList: [
          'Listen carefully to the redirect question -- counsel is giving you an opening to explain.',
          'Take the opportunity to provide the complete answer you were not permitted to give on cross.',
          'Speak to the jury again -- redirect is your last chance to make an impression.',
          'Be concise. Redirect should be brief and targeted, not a second direct examination.',
        ],
      },
      {
        subheading: 'Recross Examination',
        body: [
          'After redirect, opposing counsel may conduct a brief recross examination, limited to new matters raised during redirect. Recross is typically very short. Apply the same principles you used during cross-examination: listen, pause, answer only what was asked.',
        ],
        bullets: [
          'Recross is limited to topics covered on redirect.',
          'The same defensive techniques apply: do not volunteer information.',
          'If the question strays beyond redirect topics, retaining counsel should object.',
          'After recross, the judge will typically excuse you from the witness stand.',
        ],
      },
      {
        subheading: 'The Rule of Completeness (FRE 106)',
        body: [
          'The Rule of Completeness is a powerful tool during redirect. If opposing counsel introduced a portion of a document or statement during cross-examination, retaining counsel may invoke FRE 106 to require that the remainder of the document (or the relevant portions) be introduced as well, so that the jury sees the full context.',
        ],
        bullets: [
          'FRE 106 prevents misleading use of partial documents.',
          'As amended in 2023, the rule now applies to all statements in any form, including oral statements.',
          'Retaining counsel raises the issue -- you do not invoke FRE 106 yourself.',
          'Understanding this rule helps you remain calm when counsel cherry-picks from your report.',
        ],
      },
    ],
    keyTakeaway:
      'Redirect is your opportunity to have the last word on the most important issues. Be prepared for it, but let retaining counsel lead. On redirect, return to teaching mode and give the jury the complete picture.',
  },

  7: {
    title: 'Communicating with the Jury',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'The single most important skill in trial testimony is the ability to communicate complex technical concepts to non-technical people. Jurors are teachers, plumbers, accountants, retirees, and students. They have no obligation to understand your field. Your obligation is to make them understand your opinions.',
        ],
      },
      {
        subheading: 'The Curse of Knowledge',
        body: [
          "The biggest barrier to effective expert testimony is not nerves or cross-examination -- it is the curse of knowledge. You are so deeply embedded in your field that you have lost the ability to see it from an outsider's perspective. Terms that are second nature to you are foreign to the jury.",
        ],
        bullets: [
          'Assume the jury knows nothing about your field. You will never be penalized for being too clear.',
          'Test your explanations on non-expert friends or family before trial.',
          'If you must use a technical term, define it immediately: "Flashing -- that\'s the metal strip that seals the joint between the roof and the wall."',
          'Avoid acronyms unless you define them and use them repeatedly.',
        ],
      },
      {
        subheading: 'Analogies and Everyday Comparisons',
        body: [
          "The most effective expert witnesses translate complex concepts into everyday analogies. Analogies create bridges between the juror's existing knowledge and the new information you are asking them to process.",
        ],
        comparisonTable: [
          {
            technical:
              'Thermal bridging causes condensation in the wall cavity',
            analogy:
              '"Think of a cold glass of water on a hot day. The glass sweats because the cold surface meets warm, moist air. The same thing happens inside a wall when metal studs create a cold path through the insulation."',
          },
          {
            technical: 'The load path was compromised by improper connections',
            analogy:
              '"Imagine a chain. Every link must hold for the chain to work. If one connection fails, the load has nowhere to go -- and the structure fails at that point."',
          },
        ],
      },
      {
        subheading: 'Body Language and Presence',
        body: [
          'Jurors form impressions of your credibility within the first few minutes of your testimony. Your body language, tone, and demeanor communicate as much as your words.',
        ],
        bullets: [
          'Sit up straight and maintain a natural, open posture.',
          'Make eye contact with jurors -- especially when stating your key opinions.',
          'Speak at a measured pace. Jurors cannot process rapid technical testimony.',
          'Use natural hand gestures when explaining physical concepts.',
          'Do not fidget, cross your arms, or lean away from the microphone.',
          'On cross-examination, maintain the same calm, confident demeanor you showed on direct.',
        ],
      },
      {
        subheading: 'Pacing and Emphasis',
        body: [
          'Effective trial testimony has rhythm. You speed up through routine background, slow down for critical opinions, and pause for emphasis after key statements.',
        ],
        numberedList: [
          'Background and qualifications: Conversational pace -- the jury is getting to know you.',
          'Methodology description: Moderate pace -- clear and organized.',
          'Key opinions: Slow, deliberate, with pauses. Let the jury absorb each conclusion.',
          'Supporting evidence: Return to moderate pace as you explain the basis for each opinion.',
          'Cross-examination responses: Measured and even -- never speed up under pressure.',
        ],
      },
      {
        subheading: 'When to Look at the Jury vs. the Attorney',
        body: [
          'A common question is when to look at the jury and when to look at the questioning attorney. The answer depends on the phase of testimony.',
        ],
        bullets: [
          "Direct examination: Listen to the attorney's question, then turn to the jury to deliver your answer.",
          'Cross-examination: Face the attorney while listening, but turn to the jury when delivering substantive answers.',
          'When using exhibits: Face the exhibit while pointing, then turn to the jury to explain what you are showing them.',
          'Never stare at one juror -- make eye contact with different jurors throughout your testimony.',
        ],
      },
    ],
    keyTakeaway:
      'Your job is not to impress the jury with your expertise -- it is to help them understand. The most effective expert witnesses are teachers, not performers. Speak plainly, use analogies, make eye contact, and remember that clarity is more persuasive than complexity.',
  },

  8: {
    title: 'Visual Aids and Demonstrative Exhibits',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'Visual aids transform expert testimony from an abstract lecture into a concrete, understandable presentation. Research consistently shows that people retain significantly more information when it is presented visually. For expert witnesses, demonstrative exhibits are not optional -- they are essential.',
        ],
      },
      {
        subheading: 'Types of Demonstrative Exhibits',
        body: [
          'Demonstrative exhibits fall into several categories, each serving a different purpose in trial testimony.',
        ],
        comparisonTable: [
          {
            type: 'Photographs',
            purpose:
              'Show actual conditions -- damage, defects, site conditions',
            tips: 'High resolution, properly labeled, taken during your inspection if possible',
          },
          {
            type: 'Diagrams / Drawings',
            purpose: 'Illustrate concepts, systems, or spatial relationships',
            tips: 'Simple, clean lines, large labels visible from the jury box',
          },
          {
            type: 'Timelines',
            purpose:
              'Show sequence of events, construction history, or failure progression',
            tips: 'Horizontal format, key dates highlighted, readable from 15+ feet',
          },
          {
            type: 'Comparison charts',
            purpose:
              'Compare standards vs. actual conditions, or two competing theories',
            tips: 'Side-by-side format, color-coded, limited text',
          },
          {
            type: 'Animations / Models',
            purpose:
              'Demonstrate dynamic processes (collapse, water intrusion, force distribution)',
            tips: 'Pre-approved by the court; expensive but powerful for complex mechanisms',
          },
        ],
      },
      {
        subheading: 'Creating Effective Visual Aids',
        body: [
          'The best demonstrative exhibits share several qualities: they are simple, large, legible, and directly tied to an opinion you are expressing.',
        ],
        bullets: [
          'One concept per exhibit. Do not overload a single visual with multiple ideas.',
          'Large fonts and labels -- jurors are typically 15-25 feet from the screen or easel.',
          'Use color strategically: red for defects or failures, green for compliant conditions.',
          'Remove clutter. Every element on the exhibit should serve a purpose.',
          'Test your exhibits from the distance of the jury box before trial.',
        ],
      },
      {
        subheading: 'Using Technology in the Courtroom',
        body: [
          'Modern courtrooms vary dramatically in their technology capabilities. Some have built-in projection systems, document cameras, and annotation tablets. Others have a single easel and a whiteboard.',
        ],
        bullets: [
          'Confirm available technology with counsel before trial day.',
          'Always have a backup plan -- if the projector fails, can you testify with printed enlargements?',
          'Practice with the specific technology you will use. Fumbling with equipment undermines credibility.',
          'If using a tablet for annotation, ensure the annotations are visible on the main screen.',
          "Ask counsel about the court's rules for electronic exhibits -- some judges require pre-approval.",
        ],
      },
      {
        subheading: 'The Foundation Requirement',
        body: [
          'Before a demonstrative exhibit can be shown to the jury, a proper foundation must be laid. This means you (or another witness) must testify about what the exhibit is, when and how it was created, and that it fairly and accurately represents what it purports to show.',
        ],
        bullets: [
          'For photographs: "I took this photograph on [date] at [location]. It fairly and accurately depicts the condition of [subject] as I observed it."',
          'For diagrams: "I created this diagram to illustrate [concept]. It is a fair and accurate representation of [subject]."',
          'For animations: Foundation is more complex -- typically requires testimony about inputs, assumptions, and accuracy.',
          'Opposing counsel may object to foundation. Be prepared to explain every exhibit you intend to use.',
        ],
      },
    ],
    keyTakeaway:
      'A picture is worth a thousand words, but only if the jury can see it, understand it, and connect it to your opinion. Plan your visual aids carefully, test them in advance, and always have a backup plan.',
  },

  9: {
    title: 'Ethical Boundaries on the Stand',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'Expert witnesses operate within ethical boundaries that distinguish them from advocates. Crossing those boundaries -- even unintentionally -- can result in exclusion of your testimony, sanctions against retaining counsel, or permanent damage to your professional reputation.',
        ],
      },
      {
        subheading: 'The Line Between Expert and Advocate',
        body: [
          'The fundamental ethical obligation of an expert witness is to provide truthful, objective opinions based on the evidence -- not to help one side win. This obligation can be tested in subtle ways during trial.',
        ],
        bullets: [
          'Do not overstate the certainty of your opinions. If something is "more likely than not," do not present it as "certain."',
          'Do not minimize or ignore evidence that cuts against your opinion. Acknowledge it and explain why your conclusion is still sound.',
          'Do not use inflammatory language designed to evoke emotion rather than inform.',
          'Do not volunteer information that goes beyond your opinion to advocate for the retaining party.',
        ],
      },
      {
        subheading: 'Ultimate Issue Testimony',
        body: [
          'Under FRE 704(a), an expert may testify to an "ultimate issue" -- meaning you can state an opinion that directly addresses the question the jury must decide. However, in criminal cases involving a defendant\'s mental state, FRE 704(b) prohibits experts from stating whether the defendant did or did not have the requisite mental state. In civil cases, this restriction does not apply.',
        ],
        bullets: [
          'In civil cases, you may opine that "the contractor breached the standard of care" or "the defect caused the water intrusion."',
          'However, framing matters. "The defendant was negligent" is technically permissible but may be objected to as a legal conclusion.',
          'The safer approach: state your technical opinion and let the jury draw the legal conclusion.',
          'Avoid the word "negligent" unless instructed by counsel -- instead describe the specific deviation from the standard.',
        ],
      },
      {
        subheading: 'Staying Within Your Scope',
        body: [
          'At trial, just as at deposition, you must stay within the boundaries of your engagement and expertise. The temptation to offer opinions outside your scope increases at trial because the jury is present and you want to be helpful.',
        ],
        numberedList: [
          'Only testify about topics covered in your report and disclosed in discovery.',
          'If asked about a topic outside your scope, state clearly: "That is outside the scope of my engagement."',
          'Do not offer legal conclusions -- you are not a lawyer.',
          'Do not offer opinions about damages unless you were specifically retained to do so.',
          'If you realize mid-testimony that you are venturing outside your scope, stop and redirect yourself.',
        ],
      },
      {
        subheading: 'Candor and Concessions',
        body: [
          'Ethical expert testimony requires candor. If opposing counsel makes a fair point, acknowledge it. If there is a weakness in your analysis, do not hide it. Jurors respect honesty; they distrust witnesses who refuse to concede anything.',
        ],
        bullets: [
          '"That is a fair point, and I considered it in my analysis." -- shows thoroughness.',
          '"There are limitations to any methodology, including mine." -- shows intellectual honesty.',
          '"If those additional facts were true, I would need to reconsider that specific point." -- shows flexibility.',
          'Never concede your core opinion, but do concede fair peripheral points.',
        ],
      },
    ],
    keyTakeaway:
      'The most powerful expert witnesses are the ones the jury trusts. Trust is earned through objectivity, candor, and respect for the boundaries of your role. An expert who concedes fair points is far more credible than one who fights every question.',
  },

  10: {
    title: 'Post-Testimony and Continuous Improvement',
    estimatedMinutes: 6,
    sections: [
      {
        subheading: null,
        body: [
          'Your work is not done when you step down from the witness stand. The post-testimony phase involves important obligations, and the reflection process is critical for improving your performance in future cases.',
        ],
      },
      {
        subheading: 'Immediately After Testimony',
        body: [
          'When the judge excuses you from the stand, your conduct still matters. The jury is watching you as you walk back to your seat or leave the courtroom.',
        ],
        bullets: [
          'Remain composed -- do not show relief, frustration, or celebrate.',
          'Do not make eye contact with counsel or opposing parties in a way that suggests collusion.',
          'If you are sequestered (excluded from the courtroom under FRE 615), leave promptly.',
          'Do not discuss your testimony in the hallway where jurors might overhear.',
          'Ask retaining counsel whether you may be recalled -- if so, remain available.',
        ],
      },
      {
        subheading: 'The Rule on Witnesses (FRE 615)',
        body: [
          'Under FRE 615 (the "rule on witnesses"), the court must order witnesses excluded from the courtroom at a party\'s request so they cannot hear other witnesses\' testimony. The court may also do so on its own initiative. Expert witnesses are often exempt from this rule under an exception in FRE 615 that permits a party to designate a person whose presence is essential to presenting their claim or defense. However, this exemption is not automatic -- counsel must request it.',
        ],
        bullets: [
          'If exempt, you may remain in the courtroom during other testimony.',
          'If sequestered, you may not discuss the case with other witnesses.',
          'Ask counsel about your sequestration status before trial day.',
          'Violating a sequestration order can result in exclusion of your testimony.',
        ],
      },
      {
        subheading: 'Self-Assessment After Trial',
        body: [
          'Every trial is a learning opportunity. Conduct an honest self-assessment after your testimony is complete.',
        ],
        numberedList: [
          'Were your opinions clear and accessible to the jury?',
          'Did you maintain composure during cross-examination?',
          'Were there any surprises -- questions you did not anticipate?',
          'Did your demonstrative exhibits work effectively?',
          'Were you consistent with your deposition testimony?',
          "Were there moments when you felt you lost the jury's attention?",
          'What would you do differently next time?',
        ],
      },
      {
        subheading: 'Debrief with Counsel',
        body: [
          "After the trial concludes (or your testimony is complete), request a debrief with retaining counsel. Their perspective on your performance is invaluable -- they observed the jury's reactions and know which points landed.",
        ],
        bullets: [
          'Ask which parts of your testimony were most effective.',
          'Ask which answers on cross-examination concerned them.',
          'Discuss whether your demonstrative exhibits were helpful.',
          'Ask if there is anything they would suggest you change for future cases.',
          'This feedback loop is how experienced experts continuously improve.',
        ],
      },
      {
        subheading: 'Building Your Trial Testimony Skills Over Time',
        body: [
          'Trial testimony is a skill that improves with practice. The best expert witnesses are not born -- they are developed through repeated experience, honest self-assessment, and a commitment to continuous improvement.',
        ],
        bullets: [
          'Seek out trial testimony opportunities -- the more you testify, the better you become.',
          'Attend trials as an observer to study how other experts communicate.',
          'Consider mock trial or moot court exercises to practice in a low-stakes environment.',
          'Stay current in your field -- jurors and counsel will test whether your knowledge is up to date.',
          'Maintain a testimony log: case name, date, jurisdiction, topics, and lessons learned.',
        ],
      },
    ],
    keyTakeaway:
      'Every trial teaches you something. The difference between a good expert and a great expert is the willingness to honestly assess your performance and commit to getting better. Trial testimony is a craft -- treat it as one.',
  },
}

// ============================================================
// SCENARIO DATA - "The Unexpected Objection"
// ============================================================

export const SCENARIO_DATA = {
  title: 'The Unexpected Objection',
  setup:
    'You are testifying at trial as a construction defect expert. On direct examination, you have just finished explaining your methodology and are about to state your key opinion when opposing counsel raises an objection. The judge sustains the objection on narrow grounds -- you may not reference one specific document you relied upon because it was not properly disclosed in discovery. Retaining counsel looks momentarily flustered. You still need to deliver your opinion to the jury, but one of your supporting bases has just been removed.',

  choicePoints: [
    {
      title: 'Choice Point 1: Responding to the Sustained Objection',
      prompt:
        'The judge has sustained the objection. The document you planned to reference is excluded. Retaining counsel asks: "Setting aside Exhibit 14, can you still state your opinion?" How do you respond?',
      choices: [
        {
          id: 'a',
          text: 'Express frustration: "Your Honor, that document is critical to my analysis. Without it, my testimony is incomplete."',
          correct: false,
          consequence:
            'You have just told the jury that your opinion might be unreliable without this document. Opposing counsel will use your own words in closing argument: "Even the plaintiff\'s own expert admitted his testimony was incomplete." You have also inappropriately addressed the judge on an evidentiary matter -- that is counsel\'s job.',
          takeaway:
            "Never express frustration about evidentiary rulings. You are not an advocate. Accept the ruling and work within it. Addressing the judge directly about objections is the attorney's role, not yours.",
        },
        {
          id: 'b',
          text: 'Pivot smoothly: "Yes. My opinion is based on multiple sources of evidence. I can describe the remaining bases for my conclusion."',
          correct: true,
          consequence:
            'Excellent. You have demonstrated that your opinion is robust -- it does not depend on any single document. The jury sees a confident, well-prepared expert who can adapt. Retaining counsel will guide you through the remaining bases, and your credibility is intact.',
          takeaway:
            'A well-prepared expert has multiple bases for every opinion. If one is excluded, the opinion should still stand on its remaining foundations. This is why thorough preparation -- knowing every basis, not just the primary one -- is essential.',
        },
        {
          id: 'c',
          text: 'Try to reference the document indirectly: "Well, based on certain information I reviewed that I can\'t specifically name..."',
          correct: false,
          consequence:
            "The judge sustained the objection for a reason. Attempting to indirectly reference excluded evidence violates the court's ruling and may result in a contempt warning, a mistrial motion, or an instruction to the jury to disregard your testimony. You have also undermined your credibility with the judge.",
          takeaway:
            "When the court excludes evidence, the ruling is final (unless reversed on appeal). Never attempt to circumvent an evidentiary ruling through indirect references. Respect the court's authority.",
        },
      ],
    },
    {
      title: 'Choice Point 2: The Cross-Examination Follow-Up',
      prompt:
        'During cross-examination, opposing counsel returns to the excluded document: "Isn\'t it true that Exhibit 14 was one of the primary documents you relied upon in forming your opinion?" The jury is watching closely. How do you respond?',
      choices: [
        {
          id: 'a',
          text: '"I relied on numerous documents and sources. Exhibit 14 was one of many, and my opinion is well-supported by the remaining evidence I described on direct examination."',
          correct: true,
          consequence:
            'Strong answer. You have acknowledged the document without overstating its importance, and you have redirected the jury to the bases you already described. Opposing counsel cannot impeach you because you did not deny relying on the document -- you simply contextualized it. The jury sees consistency and confidence.',
          takeaway:
            'On cross-examination, do not deny facts that are true. Instead, provide context. Acknowledging that you relied on a document while emphasizing that your opinion has multiple independent bases is both honest and effective.',
        },
        {
          id: 'b',
          text: '"The judge said I can\'t talk about that document."',
          correct: false,
          consequence:
            'This answer is factually incorrect -- the judge excluded the document from your direct testimony, but opposing counsel can still ask about it on cross-examination. More importantly, this answer makes you look evasive and suggests you are hiding behind a procedural ruling rather than defending your opinion on its merits.',
          takeaway:
            'Evidentiary rulings are nuanced. The exclusion of a document on direct does not necessarily prevent opposing counsel from asking about it on cross. Understand the scope of the ruling. When in doubt, answer honestly and let counsel object if appropriate.',
        },
        {
          id: 'c',
          text: '"Yes, it was the most important document in my analysis. Without it, I honestly have concerns about stating my opinion with the same level of certainty."',
          correct: false,
          consequence:
            'You have just destroyed your own opinion in front of the jury. Opposing counsel will quote this answer in closing argument. Retaining counsel cannot rehabilitate an expert who has voluntarily undermined their own conclusions. The jury will likely give your testimony little or no weight.',
          takeaway:
            'Never undermine your own opinion on the stand. If you truly believed the excluded document was indispensable, that should have been communicated to counsel before trial so they could seek a different ruling. On the stand, your job is to present your opinion as strongly as the evidence supports.',
        },
      ],
      redirectIfWrongCp1:
        'Even though your first response was not ideal, opposing counsel still presses the issue during cross-examination. This is your opportunity to recover.',
    },
  ],

  summaryPrinciples: [
    "Evidentiary rulings are the attorney's problem, not yours. Accept them gracefully and work within the constraints.",
    'A well-prepared expert has multiple independent bases for every opinion. If one is excluded, the opinion should still stand.',
    "Never attempt to circumvent a court's evidentiary ruling through indirect references or workarounds.",
    'On cross-examination, acknowledge facts honestly but provide context. Denial of obvious facts destroys credibility.',
    'Never undermine your own opinion on the stand. If you have concerns about the strength of your analysis, resolve them before trial, not during testimony.',
  ],
}

// ============================================================
// QUIZ DATA
// ============================================================

export const PASS_SCORE = 8
export const TOTAL_QUESTIONS = 10

export const QUIZ_DATA = {
  questions: [
    {
      id: 'q1',
      text: 'What is the most significant difference between deposition testimony and trial testimony?',
      options: [
        { id: 'a', text: 'Trial testimony is not under oath', correct: false },
        {
          id: 'b',
          text: 'At trial, you are speaking to jurors who need complex concepts translated into plain language',
          correct: true,
        },
        {
          id: 'c',
          text: 'Cross-examination is not permitted at trial',
          correct: false,
        },
        {
          id: 'd',
          text: 'The expert may refuse to answer questions at trial',
          correct: false,
        },
      ],
      explanation:
        'The fundamental difference is the audience. At deposition, you speak to attorneys who understand the case. At trial, you speak to jurors who may have no background in your field, which changes your vocabulary, pace, and communication style.',
    },
    {
      id: 'q2',
      text: 'Under FRE 702, what must the court determine before allowing an expert to testify?',
      options: [
        {
          id: 'a',
          text: 'That the expert has published at least one peer-reviewed article on the topic',
          correct: false,
        },
        {
          id: 'b',
          text: 'That the expert has testified in at least three prior cases',
          correct: false,
        },
        {
          id: 'c',
          text: 'That the expert has specialized knowledge that will help the trier of fact understand the evidence',
          correct: true,
        },
        {
          id: 'd',
          text: "That the expert agrees with the retaining party's legal theory",
          correct: false,
        },
      ],
      explanation:
        'FRE 702 requires that the expert be qualified by knowledge, skill, experience, training, or education, and that their testimony will help the trier of fact. There is no requirement for publications or prior testimony.',
    },
    {
      id: 'q3',
      text: 'During direct examination, where should you primarily direct your answers?',
      options: [
        { id: 'a', text: 'To the questioning attorney', correct: false },
        { id: 'b', text: 'To the court reporter', correct: false },
        { id: 'c', text: 'To the judge', correct: false },
        { id: 'd', text: 'To the jury', correct: true },
      ],
      explanation:
        "On direct examination, you should listen to the attorney's question, then turn to the jury to deliver your answer. The jury is your audience -- they are the ones who need to understand your opinions.",
    },
    {
      id: 'q4',
      text: 'What is the most effective defense against impeachment by prior inconsistent statement?',
      options: [
        {
          id: 'a',
          text: 'Denying that you gave the prior testimony',
          correct: false,
        },
        {
          id: 'b',
          text: 'Explaining that depositions are not as important as trial testimony',
          correct: false,
        },
        {
          id: 'c',
          text: 'Maintaining consistency between your deposition testimony and your trial testimony',
          correct: true,
        },
        {
          id: 'd',
          text: 'Asking the judge to exclude your deposition transcript',
          correct: false,
        },
      ],
      explanation:
        'The best defense against impeachment is consistency. If your trial testimony is identical to your deposition testimony, there is nothing for opposing counsel to impeach. This requires thorough preparation, including re-reading your entire deposition transcript before trial.',
    },
    {
      id: 'q5',
      text: 'Which cross-examination technique involves using your concession from one answer as the premise for the next question?',
      options: [
        { id: 'a', text: 'Cherry-picking', correct: false },
        { id: 'b', text: 'Looping', correct: true },
        { id: 'c', text: 'The concession cascade', correct: false },
        { id: 'd', text: 'Impeachment', correct: false },
      ],
      explanation:
        'Looping is the technique of taking a concession from one answer and using it as the foundation for the next question, building a chain of admissions. The defense is to listen to each question independently and consider where the line of questioning is heading before agreeing.',
    },
    {
      id: 'q6',
      text: 'What is the purpose of redirect examination?',
      options: [
        {
          id: 'a',
          text: 'To introduce entirely new opinions not covered on direct examination',
          correct: false,
        },
        {
          id: 'b',
          text: 'To address and repair damage done during cross-examination',
          correct: true,
        },
        {
          id: 'c',
          text: "To allow the expert to argue with opposing counsel's characterization",
          correct: false,
        },
        {
          id: 'd',
          text: 'To give the expert a second opportunity for a complete direct examination',
          correct: false,
        },
      ],
      explanation:
        'Redirect examination is limited to topics raised during cross-examination. Its purpose is to allow retaining counsel to rehabilitate the expert by addressing incomplete answers, out-of-context quotes, or concessions that need qualification.',
    },
    {
      id: 'q7',
      text: 'When explaining a complex technical concept to the jury, which approach is most effective?',
      options: [
        {
          id: 'a',
          text: 'Using precise technical terminology to demonstrate your expertise',
          correct: false,
        },
        {
          id: 'b',
          text: 'Reading directly from your report to ensure accuracy',
          correct: false,
        },
        {
          id: 'c',
          text: "Using everyday analogies that connect the concept to the juror's existing knowledge",
          correct: true,
        },
        {
          id: 'd',
          text: 'Speaking as quickly as possible to convey maximum information',
          correct: false,
        },
      ],
      explanation:
        "Analogies create bridges between the juror's existing knowledge and the new information you are presenting. The most effective experts translate complex concepts into everyday comparisons that any person can understand.",
    },
    {
      id: 'q8',
      text: 'What is the key principle when creating demonstrative exhibits for trial?',
      options: [
        {
          id: 'a',
          text: 'Include as much information as possible on each exhibit to minimize the total number',
          correct: false,
        },
        {
          id: 'b',
          text: 'One concept per exhibit, with large fonts and labels visible from the jury box',
          correct: true,
        },
        {
          id: 'c',
          text: 'Use small fonts so more data can fit on the screen',
          correct: false,
        },
        {
          id: 'd',
          text: 'Demonstrative exhibits are optional and rarely help jury comprehension',
          correct: false,
        },
      ],
      explanation:
        'Effective demonstrative exhibits are simple, large, legible, and focused on a single concept. Jurors are typically 15-25 feet from the screen or easel, so visibility is critical. Overloaded exhibits confuse rather than clarify.',
    },
    {
      id: 'q9',
      text: 'Under FRE 704(a), can an expert witness testify to an "ultimate issue" in a civil case?',
      options: [
        {
          id: 'a',
          text: 'No -- experts may never state opinions on ultimate issues',
          correct: false,
        },
        {
          id: 'b',
          text: 'Yes -- but only if the judge specifically permits it during voir dire',
          correct: false,
        },
        {
          id: 'c',
          text: 'Yes -- in civil cases, an expert may testify to an ultimate issue',
          correct: true,
        },
        {
          id: 'd',
          text: 'Only if both parties stipulate to it',
          correct: false,
        },
      ],
      explanation:
        'FRE 704(a) permits expert testimony on ultimate issues in civil cases. The restriction in FRE 704(b) applies only to criminal cases regarding a defendant\'s mental state. In practice, experts should still frame opinions technically rather than using legal conclusions like "negligent."',
    },
    {
      id: 'q10',
      text: 'After completing your trial testimony, what is the most important step for professional development?',
      options: [
        {
          id: 'a',
          text: 'Immediately filing your invoice for payment',
          correct: false,
        },
        {
          id: 'b',
          text: 'Conducting an honest self-assessment and debriefing with counsel',
          correct: true,
        },
        {
          id: 'c',
          text: 'Discussing your testimony publicly to build your reputation',
          correct: false,
        },
        {
          id: 'd',
          text: "Reviewing the opposing expert's testimony to find errors",
          correct: false,
        },
      ],
      explanation:
        'Every trial is a learning opportunity. Conducting an honest self-assessment -- evaluating your clarity, composure, handling of cross-examination, and effectiveness of exhibits -- combined with feedback from retaining counsel, is how experienced experts continuously improve their testimony skills.',
    },
  ],
}
