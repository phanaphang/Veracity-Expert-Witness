import React from 'react';
import { Link } from 'react-router-dom';
import TrainingDisclaimer from '../../components/TrainingDisclaimer';
// -- Shared HTML shell --
const htmlShell = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} | Veracity Expert Witness LLC</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f7f5f0; color: #3e442b; line-height: 1.6; }
  .page-wrap { max-width: 820px; margin: 0 auto; padding: 0 24px 60px; }
  .header-bar { background: #3e442b; color: white; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .header-bar .brand { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
  .header-bar .tag { font-size: 12px; color: #d36622; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }
  .content-card { background: #ffffff; border: 1px solid #e8dab2; border-radius: 12px; padding: 40px 48px; }
  h1 { font-size: 24px; font-weight: 700; color: #3e442b; margin: 0 0 4px; letter-spacing: -0.01em; }
  .subtitle { font-size: 12px; color: #d36622; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 32px; padding-bottom: 16px; border-bottom: 1px solid #e8dab2; }
  h2 { font-size: 12px; font-weight: 700; color: #d36622; margin: 32px 0 10px; text-transform: uppercase; letter-spacing: 0.07em; padding-left: 12px; border-left: 3px solid #d36622; }
  h3 { font-size: 12px; font-weight: 700; color: #d36622; margin: 18px 0 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  p { font-size: 14px; color: #4e5538; margin: 0 0 12px; line-height: 1.6; }
  strong { color: #3e442b; }
  em { font-style: normal; font-size: 13px; color: #676d5f; background: #f0ece3; padding: 2px 6px; border-radius: 4px; display: inline-block; margin: 4px 0 8px; line-height: 1.5; }
  ul, ol { padding-left: 20px; margin: 0 0 16px; }
  li { margin-bottom: 7px; font-size: 14px; color: #4e5538; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 24px; font-size: 13px; border-radius: 8px; overflow: hidden; }
  th { background: #3e442b; color: white; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 10px 14px; border-bottom: 1px solid #e8dab2; color: #4e5538; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background: #f7f5f0; }
  .alert { background: #f0ece3; border-left: 3px solid #d36622; padding: 12px 16px; margin: 14px 0; font-size: 13px; color: #676d5f; line-height: 1.5; }
  .callout { background: #3e442b; color: #fff; padding: 16px 20px; border-radius: 8px; margin: 20px 0; font-size: 13px; line-height: 1.6; }
  .callout strong { color: #d36622; }
  .callout li, .callout p, .callout ol, .callout ul { color: #fff; }
  .check-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 8px; font-size: 13px; color: #4e5538; }
  .check-item::before { content: "\\2610"; flex-shrink: 0; color: #d36622; font-size: 16px; line-height: 1.2; }
  .divider { border: none; border-top: 1px solid #e8dab2; margin: 24px 0; }
  .note { background: #f0ece3; border: 1px solid #e8dab2; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #676d5f; margin-top: 40px; line-height: 1.5; }
  .pdf-btn { display: inline-block; margin: 0 0 24px; padding: 9px 20px; background: #d36622; color: #fff; font-family: inherit; font-size: 13px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; letter-spacing: 0.02em; }
  .pdf-btn:hover { background: #b8551a; }
  @page { margin: 0; }
  @media print { .pdf-btn { display: none; } body { padding: 0.45in; } }
</style>
</head>
<body>
  <div class="header-bar">
    <div>
      <div class="brand">Veracity Expert Witness LLC</div>
      <div class="tag">Trial Testimony as an Expert Witness</div>
    </div>
  </div>
  <div class="page-wrap">
    <div class="content-card">
      <button class="pdf-btn" onclick="window.print()">PDF</button>
      ${body}
      <div class="note">This document is provided by Veracity Expert Witness LLC LLC as a training reference. It is for educational purposes only and does not constitute legal advice. Veracity Expert Witness LLC LLC assumes no liability for how this content is applied. You remain solely responsible for your own professional conduct and testimony.</div>
    </div>
  </div>
</body>
</html>`;

// -- Resource 1: Trial Preparation Checklist --
const resource1Html = () => htmlShell(
  'Trial Preparation Checklist',
  `
<h1>Trial Preparation Checklist</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Essential steps for preparing to testify as an expert witness at trial
</p>

<h2>Report and Case Mastery</h2>
<div class="check-item">Re-read your entire report, including appendices and exhibits</div>
<div class="check-item">Compare your report to your deposition transcript -- identify any variations</div>
<div class="check-item">Review all exhibits and demonstratives referenced in your report</div>
<div class="check-item">Confirm your opinions have not changed since the report was issued</div>
<div class="check-item">Read the opposing expert's report and identify points of disagreement</div>

<h2>Pre-Trial Conference with Counsel</h2>
<div class="check-item">Review the direct examination outline -- know the order and flow</div>
<div class="check-item">Discuss anticipated cross-examination topics and prepare responses</div>
<div class="check-item">Identify the 3-5 key points the jury must understand</div>
<div class="check-item">Review demonstrative exhibits and practice explaining them</div>
<div class="check-item">Discuss timing -- how long your direct is expected to last</div>
<div class="check-item">Ask about judge preferences and courtroom rules</div>

<h2>Deposition Transcript Review</h2>
<div class="check-item">Read your entire deposition transcript before trial</div>
<div class="check-item">Flag any answers that could be read differently than intended</div>
<div class="check-item">If your understanding has evolved, prepare to explain why</div>
<div class="check-item">Ensure trial testimony will be consistent with deposition testimony</div>

<h2>Courtroom Familiarization</h2>
<div class="check-item">Visit the courtroom before testifying if possible</div>
<div class="check-item">Note jury seating relative to the witness stand</div>
<div class="check-item">Confirm screen/projector placement for demonstrative exhibits</div>
<div class="check-item">Test courtroom technology (laptop connections, document cameras)</div>
<div class="check-item">Prepare backup plan if technology fails (printed enlargements)</div>

<h2>Qualification Preparation</h2>
<div class="check-item">Prepare to defend your credentials relative to your specific opinions</div>
<div class="check-item">Quantify your experience with specific numbers</div>
<div class="check-item">Know how many times you have testified and for which sides</div>
<div class="check-item">Be ready to articulate why your methodology is reliable</div>
`
);

// -- Resource 2: Cross-Examination Survival Guide --
const resource2Html = () => htmlShell(
  'Cross-Examination Survival Guide',
  `
<h1>Cross-Examination Survival Guide</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Techniques, traps, and defenses for expert witnesses under cross-examination at trial
</p>

<h2>Cross-Examination Techniques and Defenses</h2>
<table>
  <thead>
    <tr>
      <th style="width:20%">Technique</th>
      <th style="width:35%">How It Works</th>
      <th style="width:45%">Your Defense</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Looping</strong></td>
      <td>Using your concession from one answer as the premise for the next question</td>
      <td>Listen to each question independently. Do not let your prior answer lock you in.</td>
    </tr>
    <tr>
      <td><strong>Cherry-picking</strong></td>
      <td>Selecting one piece of evidence that supports their theory while ignoring the rest</td>
      <td>"My opinion is based on the totality of the evidence, not any single document in isolation."</td>
    </tr>
    <tr>
      <td><strong>Concession cascade</strong></td>
      <td>Getting you to agree to small, harmless points that build to a damaging conclusion</td>
      <td>Before agreeing to any premise, consider where the line of questioning is heading.</td>
    </tr>
    <tr>
      <td><strong>Out-of-context reading</strong></td>
      <td>Reading a sentence from your report out of context to suggest a different meaning</td>
      <td>"That sentence should be read in the context of the full paragraph [or section]."</td>
    </tr>
    <tr>
      <td><strong>Impeachment</strong></td>
      <td>Showing the jury that your deposition testimony is inconsistent with your trial testimony</td>
      <td>Maintain consistency. If there is a genuine difference, explain the reason clearly.</td>
    </tr>
  </tbody>
</table>

<h2>The Three-Word Shield</h2>
<div class="callout">
  <strong>Three phrases that protect you in almost any cross-examination situation:</strong>
  <ol>
    <li>"That is not what I said." -- When counsel mischaracterizes your testimony.</li>
    <li>"That is not my opinion." -- When counsel attributes a conclusion to you that you did not reach.</li>
    <li>"I would need to see the full context." -- When counsel reads a fragment out of context.</li>
  </ol>
</div>

<h2>Rules to Remember</h2>
<ul>
  <li>Cross-examination is limited to the scope of direct and credibility (FRE 611(b))</li>
  <li>Leading questions are permitted on cross -- the attorney controls the framing</li>
  <li>You are not required to accept the attorney's framing -- correct misstatements</li>
  <li>Answer what was asked, then stop. Do not volunteer additional information.</li>
  <li>If a question is compound, ambiguous, or contains an incorrect assumption, say so</li>
</ul>
`
);

// -- Resource 3: Jury Communication Tips --
const resource3Html = () => htmlShell(
  'Jury Communication Tips',
  `
<h1>Jury Communication Tips for Expert Witnesses</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  How to explain complex concepts clearly, use analogies, and present with confidence
</p>

<h2>Plain Language Principles</h2>
<ul>
  <li>Assume the jury knows nothing about your field</li>
  <li>Define technical terms immediately when you must use them</li>
  <li>Avoid acronyms unless defined and used repeatedly</li>
  <li>Test your explanations on non-expert friends or family before trial</li>
  <li>Tell a story -- jurors remember narratives better than lists of facts</li>
</ul>

<h2>Body Language and Presence</h2>
<table>
  <thead>
    <tr>
      <th>Do</th>
      <th>Don't</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Sit up straight, maintain open posture</td>
      <td>Slouch, cross arms, or lean away from mic</td>
    </tr>
    <tr>
      <td>Make eye contact with different jurors</td>
      <td>Stare at one juror or avoid eye contact</td>
    </tr>
    <tr>
      <td>Speak at a measured pace</td>
      <td>Rush through critical opinions</td>
    </tr>
    <tr>
      <td>Use natural hand gestures</td>
      <td>Fidget, tap, or play with objects</td>
    </tr>
    <tr>
      <td>Maintain the same demeanor on cross as on direct</td>
      <td>Become visibly defensive or argumentative</td>
    </tr>
  </tbody>
</table>

<h2>Pacing and Emphasis</h2>
<ol>
  <li><strong>Background/qualifications:</strong> Conversational pace</li>
  <li><strong>Methodology:</strong> Moderate, clear, organized</li>
  <li><strong>Key opinions:</strong> Slow, deliberate, with pauses for emphasis</li>
  <li><strong>Supporting evidence:</strong> Moderate pace</li>
  <li><strong>Cross-examination:</strong> Measured and even -- never speed up under pressure</li>
</ol>

<h2>When to Look at the Jury</h2>
<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Look At</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Direct examination (listening)</td>
      <td>The attorney asking the question</td>
    </tr>
    <tr>
      <td>Direct examination (answering)</td>
      <td>Turn to the jury to deliver your answer</td>
    </tr>
    <tr>
      <td>Cross-examination (listening)</td>
      <td>Face the attorney</td>
    </tr>
    <tr>
      <td>Cross-examination (substantive answers)</td>
      <td>Turn to the jury</td>
    </tr>
    <tr>
      <td>Using exhibits</td>
      <td>Face exhibit while pointing, then turn to jury to explain</td>
    </tr>
  </tbody>
</table>
`
);

// -- Resource 4: Full Module Summary --
const resource4Html = () => htmlShell(
  'Trial Testimony Module - Full Summary',
  `
<h1>Trial Testimony Module - Full Summary</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Condensed reference notes from all ten lessons -- Trial Testimony as an Expert Witness
</p>

<h2>Lesson 1: The Role of an Expert Witness at Trial</h2>
<ul>
  <li>Trial testimony is the culmination of your work as an expert -- report, deposition, and preparation lead here</li>
  <li>Unlike depositions, you are speaking to jurors who need complex concepts in plain language</li>
  <li>You are an educator, not an advocate -- the attorney advocates, you explain</li>
  <li>Phases: voir dire, direct, cross, redirect, recross</li>
</ul>

<h2>Lesson 2: Pre-Trial Preparation</h2>
<ul>
  <li>Re-master your report and compare it to your deposition transcript</li>
  <li>Pre-trial conference: review direct outline, anticipate cross, identify 3-5 key jury points</li>
  <li>Read your entire deposition transcript and flag potential inconsistencies</li>
  <li>Visit the courtroom and familiarize yourself with the layout and technology</li>
</ul>

<h2>Lesson 3: Voir Dire and Qualification</h2>
<ul>
  <li>FRE 702: qualified by knowledge, skill, experience, training, or education</li>
  <li>Common challenges: lack of specific experience, no board certification, outdated credentials</li>
  <li>Quantify your experience and lead with your most relevant qualifications</li>
  <li>Be prepared to survive a Daubert or Kelly challenge during voir dire</li>
</ul>

<h2>Lesson 4: Direct Examination</h2>
<ul>
  <li>Structure: qualifications, engagement, materials, methodology, opinions, bases</li>
  <li>Speak to the jury, use plain language, tell a story</li>
  <li>State opinions with specificity and appropriate confidence</li>
  <li>Practice with every exhibit before trial</li>
</ul>

<h2>Lesson 5: Cross-Examination Survival</h2>
<ul>
  <li>Cross is limited to scope of direct + credibility (FRE 611(b))</li>
  <li>Impeachment by prior statement is the most powerful technique -- consistency is the defense</li>
  <li>Key techniques: looping, cherry-picking, concession cascade, out-of-context reading</li>
  <li>Three-word shield: "That is not what I said," "That is not my opinion," "I would need to see the full context"</li>
</ul>

<h2>Lesson 6: Redirect and Rehabilitation</h2>
<ul>
  <li>Redirect is limited to topics raised on cross -- it is surgical, not a second direct</li>
  <li>Use redirect to complete answers, provide context, qualify concessions, and repair impeachment</li>
  <li>Return to teaching mode on redirect -- speak to the jury</li>
  <li>FRE 106 (Rule of Completeness) prevents misleading use of partial documents</li>
</ul>

<h2>Lesson 7: Communicating with the Jury</h2>
<ul>
  <li>Overcome the curse of knowledge -- assume the jury knows nothing about your field</li>
  <li>Use everyday analogies to bridge technical concepts</li>
  <li>Body language: open posture, eye contact, measured pace, natural gestures</li>
  <li>Vary pacing: slow for key opinions, moderate for background</li>
</ul>

<h2>Lesson 8: Visual Aids and Demonstrative Exhibits</h2>
<ul>
  <li>Types: photographs, diagrams, timelines, comparison charts, animations</li>
  <li>One concept per exhibit, large fonts, visible from 15+ feet</li>
  <li>Test courtroom technology in advance; always have a backup plan</li>
  <li>Lay proper foundation before using any exhibit (FRE requirements)</li>
</ul>

<h2>Lesson 9: Ethical Boundaries on the Stand</h2>
<ul>
  <li>Do not overstate certainty, ignore contrary evidence, or use inflammatory language</li>
  <li>FRE 704(a): experts may testify to ultimate issues in civil cases</li>
  <li>Stay within your scope -- do not offer opinions outside your engagement</li>
  <li>Candor builds credibility: concede fair points, acknowledge limitations</li>
</ul>

<h2>Lesson 10: Post-Testimony and Continuous Improvement</h2>
<ul>
  <li>Remain composed when leaving the stand -- the jury is still watching</li>
  <li>FRE 615: understand your sequestration status before trial</li>
  <li>Conduct a self-assessment: clarity, composure, surprises, exhibit effectiveness</li>
  <li>Debrief with counsel for feedback on your performance</li>
  <li>Maintain a testimony log and seek opportunities to improve</li>
</ul>
`
);

// -- Page component --

const RESOURCES = [
  {
    id: 'r1',
    title: 'Trial Preparation Checklist',
    description:
      'Pre-trial preparation steps for report mastery, counsel conference, deposition review, courtroom familiarization, and qualification defense.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    generate: resource1Html,
  },
  {
    id: 'r2',
    title: 'Cross-Examination Survival Guide',
    description:
      'Cross-examination techniques (looping, cherry-picking, concession cascade, impeachment), the three-word shield, and key rules.',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    generate: resource2Html,
  },
  {
    id: 'r3',
    title: 'Jury Communication Tips',
    description:
      'Plain language principles, body language do\'s and don\'ts, pacing and emphasis, and when to look at the jury vs. the attorney.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    generate: resource3Html,
  },
  {
    id: 'r4',
    title: 'Trial Testimony Module - Full Summary',
    description:
      'Condensed reference notes from all ten lessons covering trial preparation, qualification, direct and cross examination, redirect, jury communication, visual aids, ethics, and post-testimony.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    generate: resource4Html,
  },
];

export default function TrialTestimonyResourcesPage() {
  const openResource = (resource) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(resource.generate());
    win.document.close();
  };

  return (
    <div>
      <Link to="/portal/resources" className="training-lesson__back" style={{ color: 'var(--color-accent)' }}>← All Training Resources</Link>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Downloadable Resources</h1>
        <p className="portal-page__subtitle">4 reference guides - available anytime, open in a new tab</p>
      </div>

      <TrainingDisclaimer />

      <div className="training-resources">
        {RESOURCES.map((res) => (
          <div key={res.id} className="portal-card training-resource-card">
            <div className="training-resource-card__icon">
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28" aria-hidden="true">
                <path d={res.icon} stroke="var(--color-navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="training-resource-card__body">
              <h2 className="training-resource-card__title">{res.title}</h2>
              <p className="training-resource-card__desc">{res.description}</p>
            </div>
            <button
              className="btn btn--secondary training-resource-card__btn"
              onClick={() => openResource(res)}
              aria-label={`Open ${res.title}`}
            >
              Open →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
