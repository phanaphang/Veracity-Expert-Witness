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
      <div class="tag">Writing an Expert Witness Testimony Report</div>
    </div>
  </div>
  <div class="page-wrap">
    <div class="content-card">
      <button class="pdf-btn" onclick="window.print()">PDF</button>
      ${body}
      <div class="note">This document is provided by Veracity Expert Witness LLC as a training reference. It is for educational purposes only and does not constitute legal advice. Veracity Expert Witness LLC assumes no liability for how this content is applied. You remain solely responsible for your own professional conduct and testimony.</div>
    </div>
  </div>
</body>
</html>`;

// -- Resource 1: Report Structure Quick Reference Card --
const resource1Html = () => htmlShell(
  'Expert Report Structure Quick Reference Card',
  `
<h1>Expert Report Structure Quick Reference Card</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  The ten essential sections of a defensible expert report, with industry-specific guidance
</p>

<h2>The Ten Essential Sections</h2>
<table>
  <thead>
    <tr>
      <th style="width:25%">Section</th>
      <th>Purpose</th>
      <th style="width:30%">Key Considerations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Caption / Title Page</strong></td>
      <td>Identifies the report in the litigation record</td>
      <td>Case name, your name, date, retaining party</td>
    </tr>
    <tr>
      <td><strong>2. Qualifications Summary</strong></td>
      <td>Ties your credentials to the specific issues in this case</td>
      <td>Focused narrative, not your full CV (attach CV separately)</td>
    </tr>
    <tr>
      <td><strong>3. Assignment / Scope</strong></td>
      <td>Defines boundaries of your analysis</td>
      <td>Protects you from questions outside your scope at deposition</td>
    </tr>
    <tr>
      <td><strong>4. Materials Reviewed</strong></td>
      <td>Complete list of everything you considered</td>
      <td>FRCP 26(a)(2)(B)(ii) requires "facts or data considered." Include everything reviewed, even if not relied upon</td>
    </tr>
    <tr>
      <td><strong>5. Background / Facts</strong></td>
      <td>Neutral recitation of relevant facts</td>
      <td>Shows opinions rest on factual foundation, not invented assumptions</td>
    </tr>
    <tr>
      <td><strong>6. Analysis / Methodology</strong></td>
      <td>How you reached your conclusions</td>
      <td>Primary target of Daubert challenges. Document every analytical step</td>
    </tr>
    <tr>
      <td><strong>7. Opinions and Conclusions</strong></td>
      <td>Your numbered professional opinions</td>
      <td>Specific, clear, tied to issues. Each answers: "What do you believe and how confident are you?"</td>
    </tr>
    <tr>
      <td><strong>8. Basis for Opinions</strong></td>
      <td>The "why" behind each opinion</td>
      <td>Facts, data, methodology, and reasoning supporting each conclusion</td>
    </tr>
    <tr>
      <td><strong>9. Compensation Statement</strong></td>
      <td>Compensation for study and testimony</td>
      <td>Required by FRCP 26(a)(2)(B)(vi) in federal court</td>
    </tr>
    <tr>
      <td><strong>10. Signature Block</strong></td>
      <td>Expert signs the report</td>
      <td>Required by FRCP 26(a)(2)(B). Check local rules for additional requirements</td>
    </tr>
  </tbody>
</table>

<h2>Materials Reviewed Checklist</h2>
<div class="alert">The Materials Reviewed section is one of the most scrutinized parts of any expert report. Every document you considered must appear on the list.</div>
<div class="check-item">All documents reviewed are listed, including those not relied upon</div>
<div class="check-item">Materials are grouped by category (pleadings, transcripts, correspondence, records, standards)</div>
<div class="check-item">Each document is dated where possible</div>
<div class="check-item">Multiple versions of a document are listed separately</div>
<div class="check-item">No documents are listed that you did not actually read</div>
<div class="check-item">Significant omissions are addressed in the Assignment/Scope section</div>

