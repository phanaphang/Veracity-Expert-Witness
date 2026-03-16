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
  <small>Deposition as an Expert Witness</small>
</div>
<div class="page">${body}</div>
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`;

// -- Resource 1: Deposition Preparation Quick Reference Card --
const resource1Html = () => htmlShell(
  'Deposition Preparation Quick Reference Card',
  `
<h1>Deposition Preparation Quick Reference Card</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Essential preparation steps, key rules, and answering techniques for expert depositions
</p>

<h2>Pre-Deposition Preparation Checklist</h2>
<div class="alert">The deposition is won or lost in preparation. Every hour invested in preparation reduces your exposure to impeachment and credibility damage.</div>
<div class="check-item">Re-read your entire report, including appendices and exhibits</div>
<div class="check-item">For every sentence, ask: "Can I explain this if asked?" and "Would I change anything?"</div>
<div class="check-item">Identify your weakest statements -- opposing counsel will find them</div>
<div class="check-item">Review all materials listed in your "Materials Reviewed" section</div>
<div class="check-item">Review any prior deposition or trial testimony you have given in other cases</div>
<div class="check-item">Review your publications that relate to the subject matter</div>
<div class="check-item">Conduct a preparation session with retaining counsel</div>
<div class="check-item">Discuss likely lines of attack based on opposing expert report and case posture</div>
<div class="check-item">Clarify logistics: location, timing, breaks, attendees, videotaping</div>

<h2>Who Is in the Room</h2>
<table>
  <thead>
    <tr>
      <th style="width:25%">Participant</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Deposing attorney</strong></td>
      <td>Opposing counsel -- asks questions and controls the pace</td>
    </tr>
    <tr>
      <td><strong>Retaining counsel</strong></td>
      <td>Defends the deposition by making objections and, rarely, instructing not to answer</td>
    </tr>
    <tr>
      <td><strong>Court reporter</strong></td>
      <td>Records every word spoken -- speak clearly, avoid gestures, do not talk over others</td>
    </tr>
    <tr>
      <td><strong>Videographer</strong></td>
      <td>Records video that may be played for the jury at trial</td>
    </tr>
    <tr>
      <td><strong>Other attorneys</strong></td>
      <td>In multi-party cases, additional attorneys may attend and question you</td>
    </tr>
  </tbody>
</table>

<h2>Key Federal Rules</h2>
<table>
  <thead>
    <tr>
      <th style="width:20%">Rule</th>
      <th>What It Covers</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>FRCP 26(b)(4)</strong></td>
      <td>Discovery of expert testimony -- allows deposing any identified expert</td>
    </tr>
    <tr>
      <td><strong>FRCP 30</strong></td>
      <td>Depositions by oral examination -- governs the deposition process</td>
    </tr>
    <tr>
      <td><strong>FRCP 30(c)(2)</strong></td>
      <td>Objections must be "stated concisely in a non-argumentative and non-suggestive manner"</td>
    </tr>
    <tr>
      <td><strong>FRCP 30(e)</strong></td>
      <td>Right to review transcript and submit errata sheet within 30 days</td>
    </tr>
    <tr>
      <td><strong>FRCP 32(a)</strong></td>
      <td>Use of depositions at trial -- impeachment, substantive evidence, read-ins</td>
    </tr>
    <tr>
      <td><strong>FRE 803(18)</strong></td>
      <td>Learned treatise exception -- allows treatises to be read during expert cross-examination</td>
    </tr>
  </tbody>
</table>
`
);

// -- Resource 2: Answering Techniques Guide --
const resource2Html = () => htmlShell(
  'Deposition Answering Techniques Guide',
  `
<h1>Deposition Answering Techniques Guide</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  The listen-pause-answer method, short answers, qualifying responses, and handling difficult questions
</p>

<h2>The Listen-Pause-Answer Method</h2>
<div class="callout">
  <strong>Key principle:</strong> Every additional word you speak beyond what the question requires is a gift to opposing counsel.
  It opens new lines of inquiry and creates new opportunities for impeachment.
</div>
<ol>
  <li><strong>Listen</strong> to the entire question. Do not begin formulating your answer while the attorney is still speaking.</li>
  <li><strong>Pause</strong> before answering (2-3 seconds). This gives you time to consider the question and allows retaining counsel to object.</li>
  <li><strong>Answer</strong> only what was asked. Resist the urge to explain, elaborate, or volunteer information.</li>
</ol>

