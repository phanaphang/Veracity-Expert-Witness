import React from 'react';
// -- Shared HTML shell --
const htmlShell = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} | Veracity Expert Witness</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f7f5f0; color: #3e442b; line-height: 1.6; }
  .page-wrap { max-width: 820px; margin: 0 auto; padding: 0 24px 60px; }
  .header-bar { background: #3e442b; color: white; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .header-bar .brand { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
  .header-bar .tag { font-size: 11px; color: #d36622; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }
  .content-card { background: #ffffff; border: 1px solid #e8dab2; border-radius: 12px; padding: 40px 48px; }
  h1 { font-size: 24px; font-weight: 700; color: #3e442b; margin: 0 0 4px; letter-spacing: -0.01em; }
  .subtitle { font-size: 11px; color: #d36622; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 32px; padding-bottom: 16px; border-bottom: 1px solid #e8dab2; }
  h2 { font-size: 11px; font-weight: 700; color: #d36622; margin: 32px 0 10px; text-transform: uppercase; letter-spacing: 0.07em; padding-left: 12px; border-left: 3px solid #d36622; }
  h3 { font-size: 11px; font-weight: 700; color: #d36622; margin: 18px 0 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  p { font-size: 14px; color: #4e5538; margin: 0 0 12px; line-height: 1.6; }
  strong { color: #3e442b; }
  em { font-style: normal; font-size: 13px; color: #676d5f; background: #f0ece3; padding: 2px 6px; border-radius: 4px; display: inline-block; margin: 4px 0 8px; line-height: 1.5; }
  ul, ol { padding-left: 20px; margin: 0 0 16px; }
  li { margin-bottom: 7px; font-size: 14px; color: #4e5538; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 24px; font-size: 13px; border-radius: 8px; overflow: hidden; }
  th { background: #3e442b; color: white; padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
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
      <div class="brand">Veracity Expert Witness</div>
      <div class="tag">Deposition as an Expert Witness</div>
    </div>
  </div>
  <div class="page-wrap">
    <div class="content-card">
      <button class="pdf-btn" onclick="window.print()">PDF</button>
      ${body}
      <div class="note">This document is provided by Veracity Expert Witness as a training reference. It is for educational purposes only and does not constitute legal advice.</div>
    </div>
  </div>
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
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    generate: resource1Html,
  },
  {
    id: 'r2',
    title: 'Answering Techniques Guide',
    description:
      'The listen-pause-answer method, short answer power, powerful phrases for depositions, and qualifying vs. hedging.',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    generate: resource2Html,
  },
  {
    id: 'r3',
    title: 'Common Deposition Traps & Counter-Strategies',
    description:
      'The five major traps (absolute, scope creep, learned treatise, inconsistency, compensation bias), opposing counsel techniques, and composure checklist.',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    generate: resource3Html,
  },
  {
    id: 'r4',
    title: 'Deposition Module - Full Summary',
    description:
      'Condensed reference notes from all eight lessons covering deposition purpose, preparation, mechanics, answering technique, traps, composure, and post-deposition considerations.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    generate: resource4Html,
  },
];

export default function DepositionResourcesPage() {
  const openResource = (resource) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(resource.generate());
    win.document.close();
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Downloadable Resources</h1>
        <p className="portal-page__subtitle">4 reference guides — available anytime, open in a new tab</p>
      </div>

      <div className="training-resources">
        {RESOURCES.map((res) => (
          <div key={res.id} className="portal-card training-resource-card">
            <div className="training-resource-card__icon">
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
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
            >
              Open →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