<h2>Industry-Specific Section Emphasis</h2>
<table>
  <thead>
    <tr>
      <th>Industry</th>
      <th>Analysis Section Emphasis</th>
      <th>Common Materials</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Construction</strong></td>
      <td>Site inspection findings, testing results, code references, deficiency-by-deficiency breakdown</td>
      <td>Plans, specifications, change orders, daily logs, inspection reports, building codes, manufacturer instructions</td>
    </tr>
    <tr>
      <td><strong>Medical</strong></td>
      <td>Differential diagnosis showing how alternative causes were ruled out</td>
      <td>Medical records, imaging, lab results, published literature, clinical guidelines, pharmacy records</td>
    </tr>
    <tr>
      <td><strong>Financial</strong></td>
      <td>Valuation methodology (DCF, comparable transactions, market approach), assumptions, sensitivity analyses</td>
      <td>Financial statements, tax returns, contracts, market data, industry benchmarks, comparable databases</td>
    </tr>
    <tr>
      <td><strong>Technology</strong></td>
      <td>Chain of custody, forensic tools, step-by-step reproducible analytical procedures</td>
      <td>Forensic images, log files, network captures, chain of custody docs, tool validation reports</td>
    </tr>
  </tbody>
</table>

<h2>Federal vs. California Disclosure Requirements</h2>
<table>
  <thead>
    <tr>
      <th style="width:30%">Requirement</th>
      <th>Federal Court (FRCP 26(a)(2)(B))</th>
      <th>California State Court</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Written report</strong></td>
      <td>Required: full written report signed by expert</td>
      <td>CCP 2034.260: brief narrative summary signed by attorney. But the CCP 2034 framework allows demand for producible reports</td>
    </tr>
    <tr>
      <td><strong>Opinions and bases</strong></td>
      <td>Complete statement of all opinions and bases required</td>
      <td>General substance of expected testimony</td>
    </tr>
    <tr>
      <td><strong>Materials considered</strong></td>
      <td>All facts or data considered must be disclosed</td>
      <td>Discoverable upon demand</td>
    </tr>
    <tr>
      <td><strong>Prior testimony</strong></td>
      <td>Cases in preceding 4 years</td>
      <td>Not expressly required in initial exchange</td>
    </tr>
    <tr>
      <td><strong>Compensation</strong></td>
      <td>Required in report</td>
      <td>Discoverable upon inquiry</td>
    </tr>
    <tr>
      <td><strong>Practical result</strong></td>
      <td>Full report is mandatory</td>
      <td>Comprehensive reports are common practice despite lighter statutory requirement</td>
    </tr>
  </tbody>
</table>
`
);

// -- Resource 2: Opinion Writing Guide --
const resource2Html = () => htmlShell(
  'Opinion Writing Guide',
  `
<h1>Opinion Writing Guide</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Facts, assumptions, and opinions - clarity, specificity, and defensibility
</p>

<h2>The Three Categories</h2>
<div class="callout">
  A defensible report clearly distinguishes between facts, assumptions, and opinions. Blurring these categories is one of the most common report-writing errors and a primary target at deposition.
</div>
<table>
  <thead>
    <tr>
      <th style="width:18%">Category</th>
      <th>Definition</th>
      <th>Example</th>
      <th style="width:25%">Deposition Risk</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Fact</strong></td>
      <td>Information from the case record, from counsel, or from your own investigation</td>
      <td>"The roof was installed in March 2019 according to the contractor's daily log."</td>
      <td>If presented as fact but actually an assumption, credibility suffers</td>
    </tr>
    <tr>
      <td><strong>Assumption</strong></td>
      <td>Premise adopted for your analysis. Must be identified and justified</td>
      <td>"At the direction of retaining counsel, I assumed the repair scope includes only the south elevation."</td>
      <td>Undisclosed assumptions undermine the entire opinion chain</td>
    </tr>
    <tr>
      <td><strong>Opinion</strong></td>
      <td>Professional conclusion based on facts and assumptions, reached through methodology</td>
      <td>"It is my opinion, to a reasonable degree of engineering certainty, that the water intrusion was caused by defective flashing installation."</td>
      <td>Must be clearly distinguished from facts and assumptions</td>
    </tr>
  </tbody>