<h2>Short Answer Power</h2>
<table>
  <thead>
    <tr>
      <th style="width:25%">Question</th>
      <th style="width:38%">Poor Answer (too long)</th>
      <th style="width:37%">Better Answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"Did you visit the site?"</td>
      <td>"Yes, I visited the site on March 15 and noticed the flashing was deteriorated and I also took photos..."</td>
      <td>"Yes."</td>
    </tr>
    <tr>
      <td>"What methodology did you use?"</td>
      <td>"Well, I considered several approaches but ultimately decided on a visual inspection supplemented by..."</td>
      <td>"Visual inspection supplemented by moisture testing, as described in Section VI of my report."</td>
    </tr>
  </tbody>
</table>

<h2>Powerful Phrases for Depositions</h2>
<table>
  <thead>
    <tr>
      <th>Phrase</th>
      <th>When to Use It</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"I don't know."</td>
      <td>The information is outside your knowledge. Do not guess.</td>
    </tr>
    <tr>
      <td>"I don't recall."</td>
      <td>You once knew but cannot currently remember. Be prepared for refresh attempts.</td>
    </tr>
    <tr>
      <td>"I can't answer that as phrased."</td>
      <td>The question contains an incorrect assumption or is misleading.</td>
    </tr>
    <tr>
      <td>"That question is compound."</td>
      <td>The question bundles multiple questions together.</td>
    </tr>
    <tr>
      <td>"Subject to [qualification], yes."</td>
      <td>The answer requires a condition or limitation.</td>
    </tr>
    <tr>
      <td>"That is not what I said."</td>
      <td>The attorney mischaracterizes your prior statement or opinion.</td>
    </tr>
    <tr>
      <td>"That is outside the scope of my engagement."</td>
      <td>The question asks about topics beyond your retained scope.</td>
    </tr>
  </tbody>
</table>

<h2>Qualifying vs. Hedging</h2>
<div class="alert">Qualifying your answers is not evasion -- it is precision. An expert who qualifies appropriately demonstrates the careful thinking that courts expect.</div>
<table>
  <thead>
    <tr>
      <th style="width:50%">Hedging (avoid)</th>
      <th style="width:50%">Qualifying (appropriate)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"I think so, maybe."</td>
      <td>"Subject to the assumptions stated in my report, yes."</td>
    </tr>
    <tr>
      <td>"It could possibly be that way."</td>
      <td>"In my experience, that is the standard practice in the majority of cases."</td>
    </tr>
  </tbody>
</table>
`
);

// -- Resource 3: Common Traps & Counter-Strategies Checklist --
const resource3Html = () => htmlShell(
  'Common Deposition Traps & Counter-Strategies',
  `
<h1>Common Deposition Traps &amp; Counter-Strategies</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Recognize the setup before you fall into the sequence -- preparation and precise language are your best defense
</p>

<h2>The Five Major Traps</h2>
<table>
  <thead>
    <tr>
      <th style="width:18%">Trap</th>
      <th style="width:32%">How It Works</th>
      <th style="width:25%">Why It's Dangerous</th>
      <th style="width:25%">Counter-Strategy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Absolute Trap</strong></td>
      <td>"Is it fair to say you always...?" or "There are no circumstances where...?"</td>
      <td>Once you agree to an absolute, opposing counsel produces a counterexample</td>
      <td>"In my experience, [X] is standard in the vast majority of cases." Avoid "always" and "never."</td>
    </tr>
    <tr>
      <td><strong>Scope Creep</strong></td>
      <td>Questions that fall outside your engagement -- e.g., "Is the building safe for occupancy?"</td>
      <td>Off-the-cuff opinions lack analytical rigor and create Daubert exposure</td>
      <td>"That is outside the scope of my engagement. My opinions are limited to [specific scope]."</td>
    </tr>
    <tr>
      <td><strong>Learned Treatise</strong></td>
      <td>"Would you agree [Author]'s textbook is authoritative?" (FRE 803(18))</td>
      <td>A blanket endorsement lets counsel read contradictory passages as substantive evidence</td>
      <td>"I'm familiar with the work. I'd need to see the specific passage before commenting."</td>
    </tr>
    <tr>
      <td><strong>Inconsistency Trap</strong></td>
      <td>"In [prior case], you said [X]. Now you're saying [Y]."</td>
      <td>The jury sees contradiction rather than professional evolution</td>
      <td>"My understanding has evolved based on [new data/research]. The current facts support [opinion]."</td>
    </tr>
    <tr>
      <td><strong>Compensation Bias</strong></td>
      <td>"How much have you been paid? You want to keep getting hired, correct?"</td>
      <td>Implies you are a "hired gun" whose opinions follow the money</td>
      <td>"I am compensated for my time, not my opinions. My rate is [X] regardless of the outcome."</td>
    </tr>
  </tbody>
