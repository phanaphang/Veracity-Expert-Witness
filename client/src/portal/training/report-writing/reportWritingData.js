// ============================================================
// reportWritingData.js
// All content for the "Writing an Expert Witness Testimony
// Report" training module.
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
//   }>
//   keyTakeaway     string
// ============================================================

export const MODULE_TITLE = 'Writing an Expert Witness Testimony Report'
export const MODULE_SUBTITLE =
  '~60 minutes \u00b7 8 Lessons \u00b7 1 Scenario \u00b7 1 Knowledge Check'

export const LESSON_SEQUENCE = ['1', '2', '3', '4', '5', '6', '7', '8']
export const TOTAL_LESSONS = 8

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
    title: 'Purpose and Audience: Who Reads Your Report and Why It Matters',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'Your expert report is your primary deliverable. It speaks when you are not in the room, and it will be read by people whose interests are diametrically opposed. The report you write today will be the document that retaining counsel relies on, opposing counsel attacks, and the court evaluates months or years from now.',
          'Understanding who reads your report, and why, is the first step toward writing one that serves its purpose.',
        ],
      },
      {
        subheading: 'The Five Audiences',
        body: [
          'Every expert report has at least five distinct audiences, each reading with a different intent:',
        ],
        bullets: [
          'Retaining attorney: reads for strength, looking for opinions that support the case theory and hold up under scrutiny. They need to know what you will say at deposition and trial.',
          'Opposing counsel: reads for weakness, looking for vague opinions, unsupported conclusions, overstatements, and inconsistencies they can exploit at deposition and trial.',
          'Opposing expert: reads for methodological flaws, looking for gaps in your analysis, errors in your data, and opportunities to write a rebuttal that undermines your conclusions.',
          'The judge: reads for admissibility, asking whether your opinions are based on sufficient facts, reliable methodology, and sound reasoning. In federal court, this evaluation follows the Daubert framework. In California state court, Kelly applies to novel techniques and Sargon applies to speculative or analytically unsupported opinions.',
          'The jury: may never read the report directly, but will hear your testimony based on it. The report structures what you say on the stand and what opposing counsel asks you about.',
        ],
      },
      {
        subheading: 'Disclosure Requirements Shape What You Write',
        body: [
          'In federal court, FRCP 26(a)(2)(B) requires a written report signed by the expert containing: a complete statement of all opinions and their bases, the facts or data considered, any exhibits, qualifications including publications from the preceding 10 years, a list of cases in which the expert testified at trial or by deposition in the preceding 4 years, and a statement of compensation.',
          'In California, CCP 2034.260 requires only a brief narrative summary of qualifications and the general substance of expected testimony, signed by the attorney (not the expert). This is far less than a full federal-style report. However, the CCP 2034 framework allows opposing parties to demand production of all discoverable expert reports and writings, and experienced litigators commonly include this demand. The practical result is that California experts often prepare comprehensive written reports even though the statute does not strictly require them.',
        ],
      },
      {
        subheading: 'The Report as a Blueprint',
        body: [
          'Your report locks in your testimony. At deposition, opposing counsel will walk through it line by line, asking you to confirm, clarify, or defend every statement. At trial, your direct examination will track your report, and cross-examination will probe every gap between what the report says and what you say on the stand.',
          'An inconsistency between your report and your testimony is one of the most effective tools opposing counsel has. The report you write is the blueprint for everything that follows.',
        ],
      },
    ],
    keyTakeaway:
      'Your report is both a persuasive document and a litigation weapon. Write it knowing it will be scrutinized by adversaries who are looking for every opportunity to undermine your credibility.',
  },

  2: {
    title:
      'Anatomy of a Strong Expert Report: Essential Sections and Structure',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'A well-structured report signals competence to the court and gives opposing counsel fewer angles of attack. While the exact format varies by jurisdiction and practice area, the following sections form the backbone of a defensible expert report.',
        ],
      },
      {
        subheading: 'Essential Sections',
        body: [
          'The sections below are listed in the order they typically appear:',
        ],
        numberedList: [
          'Caption / Title Page: case name, your name, date, and the retaining party. This identifies the report in the litigation record.',
          'Qualifications Summary: a brief overview of the credentials, training, and experience that qualify you to opine on the specific issues in this case. This is not your full CV (which is attached separately) but a focused narrative tying your background to the subject matter.',
          'Assignment / Scope of Engagement: what you were asked to do. This section defines the boundaries of your analysis and protects you from being asked about issues outside your scope at deposition.',
          'Materials Reviewed: a complete list of every document, dataset, deposition transcript, photograph, and other material you considered. This section is a litigation minefield (covered in depth in Lesson 4).',
          'Background / Facts: a neutral recitation of the relevant facts as you understand them. This section shows the court that your opinions rest on a factual foundation, not assumptions you invented.',
          'Analysis / Methodology: how you reached your conclusions. This is the section that Daubert challenges target. Document every step of your analytical process.',
          'Opinions and Conclusions: your opinions, numbered for easy reference at deposition and trial. Each opinion should be specific, clear, and tied to the issue it addresses.',
          'Basis for Opinions: the "why" behind each opinion. For every conclusion, identify the facts, data, methodology, and reasoning that support it.',
          'Compensation Statement: the compensation to be paid for your study and testimony in the case. FRCP 26(a)(2)(B)(vi) requires this disclosure in federal court.',
          'Signature Block: signed by the expert. FRCP 26(a)(2)(B) requires the expert to sign the report. Some jurisdictions or local rules may impose additional requirements.',
        ],
      },
      {
        subheading: 'Industry-Specific Variations',
        body: [
          'While the core sections remain consistent, the depth and emphasis shift by practice area:',
        ],
        bullets: [
          'Construction defect: the analysis section typically includes site inspection findings, testing results, code and standard references, and a detailed deficiency-by-deficiency breakdown.',
          'Medical: causation opinions require a differential diagnosis section showing how alternative causes were systematically ruled out.',
          'Financial: damages reports include detailed assumptions, valuation methodology (DCF, comparable transactions, market approach), and sensitivity analyses.',
          'Technology and digital forensics: reports must document chain of custody, forensic tools used, and step-by-step analytical procedures in a manner that could be independently reproduced.',
        ],
      },
    ],
    keyTakeaway:
      'A well-structured report signals competence to the court and gives opposing counsel fewer angles of attack. Structure is not a formality; it is a defense.',
  },

  3: {
    title: 'Writing Your Opinions: Clarity, Specificity, and Defensibility',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'Your opinions are the core of the report. Everything else, including the qualifications, the materials reviewed, the methodology, and the factual background, exists to support them. Weak opinions undermine the entire document, regardless of how thorough the rest of the report may be.',
        ],
      },
      {
        subheading: 'The "Reasonable Degree of Certainty" Convention',
        body: [
          'Expert opinions are commonly stated to a "reasonable degree of [professional] certainty" or "reasonable degree of [professional] probability." This is a widely expected convention in most courts, though not a formal requirement of the Federal Rules of Evidence. However, certain state courts, notably Pennsylvania, formally require this specific language. Experts should confirm the applicable jurisdiction\'s expectations with retaining counsel before finalizing their report.',
          'The phrase signals that your opinion is more than speculation but less than absolute certainty. It tells the court that you have applied your professional training and judgment and reached a conclusion you are confident in.',
        ],
      },
      {
        subheading: 'Facts, Assumptions, and Opinions',
        body: [
          'A defensible report clearly distinguishes between three categories:',
        ],
        bullets: [
          'Facts: information you received from the case record, from counsel, or from your own investigation. Facts are things you observed or were told.',
          'Assumptions: premises you adopted for purposes of your analysis. Every assumption should be identified and justified. If counsel provided the assumption, say so.',
          'Opinions: your professional conclusions based on the facts and assumptions, reached through your methodology. Opinions are what you are being retained to provide.',
        ],
        afterList:
          'Blurring these categories is one of the most common report-writing errors. If opposing counsel can show that what you presented as a "fact" is actually an assumption, or that your "opinion" rests on an undisclosed assumption, your credibility suffers.',
      },
      {
        subheading: 'Numbering and Specificity',
        body: [
          'Number your opinions. At deposition, opposing counsel will refer to them by number ("Turning to Opinion 3 in your report..."), and numbered opinions make the report easier to navigate for the court and the jury.',
          'Each opinion should be specific enough to be useful but not so narrow that it becomes brittle. A good opinion answers two questions in one clear sentence: what do you believe, and how confident are you?',
        ],
      },
      {
        subheading: 'Avoiding Hedge Words vs. Appropriate Qualification',
        body: [
          'Hedge words like "might," "could," "possibly," and "perhaps" weaken your opinions and invite challenge. Opposing counsel will highlight every hedge and argue that you lack confidence in your own conclusions.',
          'However, appropriate qualification is different from hedging. If a conclusion genuinely depends on a condition or a range, say so explicitly rather than hedging. "The repair cost is between $1.2 million and $1.5 million depending on the scope of concealed damage" is a qualified opinion. "The repair cost could possibly be around $1.2 million" is a hedge.',
        ],
      },
      {
        subheading: 'Weak vs. Strong Opinions: Side-by-Side',
        body: ['Consider the difference:'],
        bullets: [
          'Weak: "It is possible that the water intrusion was caused by defective flashing installation."',
          'Strong: "It is my opinion, to a reasonable degree of engineering certainty, that the water intrusion at the subject property was caused by defective installation of the roof-to-wall flashing, based on my site inspection, destructive testing, and review of the applicable building code requirements."',
        ],
        afterList:
          'The strong opinion identifies what the expert believes, the basis for the belief, and the level of confidence. The weak opinion communicates uncertainty without providing any analytical foundation.',
      },
    ],
    keyTakeaway:
      'Every opinion should answer "what do you believe, and how confident are you?" in one clear sentence. If you cannot state your opinion clearly, you are not ready to write it.',
  },

  4: {
    title:
      'The Materials Reviewed Section: What to List, What to Omit, and How to Survive the Deposition Questions',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'The "Materials Reviewed" section is one of the most scrutinized parts of any expert report. Opposing counsel will compare your list against the universe of available materials to identify what you did not review, and will ask at deposition why you did not consider specific documents. Getting this section right is critical to your credibility.',
        ],
      },
      {
        subheading: 'The Completeness Requirement',
        body: [
          'Every document you considered must appear on your Materials Reviewed list, even if you did not ultimately rely on it. Under FRCP 26(a)(2)(B), the report must contain "the facts or data considered by the witness in forming" their opinions. The word "considered" is broader than "relied upon." If you reviewed a document and it informed your thinking in any way, it belongs on the list.',
          'Omitting a document you reviewed creates a credibility issue if opposing counsel discovers the gap. Conversely, listing a document you did not actually read creates a different credibility issue when you cannot answer questions about its contents at deposition.',
        ],
      },
      {
        subheading: 'The Deposition Trap',
        body: [
          'Opposing counsel will compare your Materials Reviewed list against the full discovery record. They will identify every document you did not review and ask why. "Were you aware of the October 15 inspection report?" "Did you ask retaining counsel for the contractor\'s daily logs?" "Would the deposition transcript of the project manager have been relevant to your analysis?"',
          'Prepare a response for significant omissions. If a document was unavailable, say so in the report. If you chose not to review it because it fell outside the scope of your assignment, document that scope clearly in the Assignment section.',
        ],
      },
      {
        subheading: 'Organizing the List',
        body: [
          'Group materials by category rather than listing them in the order you received them. Consistent organization makes the list navigable for the court, the jury, and opposing counsel, and reduces the risk of inadvertent omissions.',
        ],
        bullets: [
          'Pleadings and court filings',
          'Deposition transcripts',
          'Correspondence and emails',
          'Contracts, plans, and specifications',
          'Photographs and video recordings',
          'Medical, financial, or technical records',
          'Standards, codes, and published literature',
          'Prior expert reports',
        ],
        afterList:
          'Date each document where possible. If you reviewed multiple versions of a document, list each version separately.',
      },
      {
        subheading: 'Email and Communication Pitfalls',
        body: [
          "Communications between you and retaining counsel deserve particular care. FRCP 26(b)(4)(C) protects most attorney-expert communications from discovery, but carves out three exceptions: communications relating to compensation for the expert's study or testimony, facts or data provided by counsel that you considered in forming your opinions, and assumptions provided by counsel that you relied on.",
          'If counsel sent you an email containing factual data that you considered, the content of that communication (though not necessarily the communication itself) may be discoverable. Draft communications with counsel carefully, and confirm with counsel which facts and assumptions should be documented in the report itself.',
        ],
      },
      {
        subheading: '"Considered" vs. "Relied Upon"',
        body: [
          'Some jurisdictions and practitioners distinguish between materials the expert "considered" (reviewed but may not have used) and materials the expert "relied upon" (affirmatively used as a basis for opinions). FRCP 26(a)(2)(B) uses "considered," which is the broader term.',
          'The safest approach is to list everything you reviewed under "Materials Considered" or "Materials Reviewed," and if necessary, identify in the body of your report which specific materials you relied on for each opinion. Confirm with retaining counsel how the list should be framed in the applicable jurisdiction.',
        ],
      },
      {
        subheading: 'Industry-Specific Materials Lists',
        body: [
          'The types of materials you review vary significantly by discipline. Common categories include:',
        ],
        bullets: [
          'Construction: plans, specifications, change orders, daily logs, inspection reports, building code editions, manufacturer installation instructions, weather data, geotechnical reports',
          'Medical: medical records, imaging studies, laboratory results, published medical literature, clinical guidelines, pharmacy records, life care plans',
          'Financial: financial statements, tax returns, contracts, market data, industry benchmarks, comparable transaction databases, economic data sources',
          'Technology: forensic images, system log files, network captures, chain of custody documentation, tool validation reports, relevant RFCs or protocol specifications',
        ],
      },
    ],
    keyTakeaway:
      'The Materials Reviewed section is a minefield. Every document on the list is fair game at deposition, and every document missing from the list is a potential credibility attack.',
  },

  5: {
    title: 'Supporting Your Conclusions: Methodology, Data, and Citations',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          "A well-documented report demonstrating sound methodology strengthens the expert's position to survive a Daubert challenge to their testimony; a report that merely states conclusions without showing methodology is vulnerable to exclusion. The analysis section of your report is where you show your work.",
        ],
      },
      {
        subheading: 'Document Your Methodology',
        body: [
          'Your methodology is the process by which you moved from data to conclusion. Under Daubert and its progeny, the court evaluates whether your methodology is reliable, not whether your conclusion is correct. Under Kelly in California, novel techniques must be generally accepted in the relevant professional community.',
          'For every opinion in your report, the reader should be able to trace the path from the data you reviewed, through the analytical steps you performed, to the conclusion you reached. If you cannot articulate that path clearly in writing, your opinion will not survive rigorous cross-examination.',
        ],
      },
      {
        subheading: 'Showing Your Work',
        body: [
          'Depending on your discipline, "showing your work" may include:',
        ],
        bullets: [
          'Calculations, measurements, or test results with documented procedures',
          'Statistical analyses with sample sizes, confidence intervals, and methodology descriptions',
          'Literature review with citations to peer-reviewed publications and industry standards',
          'Code and standard references (building codes, NIST guidelines, ASTM standards, professional practice standards)',
          'Photographs, diagrams, or models that support your analysis',
          'Software tools used, with version numbers and validation documentation',
        ],
      },
      {
        subheading: 'Citing Authoritative Sources',
        body: [
          'Citations serve two purposes: they demonstrate that your methodology is grounded in accepted practice, and they give the court a basis for evaluating the reliability of your approach.',
          'Cite peer-reviewed publications, industry standards, codes, and authoritative treatises. Avoid citing non-peer-reviewed sources (blog posts, manufacturer marketing materials, Wikipedia) as primary authority. If you rely on a source, be prepared to defend it at deposition.',
        ],
      },
      {
        subheading: 'Handling Data Gaps',
        body: [
          'Incomplete data is common in litigation. Documents are lost, witnesses are unavailable, and physical evidence may have been altered or destroyed. Your report should address data gaps transparently rather than ignoring them.',
          'Identify what information was unavailable, explain what impact (if any) the gap has on your analysis, and describe any assumptions you made to bridge the gap. A transparent discussion of limitations actually strengthens credibility; pretending that gaps do not exist invites devastating cross-examination.',
        ],
      },
      {
        subheading: 'Counsel-Provided Facts vs. Independent Analysis',
        body: [
          'Your report should clearly distinguish between facts provided by retaining counsel and conclusions you reached through your own independent analysis. This distinction matters because FRCP 26(b)(4)(C) protects most attorney-expert communications but carves out exceptions for facts or data provided by counsel that the expert considered, and assumptions provided by counsel that the expert relied on.',
          'If counsel asked you to assume a particular fact, say so in the report. If you independently verified it, say that instead. The line between "counsel told me X" and "I confirmed X through my own analysis" is a line opposing counsel will probe at deposition.',
        ],
      },
    ],
    keyTakeaway:
      'A report that documents its methodology gives the retaining attorney the tools to defend your testimony at the gatekeeping stage; one that simply announces conclusions does not.',
  },

  6: {
    title:
      'Writing for Deposition Defense: Every Sentence Will Be Read Back to You Under Oath',
    estimatedMinutes: 8,
    sections: [
      {
        subheading: null,
        body: [
          'Your report is the single most important document in your deposition. Opposing counsel will have it memorized. They will read your sentences back to you, one at a time, and ask you to confirm, explain, or defend each one. Every word choice you made while writing becomes a word choice you must defend under oath.',
        ],
      },
      {
        subheading: 'The Deposition Reality',
        body: [
          'At deposition, opposing counsel controls the agenda. They will walk through your report section by section, probing every statement for weakness. "On page 12, you wrote X. What did you mean by that?" "You used the word \'significant.\' Can you quantify what you mean by significant?" "You state that you reviewed 47 documents. I count 46 on your Materials Reviewed list. Which document is missing?"',
          'The deposition is not a conversation. It is a cross-examination of your written work. The report you wrote is the script opposing counsel will use to challenge your credibility.',
        ],
      },
      {
        subheading: 'Writing with Deposition in Mind',
        body: [
          'Before you write a sentence in your report, ask yourself: "Can I defend this statement under cross-examination?" If the answer is uncertain, rewrite it. This is the single most useful self-editing question an expert can ask.',
          'Every claim of fact should be traceable to a specific source. Every opinion should be tied to a specific methodology. Every characterization should be supportable with evidence. If you cannot point to the foundation for a statement, do not include it.',
        ],
      },
      {
        subheading: 'Precision of Language',
        body: [
          'Word choice matters more in an expert report than in almost any other professional document. Small differences in language carry significant weight at deposition:',
        ],
        bullets: [
          '"I reviewed" vs. "I was provided with": the first implies independent action; the second implies passivity and raises questions about what else you might have reviewed independently.',
          '"In my opinion" vs. "It appears": the first is a committed professional conclusion; the second is an observation that falls short of an opinion and invites the question "Does it appear, or is it your opinion?"',
          '"Caused" vs. "contributed to": the first asserts sole or direct causation; the second acknowledges multiple contributing factors. Choose deliberately based on your analysis.',
          '"Consistent with" vs. "caused by": the first notes a correlation or compatibility; the second asserts a causal relationship. Courts treat these very differently.',
        ],
        afterList:
          'Each of these distinctions will be explored at deposition. Opposing counsel will ask you to explain exactly what you meant and whether a different word would be more accurate.',
      },
      {
        subheading: 'Avoiding the "Did You Consider...?" Trap',
        body: [
          'One of opposing counsel\'s most effective deposition techniques is asking about analyses you did not perform, documents you did not review, or experts you did not consult. "Did you consider performing a finite element analysis?" "Did you review the manufacturer\'s technical bulletin?" "Did you consult with a metallurgist?"',
          'Your report should preemptively address the scope of your analysis and the boundaries of your opinions. The Assignment/Scope section should clearly define what you were asked to do. If you chose not to perform a particular analysis, and you can anticipate the question, consider explaining in your report why that analysis was unnecessary or outside your scope.',
        ],
      },
      {
        subheading: 'Supplemental and Amended Reports',
        body: [
          'If your opinions change after you submit your initial report, you have a duty to supplement. FRCP 26(e) requires parties to supplement expert disclosures when the expert learns that the information disclosed is incomplete or incorrect. Issue a supplemental report before your deposition rather than revealing changed opinions for the first time at the deposition table.',
          'A supplemental report is far less damaging than a surprise at deposition. Opposing counsel will still probe the change ("Why did your opinion change?"), but a timely, transparent supplement demonstrates intellectual honesty. A surprise at deposition suggests the expert is unreliable.',
        ],
      },
      {
        subheading: 'The Errata Sheet Problem',
        body: [
          'Under FRCP 30(e), a deponent may review the deposition transcript and submit changes within 30 days. These changes are recorded on an errata sheet. Substantive changes on an errata sheet, such as changing "no" to "yes" or altering a key factual statement, draw intense scrutiny from opposing counsel and the court.',
          'The best errata sheet is one you never need to file. Get it right in the report, prepare thoroughly before the deposition, and your testimony will be consistent. If you must file errata, limit changes to genuine transcription errors rather than substantive corrections that suggest you are changing your testimony after the fact.',
        ],
      },
    ],
    keyTakeaway:
      'Write your report as if opposing counsel is sitting across from you, because at deposition, they will be, and they will have your report memorized.',
  },

  7: {
    title: 'Formatting, Exhibits, and Professional Presentation',
    estimatedMinutes: 6,
    sections: [
      {
        subheading: null,
        body: [
          'A polished report communicates professionalism before the reader processes a single opinion. Typographical errors, inconsistent formatting, mislabeled exhibits, and poor organization undermine credibility even when the substance is sound. If the report looks careless, the reader will assume the analysis was careless too.',
        ],
      },
      {
        subheading: 'Formatting Fundamentals',
        body: [
          'Use consistent fonts, headers, spacing, and margins throughout the report. Number all pages. Include a table of contents for reports longer than 15 pages. Use a professional template that you apply consistently across engagements.',
          'Formatting consistency signals attention to detail. Inconsistency, such as switching between font sizes, inconsistent heading styles, or erratic spacing, signals that the report was assembled hastily or carelessly.',
        ],
      },
      {
        subheading: 'Numbering Systems',
        body: [
          'Number your opinions, exhibits, and appendices using a consistent scheme. At deposition and trial, the court and counsel will refer to items by number. "Turning to Opinion 4 in your report..." "Please look at Exhibit C..." "Appendix 2 of your report states..."',
          'A clear numbering system makes your report navigable. An inconsistent or absent numbering system forces opposing counsel to describe items by page number and paragraph, which slows proceedings and frustrates the court.',
        ],
      },
      {
        subheading: 'Exhibit Preparation',
        body: [
          'Every photograph, chart, diagram, and table referenced in the report should be a numbered exhibit. Include descriptive captions that explain what the exhibit depicts and why it is relevant to your analysis.',
          'Exhibits should be able to stand alone. A reader should understand what an exhibit depicts without needing to cross-reference the report text. This matters because exhibits are often projected at trial and discussed independently of the surrounding text.',
        ],
      },
      {
        subheading: 'Tables and Figures',
        body: [
          'Use tables for comparisons, timelines, cost breakdowns, and data summaries. A well-designed table communicates more effectively than three paragraphs of prose. Label all axes, cite data sources, include units of measurement, and title every table.',
          'Use figures (photographs, diagrams, annotated images) to illustrate physical conditions, spatial relationships, or analytical results. Annotate photographs to identify specific features relevant to your opinions.',
        ],
      },
      {
        subheading: 'Appendices vs. Body Text',
        body: [
          'Detailed calculations, your full CV, and voluminous supporting documentation belong in appendices. The body of the report should summarize and reference appendices, not reproduce them.',
          'However, the body must contain enough methodological detail that the reader can follow your analytical path without flipping to the appendix. The appendix provides the full supporting detail; the body tells the story.',
        ],
      },
      {
        subheading: 'The Final Proofread Checklist',
        body: ['Before submitting your final report, verify the following:'],
        bullets: [
          'Case name, party names, and dates are consistent and correct throughout the report',
          'All opinions are numbered and each is cross-referenced to its supporting basis',
          'All exhibits are referenced in the body and every body reference has a corresponding exhibit',
          'The Materials Reviewed list is complete and matches internal references to documents',
          'No tracked changes, comments, or document metadata remain in the file',
          'Page numbers are correct and the table of contents (if any) is accurate',
          'The report is signed and dated on the signature page',
        ],
      },
      {
        subheading: 'Industry-Specific Exhibit Conventions',
        body: ['Exhibit expectations vary by discipline:'],
        bullets: [
          'Construction: annotated site photographs, code comparison tables showing requirements vs. as-built conditions, scope-of-repair cost breakdowns with line items',
          'Medical: imaging with annotations identifying relevant findings, timeline-of-treatment tables, differential diagnosis summary tables',
          'Financial: damages summary tables with category breakdowns, DCF model inputs and outputs, sensitivity analysis charts showing range of outcomes',
          'Technology: forensic tool output screenshots with annotations, event timeline visualizations, chain of custody log tables',
        ],
      },
    ],
    keyTakeaway:
      'Typographical errors, mislabeled exhibits, and sloppy formatting tell the reader the analysis was careless too. Presentation is credibility.',
  },

  8: {
    title: 'Common Pitfalls: What Gets Reports Challenged or Excluded',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          "Most successful challenges to expert reports exploit preventable errors. The pitfalls below represent the most common reasons expert reports are challenged, excluded, or used to undermine the expert's credibility at deposition and trial.",
        ],
      },
      {
        subheading: 'Advocacy Language',
        body: [
          'The most common pitfall is writing like a lawyer instead of an expert. Your role is to educate the court, not to advocate for the retaining party. Language that reads as partisan ("the defendant clearly failed," "there can be no doubt") signals bias and invites opposing counsel to characterize you as a hired gun.',
          'Write in a neutral, professional tone. Let your analysis speak for itself. A well-supported opinion does not need rhetorical embellishment.',
        ],
      },
      {
        subheading: 'Overstating Qualifications or Scope',
        body: [
          'Do not claim expertise you do not have. If your report strays into areas outside your qualifications, opposing counsel will file a motion to exclude those opinions, and the court may question the reliability of your remaining opinions as well.',
          'Stay within the boundaries of your education, training, and experience. If a question falls outside your expertise, say so in the report rather than stretching to cover it.',
        ],
      },
      {
        subheading: 'Failing to Disclose All Materials',
        body: [
          'Every document you reviewed must appear in your "Materials Reviewed" list. Omissions are discoverable and damaging. If opposing counsel identifies a document you reviewed but did not disclose, the credibility cost is severe.',
          'This includes emails exchanged with counsel to the extent they contain facts or data you considered, and materials you reviewed but ultimately did not rely on.',
        ],
      },
      {
        subheading: 'Copy-Pasting from Prior Reports',
        body: [
          'Reusing language from prior reports is efficient but dangerous. Case-specific details from a prior engagement that appear in your current report will be found by opposing counsel, and the resulting deposition questioning will be painful.',
          'Every report should be drafted from scratch for the specific case. Use templates for structure, but write the substance fresh each time.',
        ],
      },
      {
        subheading: 'Inconsistencies with Deposition Testimony',
        body: [
          'Your report and your deposition testimony must be consistent. Opposing counsel will compare the two word by word. If you say something at deposition that contradicts your report, you will be impeached at trial.',
          'Before your deposition, review your report thoroughly. If your opinions have changed since writing the report, issue a supplemental report before the deposition rather than surprising everyone at the table.',
        ],
      },
      {
        subheading: 'Ignoring Unfavorable Evidence',
        body: [
          'A report that acknowledges and addresses unfavorable evidence is stronger than one that ignores it. Opposing counsel will identify every piece of evidence you failed to address and ask why you ignored it. The implication is that you either did not consider it (careless) or chose to hide it (biased).',
          'Address contrary evidence in your report. Explain why it does not change your conclusion, or explain how it limits your conclusion. Transparency builds credibility.',
        ],
      },
      {
        subheading: 'Draft Report Protections and Risks',
        body: [
          'In federal court, FRCP 26(b)(4)(B) protects drafts of expert reports from discovery. This protection was added by the December 1, 2010 amendments to address a prior regime in which drafts were routinely discoverable, chilling candid attorney-expert collaboration. Current protections cover drafts regardless of the form in which they are recorded.',
          'However, state court rules vary significantly. Not all states follow the federal approach to draft protection. Experts should always confirm with retaining counsel whether drafts are protected in the applicable jurisdiction before circulating preliminary versions of their report.',
          'Related: FRCP 26(b)(4)(C) protects most attorney-expert communications, with exceptions for compensation discussions, facts or data provided by counsel that the expert considered, and assumptions provided by counsel that the expert relied on.',
        ],
      },
    ],
    keyTakeaway:
      'Most successful challenges to expert reports exploit preventable errors. Attention to detail is your best defense.',
  },
}