</table>

<h2>"Reasonable Degree of Certainty" Convention</h2>
<p>
  Expert opinions are commonly stated to a "reasonable degree of [professional] certainty" or
  "reasonable degree of [professional] probability." This is widely expected in most courts,
  though not a formal requirement of the Federal Rules of Evidence. Certain state courts, notably
  Pennsylvania, formally require this specific language. Always confirm the applicable
  jurisdiction's expectations with retaining counsel.
</p>
<table>
  <thead>
    <tr>
      <th>Discipline</th>
      <th>Typical Phrasing</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Engineering</td><td>"To a reasonable degree of engineering certainty..."</td></tr>
    <tr><td>Medical</td><td>"To a reasonable degree of medical certainty..."</td></tr>
    <tr><td>Financial / Accounting</td><td>"To a reasonable degree of accounting certainty..."</td></tr>
    <tr><td>Scientific</td><td>"To a reasonable degree of scientific certainty..."</td></tr>
  </tbody>
</table>

<h2>Hedge Words to Avoid</h2>
<div class="alert">Hedge words weaken opinions and invite challenge. Opposing counsel will highlight every hedge and argue you lack confidence in your own conclusions.</div>
<table>
  <thead>
    <tr>
      <th>Avoid</th>
      <th>Why It's Problematic</th>
      <th>Better Alternative</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"It is possible that..."</td>
      <td>Communicates uncertainty; not an opinion</td>
      <td>"It is my opinion that..." (with basis)</td>
    </tr>
    <tr>
      <td>"It could be..."</td>
      <td>Speculative; does not commit to a conclusion</td>
      <td>"Based on [methodology], [specific conclusion]"</td>
    </tr>
    <tr>
      <td>"Perhaps..."</td>
      <td>Undermines confidence in the analysis</td>
      <td>State the qualified opinion directly</td>
    </tr>
    <tr>
      <td>"It might..."</td>
      <td>Suggests the expert has not reached a conclusion</td>
      <td>"The evidence indicates..." (with basis)</td>
    </tr>
  </tbody>
</table>

<h2>Appropriate Qualification vs. Hedging</h2>
<p>Appropriate qualification is different from hedging. If a conclusion genuinely depends on a condition or range, state it explicitly:</p>
<ul>
  <li><strong>Hedge:</strong> "The repair cost could possibly be around $1.2 million."</li>
  <li><strong>Qualified opinion:</strong> "The repair cost is between $1.2 million and $1.5 million depending on the scope of concealed damage discovered during demolition."</li>
</ul>

<h2>Weak vs. Strong Opinions - Side by Side</h2>
<table>
  <thead>
    <tr>
      <th style="width:50%">Weak Opinion</th>
      <th style="width:50%">Strong Opinion</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"It is possible that the water intrusion was caused by defective flashing installation."</td>
      <td>"It is my opinion, to a reasonable degree of engineering certainty, that the water intrusion at the subject property was caused by defective installation of the roof-to-wall flashing, based on my site inspection, destructive testing, and review of the applicable building code requirements."</td>
    </tr>
    <tr>
      <td>"The damages could be around $5 million."</td>
      <td>"Based on my DCF analysis using the assumptions set forth in Section VI, total economic damages are $5.2 million, with a sensitivity range of $4.8 million to $5.6 million depending on the discount rate applied."</td>
    </tr>
    <tr>
      <td>"The cause of death may have been the medication."</td>
      <td>"It is my opinion, to a reasonable degree of medical certainty, that the administration of [medication] was a substantial contributing factor to the patient's death, based on my differential diagnosis analysis ruling out the alternative causes identified in Section V."</td>
    </tr>
  </tbody>
</table>