</table>

<h2>Opposing Counsel's Questioning Techniques</h2>
<table>
  <thead>
    <tr>
      <th style="width:22%">Technique</th>
      <th>Description</th>
      <th style="width:30%">Your Response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Friendly Warm-Up</strong></td>
      <td>Easy background questions to build a "yes" rhythm and lower your guard</td>
      <td>Stay attentive. Apply the same care to background questions as substantive ones.</td>
    </tr>
    <tr>
      <td><strong>Leading Questions</strong></td>
      <td>"Isn't it true that...?" -- suggests its own answer</td>
      <td>Listen to the specific words. If the question misstates your position, correct it.</td>
    </tr>
    <tr>
      <td><strong>Hypotheticals</strong></td>
      <td>"Assume [different facts]. Would that change your opinion?"</td>
      <td>Understand the full hypothetical. Note if it omits critical facts or is unrealistic.</td>
    </tr>
    <tr>
      <td><strong>Rapid-Fire</strong></td>
      <td>Fast pace to prevent careful thought and extract quick concessions</td>
      <td>Maintain your pace. You control the speed of your answers. Take breaks if fatigued.</td>
    </tr>
    <tr>
      <td><strong>Silence</strong></td>
      <td>Attorney stays silent after your answer, hoping you fill the void with more words</td>
      <td>Stop when you've answered. Sit comfortably. The next move is the attorney's.</td>
    </tr>
  </tbody>
</table>

<h2>Composure and Credibility Checklist</h2>
<div class="check-item">Maintain a calm, measured tone regardless of provocation</div>
<div class="check-item">Do not argue with the attorney -- redirect to your opinions</div>
<div class="check-item">Avoid sarcasm, eye-rolling, sighing, or crossing arms (especially on video)</div>
<div class="check-item">Acknowledge fair criticisms -- candor builds more trust than stubbornness</div>
<div class="check-item">Apply the same standards to both sides -- fairness signals objectivity</div>
<div class="check-item">Be precise -- say exactly what you mean, no more and no less</div>
`
);

// -- Resource 4: Full Module Summary --
const resource4Html = () => htmlShell(
  'Deposition Module - Full Summary',
  `
<h1>Deposition Module - Full Summary</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Condensed reference notes from all eight lessons -- Deposition as an Expert Witness
</p>

<h2>Lesson 1: What Is a Deposition and Why It Matters</h2>
<ul>
  <li>A deposition is sworn, out-of-court testimony recorded by a court reporter under FRCP 30</li>
  <li>FRCP 26(b)(4) allows deposing any identified expert whose opinions may be presented at trial</li>
  <li>The transcript becomes a permanent litigation weapon -- impeachment, substantive evidence, motion practice</li>
  <li>Expert depositions focus on opinions, methodology, and bases (not just personal observations like fact witnesses)</li>
</ul>

<h2>Lesson 2: Preparation</h2>
<ul>
  <li>Re-master your report: know every sentence, assumption, citation, and limitation</li>
  <li>Read your report as opposing counsel looking for weaknesses</li>
  <li>Conduct a thorough preparation session with retaining counsel</li>
  <li>Review all materials on your list, prior testimony, and relevant publications</li>
  <li>If opinions have changed, discuss supplementation (FRCP 26(e)) before the deposition</li>
</ul>

<h2>Lesson 3: Rules and Mechanics</h2>
<ul>
  <li>Participants: deposing attorney, retaining counsel, court reporter, videographer, possibly other attorneys</li>
  <li>The oath carries the same legal weight as trial testimony -- perjury is a criminal offense</li>
  <li>Common objections: form, asked and answered, instruction not to answer (narrow circumstances only)</li>
  <li>When counsel objects, pause and wait. Answer after the objection unless instructed not to.</li>
  <li>You may take reasonable breaks, but answer any pending question first</li>
</ul>

<h2>Lesson 4: The Art of Answering Questions</h2>
<ul>
  <li><strong>Listen-Pause-Answer:</strong> hear the full question, pause 2-3 seconds, answer only what was asked</li>
  <li>Volunteering information is the most common expert deposition mistake</li>
  <li>"Yes," "No," and "I don't know" are complete answers</li>
  <li>"I don't know" = outside your knowledge; "I don't recall" = once knew, can't retrieve now</li>
  <li>Never guess -- speculative answers are devastating at trial</li>
  <li>Qualify when the question contains incorrect assumptions: "I can't answer that as phrased because..."</li>
</ul>

