import React from 'react';
import { Link } from 'react-router-dom';

// -- Shared HTML shell --
const htmlShell = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} - Veracity Expert Witness</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a2e; background: #fff;
    margin: 0; padding: 0; font-size: 14px; line-height: 1.7; }
  .page { max-width: 900px; margin: 0 auto; padding: 40px 32px 60px; }
  .brand-bar { background: #1a1f3a; color: #fff; padding: 16px 32px;
    display: flex; align-items: center; gap: 12px; }
  .brand-bar span { font-size: 18px; font-weight: 700; font-family: Arial, sans-serif; }
  .brand-bar small { color: #d36622; font-size: 12px; font-family: Arial, sans-serif; }
  h1 { font-size: 22px; color: #1a1f3a; margin: 32px 0 8px; line-height: 1.3; }
  h2 { font-size: 17px; color: #1a1f3a; margin: 28px 0 8px; border-bottom: 2px solid #d36622;
    padding-bottom: 4px; font-family: Arial, sans-serif; }
  h3 { font-size: 14px; color: #d36622; margin: 18px 0 6px; font-family: Arial, sans-serif;
    font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
  p { margin: 0 0 10px; }
  ul, ol { margin: 6px 0 14px; padding-left: 22px; }
  li { margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;
    font-family: Arial, sans-serif; }
  th { background: #1a1f3a; color: #fff; padding: 9px 12px; text-align: left;
    font-weight: 600; border: 1px solid #c0c4cc; }
  td { padding: 8px 12px; border: 1px solid #dde0e7; vertical-align: top; }
  tr:nth-child(even) td { background: #f6f7fb; }
  .alert { background: #fff8ee; border-left: 4px solid #d36622; padding: 12px 16px;
    margin: 14px 0; font-family: Arial, sans-serif; font-size: 13px; }
  .callout { background: #1a1f3a; color: #fff; padding: 16px 20px; border-radius: 4px;
    margin: 20px 0; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; }
  .callout strong { color: #d36622; }
  .check-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 8px;
    font-family: Arial, sans-serif; font-size: 13px; }
  .check-item::before { content: "\\2610"; flex-shrink: 0; color: #d36622; font-size: 16px;
    line-height: 1.2; }
  .divider { border: none; border-top: 1px solid #dde0e7; margin: 24px 0; }
  .print-btn { position: fixed; bottom: 24px; right: 24px; background: #d36622; color: #fff;
    border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer;
    font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
<div class="brand-bar">
  <span>Veracity Expert Witness</span>
  <small>Trial Testimony as an Expert Witness</small>
</div>
<div class="page">${body}</div>
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
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
    generate: resource1Html,
  },
  {
    id: 'r2',
    title: 'Cross-Examination Survival Guide',
    description:
      'Cross-examination techniques (looping, cherry-picking, concession cascade, impeachment), the three-word shield, and key rules.',
    generate: resource2Html,
  },
  {
    id: 'r3',
    title: 'Jury Communication Tips',
    description:
      'Plain language principles, body language do\'s and don\'ts, pacing and emphasis, and when to look at the jury vs. the attorney.',
    generate: resource3Html,
  },
  {
    id: 'r4',
    title: 'Trial Testimony Module - Full Summary',
    description:
      'Condensed reference notes from all ten lessons covering trial preparation, qualification, direct and cross examination, redirect, jury communication, visual aids, ethics, and post-testimony.',
    generate: resource4Html,
  },
];

export default function TrialTestimonyResourcesPage() {
  const handleOpen = (generateHtml) => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(generateHtml());
      win.document.close();
    }
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Downloadable Resources</h1>
        <p className="portal-page__subtitle">
          Trial Testimony as an Expert Witness - 4 reference guides
        </p>
      </div>

      <div className="training-units">
        {RESOURCES.map((resource, i) => (
          <div key={resource.id} className="portal-card training-unit-card">
            <div className="training-unit-card__header">
              <div>
                <div className="training-unit-card__number">Resource {i + 1}</div>
                <h2 className="training-unit-card__title">{resource.title}</h2>
              </div>
            </div>
            <p
              style={{
                color: 'var(--color-gray-500)',
                fontSize: 14,
                lineHeight: 1.6,
                margin: '8px 0 20px',
              }}
            >
              {resource.description}
            </p>
            <button
              className="btn btn--secondary training-unit-card__btn"
              onClick={() => handleOpen(resource.generate)}
            >
              Open Resource
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link to="/training/trial-testimony" className="btn btn--secondary">
          Back to Training Home
        </Link>
        <Link to="/training" className="btn btn--secondary">
          All Training Modules
        </Link>
      </div>
    </div>
  );
}