<h2>Numbering Best Practices</h2>
<div class="check-item">Number every opinion sequentially (Opinion 1, Opinion 2, etc.)</div>
<div class="check-item">Cross-reference each opinion to its supporting basis section</div>
<div class="check-item">Each opinion answers: "What do you believe, and how confident are you?"</div>
<div class="check-item">Opinions are specific enough to be useful but not so narrow they become brittle</div>
<div class="check-item">Number exhibits and appendices using a consistent scheme for easy reference</div>
`
);

// -- Resource 3: Methodology & Deposition Defense Checklist --
const resource3Html = () => htmlShell(
  'Methodology & Deposition Defense Checklist',
  `
<h1>Methodology &amp; Deposition Defense Checklist</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Document your methodology to survive Daubert challenges and prepare your report for deposition scrutiny
</p>

<h2>Daubert-Proof Methodology Documentation</h2>
<div class="callout">
  <strong>Key principle:</strong> Under Daubert, the court evaluates whether your methodology is reliable,
  not whether your conclusion is correct. A report that documents its methodology gives the retaining
  attorney the tools to defend your testimony at the gatekeeping stage.
</div>

<h3>For Every Opinion, Document:</h3>
<div class="check-item">The specific methodology or analytical framework you applied</div>
<div class="check-item">The data, materials, and sources you relied on</div>
<div class="check-item">Each analytical step from data to conclusion (the reader should be able to trace your path)</div>
<div class="check-item">Key assumptions, with justification for each</div>
<div class="check-item">Why this methodology is the appropriate choice for this question</div>
<div class="check-item">How the methodology is grounded in accepted practice (citations to peer-reviewed publications, standards, codes)</div>

<h3>"Showing Your Work" by Discipline</h3>
<table>
  <thead>
    <tr>
      <th>Discipline</th>
      <th>What to Document</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Engineering</strong></td>
      <td>Calculations, measurements, test results, FEA/modeling methodology, code references, software tools with version numbers</td>
    </tr>
    <tr>
      <td><strong>Medical</strong></td>
      <td>Differential diagnosis steps, clinical literature citations, how alternative causes were ruled out, dose-response analysis</td>
    </tr>
    <tr>
      <td><strong>Financial</strong></td>
      <td>Valuation methodology (DCF, comparable transactions, market approach), all assumptions with basis, sensitivity analyses</td>
    </tr>
    <tr>
      <td><strong>Technology</strong></td>
      <td>Chain of custody, forensic tool names/versions, step-by-step procedures reproducible independently, NIST/SWGDE references</td>
    </tr>
  </tbody>
</table>

<h2>Citation Standards</h2>
<div class="check-item">Cite peer-reviewed publications, industry standards, codes, and authoritative treatises</div>
<div class="check-item">Avoid non-peer-reviewed sources (blog posts, marketing materials, Wikipedia) as primary authority</div>
<div class="check-item">For every source you cite, be prepared to defend it at deposition</div>
<div class="check-item">Document the edition, version, or publication date of every standard or code referenced</div>

<h2>Data Gap Disclosure</h2>
<p>When data is incomplete, your report should transparently address the gap:</p>
<div class="check-item">Identify what information was unavailable</div>
<div class="check-item">Explain what impact (if any) the gap has on your analysis</div>
<div class="check-item">Describe any assumptions made to bridge the gap and justify each assumption</div>
<div class="check-item">If counsel provided assumptions, identify them as counsel-provided</div>

<hr class="divider" />

<h2>Pre-Deposition Report Review Checklist</h2>
<div class="alert">Your report is the script opposing counsel will use at deposition. Review it as if you are opposing counsel looking for weaknesses.</div>

<h3>Before Your Deposition:</h3>
<div class="check-item">Re-read the entire report, including appendices and exhibits</div>
<div class="check-item">Confirm every factual statement is traceable to a specific source</div>
<div class="check-item">Confirm every opinion is tied to a specific methodology</div>
<div class="check-item">Identify your weakest sentence - that is where opposing counsel will start</div>
<div class="check-item">Verify the Materials Reviewed list is complete and you can discuss every item on it</div>
<div class="check-item">Confirm all opinions are consistent with what you will say on the stand</div>
<div class="check-item">If opinions have changed since writing, issue a supplemental report before the deposition (FRCP 26(e))</div>