// ============================================================
// BRANCHING SCENARIO
// Two sequential choice points.
//
// choicePoints[].redirectIfWrongCp1 - shown before CP2 when
// the learner chose an incorrect answer at CP1.
// ============================================================

export const SCENARIO_DATA = {
  id: 'draft-review',
  title: 'The Draft Review',
  setup:
    'You are reviewing a draft expert report before it is finalized and disclosed to opposing counsel. The report was written by a colleague on your team, and the retaining attorney has asked you to review it for any issues. As you read through the draft, you identify several problems that could expose the expert to challenge at deposition or trial.',
  choicePoints: [
    {
      id: 'cp1',
      title: 'Choice Point 1: "The advocacy problem"',
      prompt:
        'You notice the following sentence in the draft report: "The defendant\'s egregious failure to follow basic industry standards clearly caused the catastrophic damage to the plaintiff\'s property." How should you advise your colleague to handle this language?',
      choices: [
        {
          id: 'a',
          text: '"Keep it. Strong language shows confidence in the opinion and will impress the jury."',
          correct: false,
          consequence:
            'This is advocacy language, not expert analysis. Words like "egregious," "clearly," and "catastrophic" are rhetorical, not analytical. At deposition, opposing counsel will ask: "Doctor, when you wrote \'egregious,\' were you offering a professional engineering opinion or an emotional characterization?" The expert will have no good answer.',
          takeaway:
            'Expert reports must be written in a neutral, professional tone. Let the analysis speak for itself. Rhetorical language signals bias and hands opposing counsel a credibility weapon.',
        },
        {
          id: 'b',
          text: '"Rewrite it in neutral, professional language. Replace the characterizations with specific factual findings and tie the causation opinion to the methodology."',
          correct: true,
          consequence:
            'Correct. A rewritten version might read: "It is my opinion, to a reasonable degree of engineering certainty, that the contractor\'s failure to install flashing in accordance with the manufacturer\'s specifications and the applicable building code caused water intrusion at the subject property, based on my site inspection, destructive testing, and code analysis." This version states the same opinion without advocacy language.',
          takeaway:
            'Neutral language does not weaken your opinion. It strengthens it by forcing you to support every claim with specific analysis rather than rhetoric.',
        },
        {
          id: 'c',
          text: '"Soften it slightly but keep the general tone. The attorney wants strong language."',
          correct: false,
          consequence:
            "The retaining attorney may prefer strong language, but your duty is to the court, not to the attorney's preferred tone. A report that reads like a brief will be attacked as advocacy, and the expert's credibility will suffer. The attorney can use strong language in their brief; the expert should not.",
          takeaway:
            'Your report is not a brief. The attorney advocates; you educate. Meeting the attorney halfway on advocacy language still leaves you exposed at deposition.',
        },
      ],
    },
    {
      id: 'cp2',
      title: 'Choice Point 2: "The missing methodology"',
      prompt:
        'Later in the draft, you find the following opinion: "The total cost of repair is $2.4 million." The opinion is stated without any supporting methodology, no breakdown of how the figure was calculated, no reference to cost data sources, and no explanation of assumptions. How should you advise your colleague?',
      redirectIfWrongCp1:
        "Let's assume you correctly identified the advocacy language issue. Now, another problem: the missing methodology.",
      choices: [
        {
          id: 'a',
          text: '"It\'s fine. The detailed calculations are in the appendix, so the opinion section can just state the number."',
          correct: false,
          consequence:
            'Insufficient. A Daubert challenge targets methodology, and the opinion section of the report is where the court looks first. If the opinion reads as a bare conclusion with no analytical path, opposing counsel will argue that the expert is offering an ipse dixit ("because I said so") opinion. Appendix calculations help, but the opinion itself must connect the conclusion to the methodology.',
          takeaway:
            'Every opinion must show its work, at least in summary form, in the body of the report. Appendices support the opinion; they do not replace the need to articulate methodology in the opinion itself.',
        },
        {
          id: 'b',
          text: '"Add a summary of the methodology directly in the opinion section: identify the cost data sources, explain the calculation approach, state the key assumptions, and provide a brief breakdown of the $2.4 million figure."',
          correct: true,
          consequence:
            'Correct. A well-supported damages opinion should identify the methodology (e.g., line-item cost estimation based on contractor bids and published cost data), the key assumptions (e.g., scope of repair, unit costs, contingency factor), and a summary breakdown (e.g., "$1.1M structural, $800K waterproofing, $500K general conditions"). The detailed calculations can remain in the appendix, but the opinion section must show the analytical path.',
          takeaway:
            'Opinions that state conclusions without methodology are the primary target of Daubert challenges. Every opinion should let the reader trace the path from data to conclusion without flipping to the appendix.',
        },
        {
          id: 'c',
          text: '"Just add a sentence saying the opinion is based on your professional experience."',
          correct: false,
          consequence:
            'After Kumho Tire, experience-based opinions are subject to the same scrutiny as scientific opinions in federal court. Stating that an opinion is "based on experience" without documenting what that experience-based methodology actually involved is insufficient. Opposing counsel will ask: "What specific methodology did you apply? How did you arrive at $2.4 million rather than $1.8 million or $3.0 million?"',
          takeaway:
            'Experience is a qualification, not a methodology. The court wants to know not just that you are experienced but that you applied a reliable analytical process to reach your specific conclusion.',
        },
      ],
    },
  ],
  summaryPrinciples: [
    'Write in a neutral, professional tone. Advocacy language undermines credibility and hands opposing counsel a weapon.',
    'Every opinion must show its analytical path. A conclusion without methodology is vulnerable to exclusion.',
    'Review every draft as if opposing counsel will read it, because they will.',
  ],
}

