// ============================================================
// depositionData.js
// All content for the "Deposition as an Expert Witness"
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

export const MODULE_TITLE = 'Deposition as an Expert Witness';
export const MODULE_SUBTITLE = '~60 minutes \u00b7 8 Lessons \u00b7 1 Scenario \u00b7 1 Knowledge Check';

export const LESSON_SEQUENCE = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const TOTAL_LESSONS = 8;

export function getNextLesson(lessonId) {
  const idx = LESSON_SEQUENCE.indexOf(lessonId);
  return idx >= 0 && idx < LESSON_SEQUENCE.length - 1 ? LESSON_SEQUENCE[idx + 1] : null;
}

export function getLessonIndex(lessonId) {
  return LESSON_SEQUENCE.indexOf(lessonId) + 1; // 1-based
}

// ============================================================
// LESSONS
// ============================================================

export const LESSONS = {
  '1': {
    title: 'What Is a Deposition and Why It Matters',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'A deposition is sworn, out-of-court testimony recorded by a court reporter and taken under oath. For an expert witness, the deposition is one of the most consequential events in the litigation. It is where opposing counsel gets their first -- and often most important -- opportunity to probe, challenge, and attempt to undermine your opinions before trial.',
          'Understanding what a deposition is, why each party wants it, and how it differs from other forms of testimony is essential to performing well when your turn comes.',
        ],
      },
      {
        subheading: 'Definition and Legal Foundation',
        body: [
          'Under the Federal Rules of Civil Procedure, Rule 30 governs depositions by oral examination. FRCP 26(b)(4) specifically addresses discovery of expert testimony, providing that a party may depose any person who has been identified as an expert whose opinions may be presented at trial.',
          'The deposition creates a transcript -- a verbatim, word-for-word record of every question asked and every answer given. This transcript becomes a litigation weapon that can be used at trial for impeachment, as a substitute for live testimony, or to support or oppose motions.',
        ],
      },
      {
        subheading: 'Strategic Purpose for Each Party',
        body: ['Each side approaches an expert deposition with different objectives:'],
        bullets: [
          'Opposing counsel deposes you to: discover the full scope of your opinions, identify weaknesses in your methodology, lock you into specific positions that can be used at trial, test whether you can be rattled or led into overstatements, and gather ammunition for a Daubert challenge or motion in limine.',
          'Retaining counsel defends the deposition to: protect you from improper questions, preserve objections for the record, prevent you from being tricked into concessions, and assess how you will perform in front of a jury.',
          'You, the expert, should view the deposition as: an opportunity to demonstrate competence and credibility, a preview of trial cross-examination, and a high-stakes test of your ability to communicate complex opinions clearly under adversarial conditions.',
        ],
      },
      {
        subheading: 'How Expert Depositions Differ from Fact Witness Depositions',
        body: [
          'Fact witnesses testify about what they personally observed or experienced. Expert witnesses testify about their professional opinions, the methodology behind those opinions, and the materials they relied on. This difference has important practical consequences:',
        ],
        comparisonTable: [
          { aspect: 'Subject matter', 'fact witness': 'Personal knowledge and observations', 'expert witness': 'Professional opinions, methodology, and bases' },
          { aspect: 'Preparation materials', 'fact witness': 'Limited -- typically own documents', 'expert witness': 'Extensive -- report, materials reviewed, publications, prior testimony' },
          { aspect: 'Scope of questioning', 'fact witness': 'What happened?', 'expert witness': 'What do you believe, why, and can it withstand scrutiny?' },
          { aspect: 'Use of treatises', 'fact witness': 'Rare', 'expert witness': 'Common -- FRE 803(18) allows learned treatises to be used during cross-examination' },
          { aspect: 'Impeachment risk', 'fact witness': 'Prior inconsistent statements', 'expert witness': 'Prior testimony, publications, report inconsistencies, methodology challenges' },
        ],
      },
    ],
    keyTakeaway:
      'A deposition is sworn testimony that creates a permanent record. Everything you say can and will be used -- to support you or to undermine you. Treat every question as if it will be read aloud to a jury.',
  },

  '2': {
    title: 'Preparation: Before You Walk In',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'Preparation is the single most important factor in deposition performance. The expert who walks in underprepared is the expert who gets impeached. Every hour you invest in preparation saves you from potential traps and credibility damage that cannot be undone once the transcript is created.',
        ],
      },
      {
        subheading: 'Re-Mastering Your Report',
        body: [
          'Your expert report is the script that opposing counsel will use to question you. Before the deposition, you must know your report cold -- not just the opinions, but every factual statement, every assumption, every citation, and every limitation you disclosed.',
        ],
        bullets: [
          'Re-read the entire report, including appendices and exhibits.',
          'For every sentence, ask: "Can I explain this clearly if asked?" and "Is there anything I would change?"',
          'Identify your weakest statements -- opposing counsel will find them, and you should get there first.',
          'If your opinions have changed since writing the report, discuss supplementation with retaining counsel before the deposition. FRCP 26(e) requires supplementation when disclosures become incomplete or incorrect.',
        ],
      },
      {
        subheading: 'The Preparation Session with Counsel',
        body: [
          'Retaining counsel should conduct a thorough preparation session with you before the deposition. This is not coaching -- it is preparation. The distinction matters: counsel can help you understand the process and anticipate questions, but should never tell you what to say.',
        ],
        bullets: [
          'Review likely lines of attack based on the opposing expert report and case posture.',
          'Practice answering difficult questions -- especially on methodology limitations and scope boundaries.',
          'Discuss the objection protocol: how counsel will object, when you should wait before answering, and the rare circumstances when counsel may instruct you not to answer.',
          'Clarify logistics: location, timing, breaks, who will be present, and whether the deposition will be videotaped.',
        ],
      },
      {
        subheading: 'Reviewing Key Documents and Prior Testimony',
        body: [
          'Opposing counsel will likely ask what you reviewed in preparation for the deposition. Be deliberate about what you bring and what you re-review:',
        ],
        bullets: [
          'Your expert report and all attachments.',
          'The materials you listed in your "Materials Reviewed" section -- you should be able to discuss any item on that list.',
          'Any prior deposition or trial testimony you have given in other cases -- opposing counsel may have obtained transcripts and will look for inconsistencies.',
          'Your publications, if any, that relate to the subject matter -- statements in publications can be used as prior inconsistent positions.',
        ],
      },
      {
        subheading: 'Anticipating Lines of Attack',
        body: [
          'Think like opposing counsel. The most effective preparation exercise is to read your own report as if you were trying to discredit it:',
        ],
        bullets: [
          'Where are the gaps in your analysis?',
          'What assumptions could be challenged?',
          'What alternative conclusions could a reasonable expert reach?',
          'What materials did you not review that opposing counsel might argue you should have?',
          'Is there anything in your prior testimony or publications that conflicts with your current opinions?',
        ],
      },
    ],
    keyTakeaway:
      'The deposition is won or lost in preparation. Know your report cold, anticipate the lines of attack, and walk in with a plan -- not just hope.',
  },

  '3': {
    title: 'Rules and Mechanics of the Deposition Process',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'Understanding the mechanics of a deposition removes uncertainty and allows you to focus on substance rather than procedure. The deposition follows a defined structure with specific rules about who can be present, how objections work, and what happens with the transcript.',
        ],
      },
      {
        subheading: 'Who Is in the Room',
        body: [
          'A typical expert deposition includes the following participants:',
        ],
        bullets: [
          'The deposing attorney (opposing counsel) -- asks the questions and controls the pace.',
          'Retaining counsel -- defends the deposition by making objections and, in rare cases, instructing you not to answer.',
          'The court reporter -- records every word spoken. Speak clearly, avoid nodding or gesturing, and do not talk over others.',
          'A videographer (if the deposition is being recorded on video) -- the video may be played for the jury at trial.',
          'Other attorneys -- in multi-party cases, multiple attorneys may attend and take turns questioning you.',
          'You, the expert witness -- your role is to answer questions truthfully, accurately, and within the scope of your expertise.',
        ],
      },
      {
        subheading: 'The Oath and the Record',
        body: [
          'Before questioning begins, the court reporter will administer an oath. You are swearing to tell the truth, the whole truth, and nothing but the truth. This oath carries the same legal weight as testimony in open court -- perjury in a deposition is a criminal offense.',
          'Everything you say from this point forward is "on the record." Side conversations, comments during breaks near the court reporter, and even casual remarks can end up in the transcript. Treat the entire deposition as being recorded from the moment you arrive until the moment you leave.',
        ],
      },
      {
        subheading: 'Objections and Instructions Not to Answer',
        body: [
          'Retaining counsel may object to questions during the deposition. In federal practice, FRCP 30(c)(2) limits objections to those that are "stated concisely in a non-argumentative and non-suggestive manner." The most common objections are:',
        ],
        bullets: [
          '"Objection, form" -- the question is ambiguous, compound, assumes facts, or is otherwise defective. You typically still answer after this objection.',
          '"Objection, asked and answered" -- the question has already been asked. You typically still answer.',
          '"Instruction not to answer" -- retaining counsel directs you not to answer. This is permitted only in narrow circumstances: to preserve privilege, to enforce a court-ordered limitation, or to protect against harassment. If instructed not to answer, follow the instruction.',
        ],
        afterList: 'When counsel objects, pause. Wait for the objection to be stated. If no instruction not to answer follows, answer the question. This pause-and-wait rhythm is important -- it gives your attorney time to protect the record.',
      },
      {
        subheading: 'Breaks, Documents, and Exhibits',
        body: [
          'You are entitled to take reasonable breaks during the deposition. However, you should not take a break while a question is pending -- answer the question first, then request a break.',
          'Opposing counsel may hand you documents during the deposition and ask you to review them. Take your time. Read the entire document before answering questions about it. Opposing counsel may mark documents as deposition exhibits, which will be appended to the transcript.',
        ],
      },
    ],
    keyTakeaway:
      'The deposition is a formal proceeding with specific rules. Understand the mechanics -- who is present, how objections work, and when to pause -- so you can focus entirely on giving accurate, measured answers.',
  },

  '4': {
    title: 'The Art of Answering Questions',
    estimatedMinutes: 9,
    sections: [
      {
        subheading: null,
        body: [
          'How you answer questions in a deposition matters as much as what you say. The goal is not to be clever, combative, or evasive -- it is to be accurate, concise, and unimpeachable. Mastering the art of answering deposition questions is a skill that separates experienced experts from those who create problems for themselves and their retaining counsel.',
        ],
      },
      {
        subheading: 'Listen, Pause, Answer',
        body: [
          'This three-step cadence is the foundation of good deposition technique:',
        ],
        numberedList: [
          'Listen to the entire question. Do not begin formulating your answer while the attorney is still speaking. Many deposition errors occur because the expert anticipated the question incorrectly.',
          'Pause before answering. A brief pause (2-3 seconds) gives you time to consider the question, ensures you are answering what was actually asked, and gives retaining counsel time to interpose an objection if needed.',
          'Answer the question that was asked -- and only that question. Resist the urge to explain, elaborate, or volunteer additional information.',
        ],
      },
      {
        subheading: 'Answer Only What Was Asked',
        body: [
          'The most common mistake experts make in depositions is volunteering information. Every additional word you speak beyond what the question requires is a gift to opposing counsel -- it opens new lines of inquiry and creates new opportunities for impeachment.',
        ],
        comparisonTable: [
          { question: '"Did you visit the site?"', 'poor answer': '"Yes, I visited the site on March 15 and I noticed the flashing was deteriorated and I also took photos of the drainage system..."', 'better answer': '"Yes."' },
          { question: '"What methodology did you use?"', 'poor answer': '"Well, I considered several approaches but ultimately I decided on a visual inspection supplemented by moisture testing because..."', 'better answer': '"Visual inspection supplemented by moisture testing, as described in Section VI of my report."' },
        ],
        afterList: 'If the attorney wants more detail, they will ask a follow-up question. Let them do the work.',
      },
      {
        subheading: 'The Power of Short Answers',
        body: [
          '"Yes," "No," and "I don\'t know" are complete answers. Many experts feel uncomfortable giving short answers because they want to explain their reasoning. But the deposition is not a lecture -- it is an adversarial proceeding where every word you speak is recorded and can be used against you.',
          'Short answers give opposing counsel less material to work with, reduce the risk of inadvertent concessions, and project confidence and control.',
        ],
      },
      {
        subheading: '"I Don\'t Know" and "I Don\'t Recall"',
        body: [
          'These are two of the most powerful and underused phrases in deposition testimony. They are not admissions of weakness -- they are honest, accurate answers that protect you from speculation.',
        ],
        bullets: [
          '"I don\'t know" -- use this when the question asks about something outside your knowledge. You are not expected to know everything, and pretending you do is a fast track to impeachment.',
          '"I don\'t recall" -- use this when you once knew but cannot currently remember. This is different from "I don\'t know." If you say "I don\'t recall," be prepared for follow-up questions designed to refresh your recollection.',
          'Never guess. If you are not sure, say so. Speculative answers in a deposition are devastating at trial because opposing counsel will strip away the qualifier and present your guess as a firm position.',
        ],
      },
      {
        subheading: 'Qualifying Your Answers',
        body: [
          'Some questions cannot be answered with a simple yes or no because the question contains an incorrect assumption or is misleadingly framed. When this happens, you have the right -- and the obligation -- to qualify your answer:',
        ],
        bullets: [
          '"I can\'t answer that question as phrased because it assumes [X]."',
          '"That question is compound. Could you break it into separate questions?"',
          '"If you\'re asking [specific interpretation], then [answer]. If you\'re asking [different interpretation], the answer is different."',
          '"Subject to [qualification], yes."',
        ],
        afterList: 'Qualifying your answers is not evasion -- it is precision. An expert who qualifies appropriately demonstrates the careful thinking that courts expect.',
      },
    ],
    keyTakeaway:
      'Listen fully, pause, then answer only what was asked. Short, precise answers protect you. "I don\'t know" is always better than a guess.',
  },

  '5': {
    title: 'Opposing Counsel\'s Questioning Techniques',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'Opposing counsel is a skilled professional whose job is to weaken your opinions and your credibility. Understanding their common questioning techniques allows you to recognize them in real time and respond effectively. This lesson is not about outsmarting the attorney -- it is about recognizing patterns so you can stay accurate and composed.',
        ],
      },
      {
        subheading: 'The Friendly Warm-Up',
        body: [
          'Most depositions begin with easy, conversational questions about your background, education, and experience. This serves two purposes for opposing counsel: it builds a baseline of your demeanor for the jury (if the deposition is videotaped), and it lulls you into a comfortable rhythm of saying "yes" before the difficult questions begin.',
          'Stay alert during the warm-up. The same attentiveness you apply to substantive questions should apply here. Background questions can contain subtle traps -- for example, characterizing your specialty in a way that narrows your qualifications, or establishing you have never testified in a particular type of case.',
        ],
      },
      {
        subheading: 'Leading Questions',
        body: [
          'A leading question suggests its own answer: "Isn\'t it true that...?" or "Would you agree that...?" Leading questions are the primary tool of deposition cross-examination.',
          'When faced with a leading question, resist the urge to simply agree. Listen carefully to the specific words used. The question may contain subtle inaccuracies, characterize your opinion differently than you would, or bundle an assumption you do not accept.',
          'You are never required to accept the attorney\'s framing. If the question misstates your position, say so: "That is not what I said. My opinion is [accurate statement]."',
        ],
      },
      {
        subheading: 'Hypothetical Questions',
        body: [
          'Opposing counsel may pose hypothetical scenarios: "Assume for me that [set of facts]. Would that change your opinion?" Hypotheticals are powerful because they can force you to concede that under different facts, a different conclusion might follow -- which opposing counsel will then use to argue that your opinion depends on disputed facts.',
        ],
        bullets: [
          'Before answering, make sure you understand the full hypothetical. Ask for clarification if needed.',
          'You can accept the hypothetical and answer within its framework, or you can note that the hypothetical does not reflect the actual facts of the case.',
          'If the hypothetical is unrealistic or incomplete, say so: "That hypothetical omits [critical fact], which would change the analysis."',
        ],
      },
      {
        subheading: 'Rapid-Fire and Fatigue Tactics',
        body: [
          'Some attorneys use a rapid pace of questioning to prevent you from thinking carefully about each answer. The goal is to exhaust you, get you into a rhythm of quick responses, and catch you making concessions you would not make with more deliberation.',
          'The antidote is simple: maintain your pace. You control the speed of your answers. There is no rule requiring you to match the attorney\'s pace. Take your time, pause before every answer, and request a break if you are fatigued.',
        ],
      },
      {
        subheading: 'Silence as a Weapon',
        body: [
          'After you finish an answer, some attorneys will remain silent, waiting. The instinct is to fill the silence by continuing to talk -- adding qualifications, explanations, or context you were not asked for. This is one of the most effective techniques in a deposing attorney\'s toolkit.',
          'When you have answered the question, stop. Sit comfortably in the silence. The next move is the attorney\'s, not yours.',
        ],
      },
    ],
    keyTakeaway:
      'Opposing counsel uses specific techniques -- leading questions, hypotheticals, pace changes, and silence -- to extract concessions. Recognizing these techniques is the first step to neutralizing them.',
  },

  '6': {
    title: 'Common Traps and How to Avoid Them',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'Beyond general questioning techniques, experienced deposing attorneys employ specific traps designed to create impeachment material for trial. Knowing these traps in advance allows you to identify them in real time and respond with precision rather than falling into a prepared sequence.',
        ],
      },
      {
        subheading: 'The Absolute Trap',
        body: [
          'The attorney asks you to confirm an absolute statement: "Is it fair to say that you always [do X]?" or "There are no circumstances under which [Y] would be appropriate, correct?"',
          'Absolute statements are almost always wrong in professional practice. The moment you agree to an absolute, opposing counsel has a clip they can play for the jury alongside a counterexample. Respond with precision:',
        ],
        bullets: [
          '"In my experience, [X] is the standard practice in the vast majority of cases."',
          '"I would not say always. There are circumstances where a different approach may be appropriate, but in this case..."',
          '"Generally, yes. But that general statement does not apply to every situation without exception."',
        ],
      },
      {
        subheading: 'Scope Creep',
        body: [
          'The attorney asks a question that falls outside the scope of your engagement: "Doctor, based on your examination of the building, is it safe for occupancy?" If your report addressed structural deficiencies but not building safety, answering this question takes you beyond your opinions and into territory where you are vulnerable.',
        ],
        bullets: [
          'Know the boundaries of your engagement before the deposition begins.',
          'When a question falls outside your scope, say so clearly: "That question is outside the scope of my engagement. I was retained to [specific scope], and my opinions are limited to that scope."',
          'Do not be tempted to offer opinions on topics outside your engagement, even if you have the expertise to do so. Opinions offered outside your report scope were not subject to the same analytical rigor and create Daubert exposure.',
        ],
      },
      {
        subheading: 'The Learned Treatise Trap',
        body: [
          'Under FRE 803(18), statements in learned treatises, periodicals, or pamphlets can be read into evidence during cross-examination of an expert if established as reliable authority. Opposing counsel exploits this by asking: "Are you familiar with [Author]\'s textbook?" followed by "Would you consider it authoritative?"',
          'If you agree a source is authoritative, opposing counsel can then read passages from it that contradict your opinion and present them as substantive evidence. This is one of the most powerful cross-examination tools against expert witnesses.',
        ],
        bullets: [
          'Never broadly agree that an entire textbook is "authoritative." No textbook is correct on every point.',
          'Instead: "I am familiar with [Author]\'s work. I would need to see the specific passage you are referring to before I could comment on whether I agree with it."',
          'If shown a specific passage: "I have read this passage. I [agree/disagree] with this specific statement because [reason]."',
          'You can acknowledge familiarity with a text without endorsing it as authoritative in its entirety.',
        ],
      },
      {
        subheading: 'The Inconsistency Trap',
        body: [
          'The attorney reads a passage from your prior testimony, a publication, or a prior report and asks: "Isn\'t it true that in [prior case/publication], you said [X]? And now you\'re saying [Y]?"',
          'Legitimate evolution of professional opinion is normal. But the way you handle the question determines whether the jury sees growth or contradiction:',
        ],
        bullets: [
          'If your position has genuinely changed: "My understanding of this issue has evolved based on [new research/experience/data]. In this case, the facts and current scientific understanding support [current opinion]."',
          'If the characterization is inaccurate: "That is not an accurate characterization of what I said in [prior context]. What I actually said was [accurate statement], which is consistent with my opinion in this case."',
        ],
      },
      {
        subheading: 'The Compensation Bias Trap',
        body: [
          'The attorney asks about your compensation to suggest you are a "hired gun": "How much have you been paid in this case?" followed by "And you want to keep getting hired, correct?"',
          'Prepare a straightforward answer: "I am compensated for my time, not for my opinions. My rate is [rate] per hour regardless of the outcome of the case or the substance of my opinions."',
          'Never become defensive about compensation. It is a legitimate area of inquiry, and a composed response undermines the implication.',
        ],
      },
    ],
    keyTakeaway:
      'The most dangerous traps -- absolutes, scope creep, learned treatises, inconsistencies, and compensation bias -- are all avoidable with preparation and precise language. Recognize the setup before you fall into the sequence.',
  },

  '7': {
    title: 'Maintaining Composure and Credibility',
    estimatedMinutes: 6,
    sections: [
      {
        subheading: null,
        body: [
          'At deposition -- and especially at trial -- your credibility is your most valuable asset. Credibility is not just about being right; it is about being perceived as honest, careful, fair, and unflappable. An expert who loses composure, argues with counsel, or appears evasive damages their credibility in ways that no correct answer can repair.',
        ],
      },
      {
        subheading: 'Emotional Control',
        body: [
          'Opposing counsel may ask questions designed to frustrate, embarrass, or provoke you. They may mischaracterize your opinions, imply you are dishonest, or suggest your work is incompetent. These questions serve a deliberate purpose: if you react emotionally, the jury sees an expert who cannot handle scrutiny.',
        ],
        bullets: [
          'Anger signals defensiveness. If you get angry, the jury assumes the attorney struck a nerve.',
          'Frustration signals impatience. An impatient expert appears arrogant or unwilling to engage.',
          'Sarcasm signals contempt. A sarcastic expert loses the jury\'s trust immediately.',
          'The correct response to every provocation is the same: a calm, measured, factual answer.',
        ],
      },
      {
        subheading: 'Avoiding Argumentative Exchanges',
        body: [
          'Do not argue with the attorney. Your role is to answer questions, not to win debates. When you feel the urge to argue, redirect to your opinions:',
        ],
        bullets: [
          'Instead of: "That\'s a ridiculous question" -- try: "I\'ll answer the question. [answer]."',
          'Instead of: "You\'re misrepresenting my opinion" -- try: "To be precise, my opinion is [accurate statement]."',
          'Instead of: "I already answered that" -- try: "As I stated earlier, [brief restatement]."',
        ],
        afterList: 'The transcript does not capture tone, but the video does. If the deposition is videotaped, the jury will see exactly how you handled the exchange.',
      },
      {
        subheading: 'Body Language on Video',
        body: [
          'If the deposition is videotaped, your non-verbal communication matters as much as your words:',
        ],
        bullets: [
          'Maintain a neutral, attentive posture. Sit upright, face the camera or the attorney (as instructed).',
          'Make natural eye contact. Do not look away frequently -- it suggests evasion.',
          'Avoid fidgeting, sighing, eye-rolling, or crossing your arms. Each of these reads as discomfort, impatience, or defensiveness on camera.',
          'Keep your hands still or use natural, restrained gestures. Nervous hand movements are amplified on video.',
        ],
      },
      {
        subheading: 'Credibility as Your Most Valuable Asset',
        body: [
          'Judges and juries evaluate experts on credibility as much as qualifications. Credibility comes from consistency (your deposition testimony matches your report and your trial testimony), candor (you acknowledge limitations and uncertainties rather than pretending they do not exist), fairness (you apply the same standards to both sides), and precision (you say exactly what you mean and do not overstate or understate).',
          'A single moment of perceived dishonesty or evasion can undermine an entire testimony. Conversely, an expert who calmly acknowledges a fair criticism earns more trust than one who refuses to concede anything.',
        ],
      },
    ],
    keyTakeaway:
      'Your credibility is built through composure, candor, and consistency. Never argue, never lose your temper, and never sacrifice long-term credibility for a short-term point.',
  },

  '8': {
    title: 'The Deposition Transcript and Post-Deposition Considerations',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'The deposition does not end when the questioning stops. What happens after the deposition -- reviewing the transcript, considering supplementation, and applying lessons learned -- is an important part of the process that many experts overlook.',
        ],
      },
      {
        subheading: 'Reviewing the Transcript: FRCP 30(e)',
        body: [
          'Under FRCP 30(e), you have the right to review the transcript and submit an errata sheet noting changes in "form or substance" within 30 days of being notified that the transcript is available. This is commonly known as "reading and signing."',
        ],
        bullets: [
          'Always exercise your right to review. Transcription errors are common, especially with technical terminology.',
          'Errata sheets for typographical corrections are routine and non-controversial.',
          'Substantive changes -- altering the meaning of an answer -- are permitted but will be heavily scrutinized. Opposing counsel will highlight every substantive change and argue that your original answer was more truthful.',
          'If you discover a substantive error, discuss with retaining counsel before filing the errata. A well-explained correction is far less damaging than an unexplained one.',
        ],
      },
      {
        subheading: 'How the Deposition Is Used at Trial',
        body: [
          'Your deposition transcript becomes a tool that both sides can use at trial:',
        ],
        bullets: [
          'Impeachment: If your trial testimony differs from your deposition testimony, opposing counsel will read the deposition answer to the jury and ask you to explain the inconsistency. This is the most common use of deposition transcripts.',
          'Substantive evidence: Under FRCP 32(a), deposition testimony can be used as substantive evidence in certain circumstances -- for example, if the witness is unavailable for trial.',
          'Motion practice: Deposition testimony supports and opposes summary judgment motions, Daubert motions, and motions in limine. What you say at deposition directly affects whether your opinions make it to the jury.',
          'Read-ins: If specific deposition exchanges are particularly favorable, either side may read them into the record at trial.',
        ],
        afterList: 'This is why consistency between your report, deposition testimony, and trial testimony is critical. Every inconsistency is a potential impeachment moment.',
      },
      {
        subheading: 'Supplementing Your Report Post-Deposition',
        body: [
          'Depositions sometimes reveal issues that warrant supplementing your report:',
        ],
        bullets: [
          'If you identified an error in your report during deposition preparation, issue a supplemental report correcting it (FRCP 26(e)).',
          'If new documents were produced after your deposition that affect your opinions, a supplemental report may be appropriate.',
          'If you realized during the deposition that your report did not adequately address a particular issue, discuss supplementation with retaining counsel.',
          'Do not issue a supplemental report solely to "fix" deposition answers you wish you had given differently -- this will be transparent and damaging.',
        ],
      },
      {
        subheading: 'Lessons for Next Time',
        body: [
          'After every deposition, conduct a brief self-assessment:',
        ],
        bullets: [
          'What questions did you handle well?',
          'Where were you caught off guard?',
          'Did you volunteer information beyond what was asked?',
          'Were there areas of your report that proved harder to defend than expected?',
          'Did you maintain composure throughout, or were there moments of frustration?',
        ],
        afterList: 'Each deposition makes you a better expert witness. The lessons you learn from one deposition directly improve your performance in the next one.',
      },
    ],
    keyTakeaway:
      'The transcript is permanent and will follow you to trial. Always review it under FRCP 30(e), maintain consistency across every stage of litigation, and treat each deposition as a learning experience for the next.',
  },
};