<h2>Lesson 5: Opposing Counsel's Techniques</h2>
<ul>
  <li><strong>Friendly warm-up:</strong> easy questions to build a "yes" rhythm -- stay alert</li>
  <li><strong>Leading questions:</strong> "Isn't it true that...?" -- do not accept the attorney's framing if inaccurate</li>
  <li><strong>Hypotheticals:</strong> note if they omit critical facts or are unrealistic</li>
  <li><strong>Rapid-fire:</strong> maintain your own pace; request breaks if fatigued</li>
  <li><strong>Silence:</strong> when you've answered, stop. The silence is the attorney's problem.</li>
</ul>

<h2>Lesson 6: Common Traps</h2>
<ul>
  <li><strong>Absolute trap:</strong> avoid "always" and "never" -- use "in my experience" and "generally"</li>
  <li><strong>Scope creep:</strong> clearly state engagement boundaries; never offer opinions outside your scope</li>
  <li><strong>Learned treatise (FRE 803(18)):</strong> never broadly endorse a publication; require the specific passage</li>
  <li><strong>Inconsistency trap:</strong> explain professional evolution with new data/research</li>
  <li><strong>Compensation bias:</strong> "I am compensated for my time, not my opinions"</li>
</ul>

<h2>Lesson 7: Composure and Credibility</h2>
<ul>
  <li>Anger signals defensiveness; frustration signals impatience; sarcasm signals contempt</li>
  <li>Never argue with the attorney -- redirect to your opinions</li>
  <li>On video: maintain neutral posture, natural eye contact, no fidgeting or sighing</li>
  <li>Credibility = consistency + candor + fairness + precision</li>
  <li>A single moment of perceived dishonesty can undermine an entire testimony</li>
</ul>

<h2>Lesson 8: Transcript and Post-Deposition</h2>
<ul>
  <li>FRCP 30(e): review transcript and submit errata within 30 days</li>
  <li>Typographical corrections are routine; substantive changes are heavily scrutinized</li>
  <li>Deposition transcripts are used for: impeachment, substantive evidence, motion practice, read-ins</li>
  <li>Consistency between report, deposition, and trial testimony is critical</li>
  <li>Do not issue supplemental reports solely to "fix" deposition answers</li>
  <li>After every deposition, conduct a self-assessment to improve for next time</li>
</ul>

<h2>Key Principles to Carry Forward</h2>
<ol>
  <li><strong>Preparation is everything.</strong> Know your report cold and anticipate the lines of attack.</li>
  <li><strong>Listen, pause, answer.</strong> This three-step cadence is the foundation of good deposition technique.</li>
  <li><strong>Answer only what was asked.</strong> Every extra word is a gift to opposing counsel.</li>
  <li><strong>"I don't know" is power.</strong> Never guess -- speculation is devastating at trial.</li>
  <li><strong>Know the traps.</strong> Absolutes, scope creep, treatises, inconsistencies, and compensation bias are all avoidable.</li>
  <li><strong>Guard your scope.</strong> Opinions outside your engagement lack analytical support and create vulnerability.</li>
  <li><strong>Composure is credibility.</strong> Never argue, never lose your temper, never sacrifice long-term credibility for a short-term point.</li>
  <li><strong>The transcript is permanent.</strong> Every word follows you to trial. Review it, maintain consistency, and learn from every deposition.</li>
</ol>
`
);

// -- Page component --

const RESOURCES = [
  {
    id: 'r1',
    title: 'Deposition Preparation Quick Reference Card',
    description:
      'Pre-deposition checklist, who is in the room, key federal rules (FRCP 26(b)(4), 30, 30(e), 32(a), FRE 803(18)).',
    generate: resource1Html,
  },
  {
    id: 'r2',
    title: 'Answering Techniques Guide',
    description:
      'The listen-pause-answer method, short answer power, powerful phrases for depositions, and qualifying vs. hedging.',
    generate: resource2Html,
  },
  {
    id: 'r3',
    title: 'Common Deposition Traps & Counter-Strategies',
    description:
      'The five major traps (absolute, scope creep, learned treatise, inconsistency, compensation bias), opposing counsel techniques, and composure checklist.',
    generate: resource3Html,
  },
  {
    id: 'r4',
    title: 'Deposition Module - Full Summary',
    description:
      'Condensed reference notes from all eight lessons covering deposition purpose, preparation, mechanics, answering technique, traps, composure, and post-deposition considerations.',
    generate: resource4Html,
  },
];

export default function DepositionResourcesPage() {
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
          Deposition as an Expert Witness - 4 reference guides
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
        <Link to="/training/deposition" className="btn btn--secondary">
          Back to Training Home
        </Link>
        <Link to="/training" className="btn btn--secondary">
          All Training Modules
        </Link>
      </div>
    </div>
  );
}