// ============================================================
// KNOWLEDGE CHECK
// 8 questions, pass score = 6/8, one retry allowed.
// Industry rotation: Q1 neutral, Q2 engineering, Q3 medical,
// Q4 financial, Q5 neutral, Q6 neutral, Q7 technology,
// Q8 neutral.
// ============================================================

export const PASS_SCORE = 6
export const TOTAL_QUESTIONS = 8

export const QUIZ_DATA = {
  questions: [
    {
      id: 'q1',
      text: "Under FRCP 26(a)(2)(B), which of the following is NOT required in a testifying expert's written report?",
      options: [
        {
          id: 'a',
          text: 'A complete statement of all opinions and their bases',
          correct: false,
        },
        {
          id: 'b',
          text: 'The facts or data considered by the expert',
          correct: false,
        },
        {
          id: 'c',
          text: 'A list of cases in which the expert testified in the preceding 4 years',
          correct: false,
        },
        {
          id: 'd',
          text: 'A list of all documents produced by the retaining attorney in the litigation',
          correct: true,
        },
      ],
      explanation:
        'FRCP 26(a)(2)(B) requires: (i) a complete statement of all opinions and their bases, (ii) the facts or data considered, (iii) any exhibits, (iv) qualifications including publications from the preceding 10 years, (v) a list of cases testified in during the preceding 4 years, and (vi) a statement of compensation. It does not require a list of all documents produced by the retaining attorney.',
    },
    {
      id: 'q2',
      text: 'An expert report contains the following opinion: "It is possible that the water intrusion was caused by defective flashing installation." What is the primary weakness of this statement?',
      options: [
        {
          id: 'a',
          text: 'It fails to identify the applicable building code',
          correct: false,
        },
        {
          id: 'b',
          text: 'It uses hedge language ("it is possible") rather than stating a committed professional conclusion to a reasonable degree of certainty',
          correct: true,
        },
        {
          id: 'c',
          text: 'It does not include a citation to peer-reviewed literature',
          correct: false,
        },
        {
          id: 'd',
          text: 'It is too short and should include the full methodology in the opinion statement',
          correct: false,
        },
      ],
      explanation:
        'Hedge words like "might," "could," and "possibly" weaken opinions and invite challenge. A well-stated opinion should be expressed to a "reasonable degree of professional certainty" and tied to the methodology and evidence that supports it. The stronger formulation would be: "It is my opinion, to a reasonable degree of engineering certainty, that the water intrusion was caused by defective installation of the roof-to-wall flashing, based on my site inspection, destructive testing, and code analysis."',
    },
    {
      id: 'q3',
      text: "A physician's expert report states a causation opinion but does not describe the differential diagnosis methodology used to rule out alternative causes. What is the most likely challenge this report will face?",
      options: [
        {
          id: 'a',
          text: "A challenge to the physician's qualifications",
          correct: false,
        },
        {
          id: 'b',
          text: 'A challenge to the completeness of the materials reviewed',
          correct: false,
        },
        {
          id: 'c',
          text: 'A Daubert challenge arguing the opinion lacks reliable methodology',
          correct: true,
        },
        {
          id: 'd',
          text: "A challenge based on the physician's compensation",
          correct: false,
        },
      ],
      explanation:
        "Medical causation opinions in federal court must demonstrate differential diagnosis methodology, showing how the expert systematically considered and ruled out alternative causes. A report that states a causation conclusion without documenting this methodology is vulnerable to a Daubert challenge on the ground that the opinion lacks a reliable methodological foundation. The court evaluates whether the expert's methodology is reliable, not whether the conclusion is correct.",
    },
    {
      id: 'q4',
      text: 'An expert discovers that his current report contains a paragraph describing "the October 2019 site inspection of the Elm Street property" - but his current case involves a different property and his inspection occurred in March 2024. What most likely happened, and what is the consequence?',
      options: [
        {
          id: 'a',
          text: 'A typographical error that can be corrected with a supplemental report and will have minimal impact',
          correct: false,
        },
        {
          id: 'b',
          text: "Language was copy-pasted from a prior report, and opposing counsel will use this to argue that the expert's entire analysis is recycled rather than case-specific",
          correct: true,
        },
        {
          id: 'c',
          text: "The court reporter made a transcription error from the expert's dictation",
          correct: false,
        },
        {
          id: 'd',
          text: 'Retaining counsel inserted the wrong information, which shields the expert from responsibility',
          correct: false,
        },
      ],
      explanation:
        'Reusing language from prior reports is efficient but dangerous. Case-specific details from a prior engagement that appear in your current report will be found by opposing counsel, and the resulting deposition questioning will be devastating. Every report should be drafted from scratch for the specific case. Use templates for structure, but write the substance fresh each time.',
    },
    {
      id: 'q5',
      text: 'An expert discovers that their written report contains a statement that is inconsistent with testimony they gave at a recent deposition in the same case. What is the best course of action?',
      options: [
        {
          id: 'a',
          text: 'Do nothing and hope opposing counsel does not notice the inconsistency',
          correct: false,
        },
        {
          id: 'b',
          text: 'Change the deposition transcript to match the report',
          correct: false,
        },
        {
          id: 'c',
          text: 'Issue a supplemental or amended report correcting the inconsistency and notify retaining counsel immediately',
          correct: true,
        },
        {
          id: 'd',
          text: 'Withdraw the report entirely and decline to testify',
          correct: false,
        },
      ],
      explanation:
        "Inconsistencies between the written report and deposition testimony are a primary tool for impeachment at trial. Opposing counsel will identify every discrepancy and use it to undermine the expert's credibility. The appropriate response is to issue a supplemental or amended report, disclose the correction to retaining counsel, and be prepared to explain the change transparently. Hoping the inconsistency goes unnoticed is not a viable strategy; opposing counsel reviews reports and transcripts with precisely this goal.",
    },
    {
      id: 'q6',
      text: 'An expert reviewed a document during case analysis but did not ultimately rely on it in forming opinions. Should it appear in the Materials Reviewed section of the report?',
      options: [
        {
          id: 'a',
          text: 'Yes. FRCP 26(a)(2)(B) requires disclosure of facts or data "considered," which is broader than "relied upon." Every document reviewed must be listed.',
          correct: true,
        },
        {
          id: 'b',
          text: 'No. Only documents the expert affirmatively relied on should be listed.',
          correct: false,
        },
        {
          id: 'c',
          text: 'Only if opposing counsel specifically requests it during discovery.',
          correct: false,
        },
        {
          id: 'd',
          text: "Only if the document supports the expert's conclusions.",
          correct: false,
        },
      ],
      explanation:
        'FRCP 26(a)(2)(B)(ii) requires the report to contain "the facts or data considered by the witness in forming" the opinions. The word "considered" is broader than "relied upon." A document that the expert reviewed and considered, even if the expert ultimately did not rely on it, must be disclosed. Omitting such a document creates a credibility risk if opposing counsel discovers the gap, because the implication is that the expert was either careless (forgot to list it) or deliberately hiding unfavorable material.',
    },
    {
      id: 'q7',
      text: "A digital forensics expert's report includes screenshots of forensic tool output, but none of the screenshots are labeled as exhibits or include descriptive captions. What is the primary risk?",
      options: [
        {
          id: 'a',
          text: 'The screenshots are automatically inadmissible as evidence under the Federal Rules of Evidence',
          correct: false,
        },
        {
          id: 'b',
          text: 'Unlabeled exhibits cannot be efficiently referenced at deposition or trial and signal careless report preparation',
          correct: true,
        },
        {
          id: 'c',
          text: 'The court will exclude the entire expert report',
          correct: false,
        },
        {
          id: 'd',
          text: 'The opposing expert will be unable to write a rebuttal report',
          correct: false,
        },
      ],
      explanation:
        'Exhibits that lack labels, numbers, and descriptive captions cannot be efficiently referenced during deposition or trial proceedings. Counsel and the court need to refer to specific exhibits by number ("Please turn to Exhibit 7"). Unlabeled exhibits also signal careless preparation, which undermines the expert\'s credibility. While unlabeled exhibits are not automatically inadmissible, the practical impact on the expert\'s credibility and the usability of the report is significant.',
    },
    {
      id: 'q8',
      text: 'Before submitting a final expert report, the most important self-editing question an expert should ask about every sentence is:',
      options: [
        {
          id: 'a',
          text: '"Does the retaining attorney approve of this language?"',
          correct: false,
        },
        {
          id: 'b',
          text: '"Is this the strongest possible statement of my opinion?"',
          correct: false,
        },
        {
          id: 'c',
          text: '"Can I defend this statement under cross-examination?"',
          correct: true,
        },
        {
          id: 'd',
          text: '"Will the jury find this persuasive?"',
          correct: false,
        },
      ],
      explanation:
        "The expert's primary obligation is to provide defensible, well-supported opinions, not to please the retaining attorney, maximize rhetorical force, or persuade the jury. Every sentence in the report will be scrutinized at deposition, where opposing counsel will ask the expert to confirm, explain, or defend each statement. If the expert cannot defend a statement under cross-examination, it should not appear in the report. This question focuses the expert on credibility and defensibility, which are the foundations of effective expert testimony.",
    },
  ],
}