// ============================================================
// SCENARIO: "The Expert Under Fire"
// ============================================================

export const SCENARIO_DATA = {
  title: 'The Expert Under Fire',
  setup:
    'You are a structural engineering expert retained by the plaintiff in a construction defect case. The opposing party has retained its own expert, and now opposing counsel is deposing you. You have submitted your report opining that defective flashing installation caused water intrusion resulting in $2.3 million in damages. The deposition has been proceeding for approximately two hours, and opposing counsel is now moving to your methodology and sources.',

  choicePoints: [
    {
      title: 'Choice Point 1: The Learned Treatise Ambush',
      prompt:
        'Opposing counsel holds up a well-known textbook on building envelope systems and asks: "Dr. Expert, are you familiar with Harrison\'s Building Envelope Systems and Design?" You answer yes. Counsel follows up: "Would you agree that Harrison\'s textbook is an authoritative source in your field?"',
      choices: [
        {
          id: 'a',
          text: '"Yes, Harrison\'s is widely recognized as an authoritative text in building envelope engineering."',
          correct: false,
          consequence:
            'By agreeing the entire textbook is authoritative, you have opened the door under FRE 803(18). Opposing counsel now reads a passage from Chapter 12 where Harrison describes conditions under which flashing failure can result from maintenance neglect rather than installation defects. This passage is now substantive evidence that the jury will hear, and you must explain why your opinion differs from a source you just called authoritative.',
          takeaway:
            'Never broadly endorse an entire publication as authoritative. A textbook can contain hundreds of propositions -- agreeing with one does not mean agreeing with all of them.',
        },
        {
          id: 'b',
          text: '"I am familiar with Harrison\'s work. I would need to see the specific passage you are referring to before I could comment on whether I consider it reliable on that particular point."',
          correct: true,
          consequence:
            'Opposing counsel is forced to show you the specific passage. You review it carefully and respond: "I have read this passage. While I agree with Harrison\'s general framework, this specific discussion addresses maintenance-related failures, which are factually distinguishable from the installation defects I documented in my report." You have maintained control of the exchange and prevented a blanket endorsement.',
          takeaway:
            'Require opposing counsel to identify the specific passage before commenting on authority. This allows you to evaluate and respond to the precise proposition rather than endorsing an entire publication.',
        },
        {
          id: 'c',
          text: '"I don\'t consider Harrison\'s textbook authoritative. I rely on my own professional experience and judgment."',
          correct: false,
          consequence:
            'While this avoids the treatise trap, it creates a credibility problem. Harrison\'s textbook is widely recognized in the field, and dismissing it entirely makes you appear either uninformed or deliberately evasive. Opposing counsel asks: "So you are not familiar with one of the most widely cited references in your field?" -- putting you in a worse position than if you had engaged thoughtfully.',
          takeaway:
            'Do not dismiss well-known references in your field. Acknowledge familiarity, but require specificity before commenting on whether you agree with particular propositions.',
        },
      ],
      redirectIfWrongCp1: null,
    },
    {
      title: 'Choice Point 2: The Scope Creep Question',
      prompt:
        'Later in the deposition, opposing counsel shifts topics and asks: "Doctor, based on your inspection and analysis of this building, is the building currently safe for occupancy?" Your report addressed defective flashing installation and resulting water damage, but you were not asked to -- and did not -- evaluate overall building safety or habitability.',
      redirectIfWrongCp1: 'Even though the previous answer did not go as well as it could have, you have a fresh opportunity here. Apply what you know about scope discipline.',
      choices: [
        {
          id: 'a',
          text: '"Based on what I observed, I believe the building is generally safe for occupancy, though the water intrusion issues should be addressed."',
          correct: false,
          consequence:
            'You have just offered an opinion on building safety that was not in your report, not part of your engagement, and not supported by the systematic analysis that a safety evaluation would require. Opposing counsel now has an off-the-cuff safety opinion they can use to undermine your credibility: "So you rendered a safety opinion with no engineering analysis to support it?" Your Daubert exposure has increased significantly.',
          takeaway:
            'Never offer opinions outside your engagement scope during a deposition. Off-the-cuff opinions lack the analytical rigor that supports your disclosed opinions and create new vulnerability.',
        },
        {
          id: 'b',
          text: '"That question is outside the scope of my engagement. I was retained to evaluate the flashing installation and resulting water damage. I did not conduct a building safety evaluation, and I have no opinion on overall building safety."',
          correct: true,
          consequence:
            'You have cleanly established the boundary of your engagement. Opposing counsel may press further: "But surely, as a structural engineer, you formed some impression of the building\'s safety?" You respond: "I limited my analysis to the scope defined in my engagement. Forming opinions outside that scope without a systematic evaluation would not meet the standard of care I apply to my professional work." This answer reinforces both your discipline and your credibility.',
          takeaway:
            'Clearly state the boundaries of your engagement. An expert who declines to speculate outside their scope demonstrates exactly the discipline and rigor that courts expect.',
        },
        {
          id: 'c',
          text: '"I\'m not a building safety expert, so I can\'t answer that question."',
          correct: false,
          consequence:
            'This answer is technically responsive but creates a problem: as a structural engineer, you arguably could evaluate building safety if retained to do so. Opposing counsel follows up: "But you are a licensed structural engineer, aren\'t you? And structural engineers evaluate building safety, don\'t they?" You are now defending an inaccurate characterization of your qualifications rather than simply drawing a clean scope boundary.',
          takeaway:
            'The issue is not whether you could evaluate safety -- it is whether you were retained to do so and whether you did so. Focus your answer on the scope of your engagement, not your qualifications.',
        },
      ],
    },
  ],

  summaryPrinciples: [
    'Treatise handling: Never broadly endorse an entire publication as authoritative. Require opposing counsel to identify the specific passage, review it carefully, and respond to the precise proposition rather than the whole text.',
    'Scope discipline: Know the boundaries of your engagement and defend them clearly. Opinions offered outside your disclosed scope lack analytical support and create Daubert vulnerability.',
    'Precise answers: Every word matters in a deposition transcript. Answer what was asked, qualify when necessary, and stop when you have answered. The silence that follows is the attorney\'s problem, not yours.',
  ],
};