<h3>"Read as Opposing Counsel" Self-Review</h3>
<p>For every sentence in your report, ask:</p>
<div class="check-item">Can I defend this statement under cross-examination?</div>
<div class="check-item">Is there advocacy language that signals bias? (Words like "egregious," "clearly," "catastrophic")</div>
<div class="check-item">Is there a hedge word that undermines my confidence? ("possibly," "might," "could")</div>
<div class="check-item">Does this claim of fact have a documented source?</div>
<div class="check-item">Is there an undisclosed assumption?</div>
<div class="check-item">Could opposing counsel read this sentence back to me and make me uncomfortable?</div>

<h2>Supplemental Report Decision Tree</h2>
<table>
  <thead>
    <tr>
      <th>Situation</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Your opinion has changed based on new information</td>
      <td>Issue a supplemental report before deposition. FRCP 26(e) requires supplementation when disclosures become incomplete or incorrect.</td>
    </tr>
    <tr>
      <td>You discovered a typo or formatting error</td>
      <td>Correct in a supplemental report or errata. Minor corrections are routine and non-damaging.</td>
    </tr>
    <tr>
      <td>New documents were produced after your report</td>
      <td>Review them. If they affect your opinions, issue a supplemental report. If not, be prepared to explain at deposition why they do not change your conclusions.</td>
    </tr>
    <tr>
      <td>Retaining counsel asks you to change a conclusion</td>
      <td>Change only if your independent analysis supports the change. Never change a conclusion solely because counsel requested it.</td>
    </tr>
  </tbody>
</table>

<h2>Precision of Language Quick Reference</h2>
<table>
  <thead>
    <tr>
      <th>Phrase</th>
      <th>Implication</th>
      <th>Use When</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"I reviewed"</td>
      <td>Independent action; you sought out and examined the material</td>
      <td>You independently obtained or selected the material</td>
    </tr>
    <tr>
      <td>"I was provided with"</td>
      <td>Passive receipt; raises questions about what else you might have reviewed</td>
      <td>Counsel selected and provided the material to you</td>
    </tr>
    <tr>
      <td>"In my opinion"</td>
      <td>Committed professional conclusion</td>
      <td>Stating your expert opinion (preferred)</td>
    </tr>
    <tr>
      <td>"It appears"</td>
      <td>Observation short of an opinion</td>
      <td>Describing an observation, not a conclusion</td>
    </tr>
    <tr>
      <td>"Caused"</td>
      <td>Direct or sole causation</td>
      <td>Your analysis supports direct causation</td>
    </tr>
    <tr>
      <td>"Contributed to"</td>
      <td>Multiple contributing factors</td>
      <td>Your analysis identifies multiple causes</td>
    </tr>
    <tr>
      <td>"Consistent with"</td>
      <td>Correlation or compatibility, not causation</td>
      <td>Noting a pattern without asserting causation</td>
    </tr>
  </tbody>
</table>
`
);

// -- Resource 4: Full Module Summary --
const resource4Html = () => htmlShell(
  'Report Writing Module - Full Summary',
  `
<h1>Report Writing Module - Full Summary</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Condensed reference notes from all eight lessons - Writing an Expert Witness Testimony Report
</p>

<h2>Lesson 1: Purpose and Audience</h2>
<p>Your expert report has five audiences with competing interests:</p>
<ul>
  <li><strong>Retaining attorney:</strong> reads for strength and deposition/trial preparation</li>
  <li><strong>Opposing counsel:</strong> reads for weakness, vague opinions, and inconsistencies</li>
  <li><strong>Opposing expert:</strong> reads for methodological flaws and rebuttal opportunities</li>
  <li><strong>The judge:</strong> reads for admissibility under Daubert (federal) or Kelly/Sargon (California)</li>
  <li><strong>The jury:</strong> hears testimony based on the report</li>