// ============================================================
// QUIZ
// ============================================================

export const PASS_SCORE = 6;
export const TOTAL_QUESTIONS = 8;

export const QUIZ_DATA = {
  questions: [
    {
      id: 'q1',
      text: 'What is the primary strategic purpose of an expert deposition for opposing counsel?',
      options: [
        { id: 'a', text: 'To give the expert an opportunity to present their full opinion to the court', correct: false },
        { id: 'b', text: 'To discover the scope of the expert\'s opinions, identify weaknesses, and lock the expert into positions for trial', correct: true },
        { id: 'c', text: 'To negotiate a settlement based on the expert\'s testimony', correct: false },
        { id: 'd', text: 'To allow the expert and opposing counsel to collaborate on joint findings', correct: false },
      ],
      explanation:
        'The primary purpose of deposing an opposing expert is to discover the full scope of their opinions, probe for weaknesses in methodology, lock them into specific positions that can be used for impeachment at trial, and gather ammunition for Daubert challenges.',
    },
    {
      id: 'q2',
      text: 'Which of the following is the BEST preparation practice before an expert deposition?',
      options: [
        { id: 'a', text: 'Memorize your report word for word so you can recite it if asked', correct: false },
        { id: 'b', text: 'Read your report as if you were opposing counsel looking for weaknesses, and discuss likely lines of attack with retaining counsel', correct: true },
        { id: 'c', text: 'Avoid reviewing your report so your answers sound spontaneous rather than rehearsed', correct: false },
        { id: 'd', text: 'Prepare written answers to anticipated questions and bring them to the deposition', correct: false },
      ],
      explanation:
        'The most effective preparation is to re-master your report by reading it from the perspective of opposing counsel, identifying weaknesses, and conducting a preparation session with retaining counsel to practice handling likely lines of attack.',
    },
    {
      id: 'q3',
      text: 'What is the recommended technique for answering deposition questions?',
      options: [
        { id: 'a', text: 'Answer as quickly as possible to project confidence', correct: false },
        { id: 'b', text: 'Provide thorough explanations with each answer to ensure the record is complete', correct: false },
        { id: 'c', text: 'Listen to the full question, pause briefly, then answer only what was asked', correct: true },
        { id: 'd', text: 'Defer to retaining counsel before answering each question', correct: false },
      ],
      explanation:
        'The listen-pause-answer technique ensures you understand the question, gives retaining counsel time to object if needed, and prevents you from volunteering information beyond what was asked.',
    },
    {
      id: 'q4',
      text: 'When is it appropriate to say "I don\'t recall" versus "I don\'t know" in a deposition?',
      options: [
        { id: 'a', text: 'They are interchangeable and mean the same thing', correct: false },
        { id: 'b', text: '"I don\'t recall" means you once knew but cannot currently remember; "I don\'t know" means the information is outside your knowledge', correct: true },
        { id: 'c', text: '"I don\'t recall" should never be used because it implies poor preparation', correct: false },
        { id: 'd', text: '"I don\'t know" should be avoided because it implies incompetence', correct: false },
      ],
      explanation:
        '"I don\'t recall" and "I don\'t know" are distinct responses. "I don\'t recall" means you once had the information but cannot retrieve it now (and may be subject to refresh attempts). "I don\'t know" means the information was never within your knowledge. Both are legitimate, honest answers.',
    },
    {
      id: 'q5',
      text: 'Opposing counsel poses a hypothetical that changes several key facts of the case and asks: "Would that change your opinion?" What is the best approach?',
      options: [
        { id: 'a', text: 'Refuse to answer hypothetical questions as they are speculative and outside the scope of your report', correct: false },
        { id: 'b', text: 'Answer within the hypothetical framework, but if the hypothetical omits critical facts or is unrealistic, note those deficiencies before answering', correct: true },
        { id: 'c', text: 'Always agree that different facts would change your opinion, to appear reasonable and open-minded', correct: false },
        { id: 'd', text: 'Ask retaining counsel to object to all hypothetical questions', correct: false },
      ],
      explanation:
        'Hypothetical questions are a legitimate and common deposition technique. You can engage with the hypothetical, but you should ensure you understand the full hypothetical before answering, and note if it omits critical facts or is unrealistic. Refusing to engage makes you appear evasive, while blindly agreeing to every hypothetical hands opposing counsel ammunition for trial.',
    },
    {
      id: 'q6',
      text: 'After you finish answering a deposition question, opposing counsel remains silent for an extended pause. What is the best response?',
      options: [
        { id: 'a', text: 'Fill the silence by elaborating on your answer to ensure the record is complete', correct: false },
        { id: 'b', text: 'Ask opposing counsel if they have another question', correct: false },
        { id: 'c', text: 'Sit comfortably and wait - the silence is opposing counsel\'s responsibility, not yours', correct: true },
        { id: 'd', text: 'Use the pause to voluntarily clarify any potential ambiguity in your prior answers', correct: false },
      ],
      explanation:
        'Silence after your answer is one of the most effective techniques in a deposing attorney\'s toolkit. The instinct is to fill the silence by continuing to talk - adding qualifications, explanations, or context you were not asked for. When you have answered the question, stop. The next move is the attorney\'s, not yours. Every additional word you volunteer beyond what the question requires is a gift to opposing counsel.',
    },
    {
      id: 'q7',
      text: 'What does FRCP 30(e) allow an expert to do after a deposition?',
      options: [
        { id: 'a', text: 'Withdraw testimony they regret giving', correct: false },
        { id: 'b', text: 'Review the transcript and submit an errata sheet noting changes in form or substance within 30 days', correct: true },
        { id: 'c', text: 'File a motion to seal the deposition transcript from public access', correct: false },
        { id: 'd', text: 'Refuse to sign the transcript if they disagree with how questions were asked', correct: false },
      ],
      explanation:
        'FRCP 30(e) allows the deponent to review the transcript and submit changes in "form or substance" within 30 days. Typographical corrections are routine, but substantive changes will be heavily scrutinized by opposing counsel.',
    },
    {
      id: 'q8',
      text: 'Why is maintaining composure during a deposition critical for an expert witness?',
      options: [
        { id: 'a', text: 'Because showing emotion is a violation of deposition rules', correct: false },
        { id: 'b', text: 'Because the court reporter cannot accurately record testimony from an agitated witness', correct: false },
        { id: 'c', text: 'Because credibility is built through composure, candor, and consistency, and emotional reactions signal defensiveness to the jury', correct: true },
        { id: 'd', text: 'Because retaining counsel will terminate the deposition if the expert becomes visibly upset', correct: false },
      ],
      explanation:
        'An expert\'s credibility is their most valuable asset. Emotional reactions -- anger, frustration, sarcasm -- signal defensiveness and undermine the perception of objectivity. A calm, measured response to every provocation reinforces credibility, especially when the deposition is videotaped.',
    },
  ],
};