</ul>
<p>
  <strong>Federal disclosure:</strong> FRCP 26(a)(2)(B) requires a full written report signed by the expert.
  <strong>California:</strong> CCP 2034.260 requires only a brief narrative summary, but the CCP 2034 framework
  allows demand for producible reports, so comprehensive reports are standard practice.
</p>

<h2>Lesson 2: Anatomy of a Strong Report</h2>
<p>Ten essential sections in order: (1) Caption/Title Page, (2) Qualifications Summary, (3) Assignment/Scope,
  (4) Materials Reviewed, (5) Background/Facts, (6) Analysis/Methodology, (7) Opinions and Conclusions,
  (8) Basis for Opinions, (9) Compensation Statement, (10) Signature Block.</p>
<div class="alert">Structure is not a formality; it is a defense. A well-structured report gives opposing counsel fewer angles of attack.</div>

<h2>Lesson 3: Writing Your Opinions</h2>
<ul>
  <li>State opinions to a "reasonable degree of [professional] certainty" - widely expected, not formally required by FRE, but required in some states (e.g., Pennsylvania)</li>
  <li>Clearly distinguish facts, assumptions, and opinions - blurring is a primary deposition target</li>
  <li>Number all opinions for easy reference</li>
  <li>Avoid hedge words ("might," "could," "possibly") - use appropriate qualification instead</li>
  <li>Each opinion should answer: "What do you believe, and how confident are you?"</li>
</ul>

<h2>Lesson 4: The Materials Reviewed Section</h2>
<ul>
  <li>Every document you considered must be listed - "considered" is broader than "relied upon" under FRCP 26(a)(2)(B)(ii)</li>
  <li>Group materials by category and date each document</li>
  <li>Opposing counsel will compare your list against the full discovery universe</li>
  <li>FRCP 26(b)(4)(C) protects most attorney-expert communications but carves out facts/data considered and assumptions relied on</li>
  <li>Confirm with retaining counsel how the list should be framed in the applicable jurisdiction</li>
</ul>

<h2>Lesson 5: Supporting Your Conclusions</h2>
<ul>
  <li>Under Daubert, courts evaluate methodology reliability, not conclusion correctness</li>
  <li>For every opinion, the reader should trace data to analytical steps to conclusion</li>
  <li>Cite peer-reviewed publications, standards, and authoritative treatises</li>
  <li>Address data gaps transparently - transparency strengthens credibility</li>
  <li>Distinguish counsel-provided facts from independent analysis (FRCP 26(b)(4)(C) carve-outs)</li>
</ul>

<h2>Lesson 6: Writing for Deposition Defense</h2>
<ul>
  <li>Every sentence will be read back to you under oath - ask "Can I defend this under cross?" before writing</li>
  <li>Word choice matters: "I reviewed" vs. "I was provided with," "caused" vs. "contributed to," "in my opinion" vs. "it appears"</li>
  <li>Preemptively address scope boundaries to handle "Did you consider...?" questions</li>
  <li>FRCP 26(e) requires supplementation when disclosures become incomplete or incorrect - issue supplemental reports before deposition, not after</li>
  <li>Under FRCP 30(e), substantive errata sheet changes draw intense scrutiny</li>
</ul>

<h2>Lesson 7: Formatting, Exhibits, and Presentation</h2>
<ul>
  <li>Consistent fonts, headers, spacing, margins throughout</li>
  <li>Number all opinions, exhibits, and appendices using a consistent scheme</li>
  <li>Every referenced image, chart, or table should be a numbered exhibit with a descriptive caption</li>
  <li>Exhibits must stand alone - a reader should understand what they depict without cross-referencing</li>
  <li>Appendices hold detailed calculations; the body tells the story with enough detail to follow the analytical path</li>
</ul>
<h3>Final Proofread Checklist</h3>
<div class="check-item">Case name, party names, and dates are consistent and correct</div>
<div class="check-item">All opinions are numbered and cross-referenced to their bases</div>
<div class="check-item">All exhibits are referenced in the body and vice versa</div>
<div class="check-item">Materials Reviewed list is complete</div>
<div class="check-item">No tracked changes, comments, or metadata remain</div>
<div class="check-item">Report is signed and dated</div>

<h2>Lesson 8: Common Pitfalls</h2>
<table>
  <thead>
    <tr>
      <th style="width:28%">Pitfall</th>
      <th>Risk</th>
      <th>Prevention</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Advocacy language</strong></td>
      <td>Signals bias; opposing counsel characterizes you as a hired gun</td>
      <td>Write in neutral, professional tone. Let analysis speak for itself</td>
    </tr>
    <tr>
      <td><strong>Overstating qualifications</strong></td>
      <td>Motion to exclude opinions outside your expertise</td>
      <td>Stay within education, training, and experience boundaries</td>
    </tr>
    <tr>
      <td><strong>Incomplete materials list</strong></td>
      <td>Credibility damage when omissions are discovered</td>
      <td>List everything considered, including materials not relied upon</td>
    </tr>
    <tr>
      <td><strong>Copy-pasting prior reports</strong></td>
      <td>Prior case details discovered by opposing counsel</td>
      <td>Draft substance fresh for each case; use templates for structure only</td>
    </tr>
    <tr>
      <td><strong>Report/testimony inconsistencies</strong></td>
      <td>Impeachment at trial</td>
      <td>Review report before deposition; issue supplemental reports for changed opinions</td>
    </tr>
    <tr>
      <td><strong>Ignoring unfavorable evidence</strong></td>
      <td>"Careless or biased" implication at deposition</td>
      <td>Address contrary evidence and explain why it does not change your conclusion</td>
    </tr>
    <tr>
      <td><strong>Draft circulation in state court</strong></td>
      <td>Drafts may be discoverable (FRCP 26(b)(4)(B) protects in federal court since Dec. 1, 2010, but state rules vary)</td>
      <td>Confirm draft protection with retaining counsel before circulating</td>
    </tr>
  </tbody>
</table>

<h2>Key Principles to Carry Forward</h2>
<ol>
  <li><strong>Know your audience.</strong> Five different readers with five different agendas. Write for all of them.</li>
  <li><strong>Structure is defense.</strong> The ten essential sections protect you from challenge.</li>
  <li><strong>Opinions must be clear and defensible.</strong> Answer "What do you believe, and how confident are you?"</li>
  <li><strong>List everything you considered.</strong> Omissions are discoverable and damaging.</li>
  <li><strong>Show your methodology.</strong> Daubert targets process, not conclusions.</li>
  <li><strong>Write for deposition.</strong> Every sentence will be read back to you under oath.</li>
  <li><strong>Presentation is credibility.</strong> A polished report signals a polished analysis.</li>
  <li><strong>Attention to detail is your best defense.</strong> Most successful challenges exploit preventable errors.</li>
</ol>
`
);

// -- Page component --

const RESOURCES = [
  {
    id: 'r1',
    title: 'Expert Report Structure Quick Reference Card',
    description:
      'The ten essential sections, materials reviewed checklist, industry-specific guidance, and federal vs. California disclosure requirements.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    generate: resource1Html,
  },
  {
    id: 'r2',
    title: 'Opinion Writing Guide',
    description:
      'Facts vs. assumptions vs. opinions, "reasonable degree of certainty" by discipline, hedge words to avoid, weak vs. strong opinion comparisons, and numbering best practices.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    generate: resource2Html,
  },
  {
    id: 'r3',
    title: 'Methodology & Deposition Defense Checklist',
    description:
      'Daubert-proof methodology documentation, citation standards, data gap disclosure, pre-deposition review checklist, "read as opposing counsel" self-review, and supplemental report decision tree.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    generate: resource3Html,
  },
  {
    id: 'r4',
    title: 'Report Writing Module - Full Summary',
    description:
      'Condensed reference notes from all eight lessons covering report structure, opinion writing, materials reviewed, methodology, deposition defense, formatting, and common pitfalls.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    generate: resource4Html,
  },
];

export default function ReportWritingResourcesPage() {
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
