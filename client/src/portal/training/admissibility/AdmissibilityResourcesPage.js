import React from 'react';
import { Link } from 'react-router-dom';

// ── Shared HTML shell ──────────────────────────────────────────────────────────
const htmlShell = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} — Veracity Expert Witness</title>
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
  .check-item::before { content: "☐"; flex-shrink: 0; color: #d36622; font-size: 16px;
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
  <small>Standards of Admissibility: Frye, Kelly, and Daubert</small>
</div>
<div class="page">${body}</div>
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`;

// ── Resource 1: Quick Reference Card ─────────────────────────────────────────
const resource1Html = () => htmlShell(
  'Frye vs. Kelly vs. Daubert Quick Reference Card',
  `
<h1>Frye vs. Kelly vs. Daubert — Quick Reference Card</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  All four professional disciplines: medical &amp; healthcare, engineering &amp; construction,
  finance &amp; accounting, digital forensics &amp; technology
</p>

<h2>Standards at a Glance</h2>
<table>
  <thead>
    <tr>
      <th style="min-width:110px">Dimension</th>
      <th>Frye (1923)</th>
      <th>Kelly/Frye — California (1976)</th>
      <th>Daubert (1993)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Origin case</strong></td>
      <td>Frye v. United States (D.C. Cir. 1923) — polygraph precursor excluded</td>
      <td>People v. Kelly (Cal. 1976) — voiceprint analysis</td>
      <td>Daubert v. Merrell Dow Pharmaceuticals (U.S. 1993)</td>
    </tr>
    <tr>
      <td><strong>Jurisdiction</strong></td>
      <td>A number of states retain Frye or a Frye-influenced standard, including Illinois, Pennsylvania, and Washington</td>
      <td>California state courts only</td>
      <td>Federal courts nationwide + majority of U.S. state courts (many apply Daubert or a Daubert-influenced standard); the dominant national framework</td>
    </tr>
    <tr>
      <td><strong>Scope of application</strong></td>
      <td>Generally applied to novel scientific techniques and methodologies</td>
      <td>Applies specifically to novel scientific techniques and methods; does not apply to all expert testimony</td>
      <td>Applies to all expert testimony — scientific, technical, and experience-based (per Kumho Tire, 1999)</td>
    </tr>
    <tr>
      <td><strong>Standard applied</strong></td>
      <td>General acceptance in the relevant professional community</td>
      <td>General acceptance + proper qualification + correct application (three-prong test)</td>
      <td>Reliability and relevance — non-exhaustive multi-factor analysis by the judge</td>
    </tr>
    <tr>
      <td><strong>Who decides</strong></td>
      <td>The relevant professional community</td>
      <td>The relevant professional community (for novel techniques); Sargon gatekeeping for speculative or analytically unsupported opinions more broadly</td>
      <td>The trial judge (active gatekeeper)</td>
    </tr>
    <tr>
      <td><strong>California applicability</strong></td>
      <td>Not the standard in California; Kelly/Frye applies instead for novel techniques</td>
      <td>Yes — California state courts only</td>
      <td>Not in California state court; applies in federal court and most other states</td>
    </tr>
  </tbody>
</table>

<h2>The Three Kelly Prongs (Checklist)</h2>
<div class="alert">Kelly applies to <strong>novel scientific techniques and methods</strong>. Standard professional opinions, clinical diagnoses, and experience-based analysis are not subject to Kelly/Frye unless they rest on a novel scientific technique.</div>
<div class="check-item">The technique is generally accepted in the relevant professional community</div>
<div class="check-item">The expert witness is properly qualified to apply that technique</div>
<div class="check-item">Correct procedures were used in the particular case</div>

<h2>The Five Daubert Factors (Non-Exhaustive Checklist)</h2>
<div class="alert">Courts may consider some or all of these factors depending on the case. This list is not exhaustive.</div>
<div class="check-item">Has the theory or technique been tested?</div>
<div class="check-item">Has it been subject to peer review and publication?</div>
<div class="check-item">What is the known or potential error rate?</div>
<div class="check-item">Are there standards and controls governing the technique?</div>
<div class="check-item">Is it generally accepted in the relevant professional community?</div>

<h2>Sargon Enterprises v. USC (Cal. 2012) — Plain Language Summary</h2>
<p>
  California trial courts have a gatekeeping duty to exclude expert opinions that are speculative,
  unsupported by the materials relied on, or rest on too great an analytical gap between data and
  conclusion. This gatekeeping authority applies across all expert testimony — beyond the
  Kelly/Frye novel-technique context. Sargon did not adopt Daubert and did not change California's
  retention of Kelly/Frye for novel scientific techniques. The practical effect: in California state
  court, an opinion can be excluded either (a) under Kelly/Frye for lack of general acceptance of
  a novel technique, or (b) under Sargon for being speculative or analytically unsupported.
</p>

<h2>Industry Application Examples</h2>
<table>
  <thead>
    <tr>
      <th>Industry</th>
      <th>Frye / Kelly Challenge (Novel Technique)</th>
      <th>Daubert Challenge (Federal / Most States)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Medical &amp; Healthcare</strong></td>
      <td>Novel diagnostic instrument or testing protocol not yet adopted by the clinical specialty</td>
      <td>Causation opinion without differential diagnosis methodology showing how alternative causes were ruled out</td>
    </tr>
    <tr>
      <td><strong>Engineering &amp; Construction</strong></td>
      <td>Proprietary structural analysis software developed by the expert but not independently validated or adopted by peers</td>
      <td>Failure analysis relying solely on engineer's judgment without testing, modeling, or peer-validated simulation</td>
    </tr>
    <tr>
      <td><strong>Finance &amp; Accounting</strong></td>
      <td>Proprietary damages model developed by the expert but not used or validated by forensic accounting or valuation practitioners</td>
      <td>Damages model without accepted valuation methodology — court scrutinizes basis for assumptions and projections</td>
    </tr>
    <tr>
      <td><strong>Digital Forensics &amp; Technology</strong></td>
      <td>Attribution methodology or analysis tool not recognized by NIST or the peer forensic community</td>
      <td>Evidence analysis using undocumented or non-repeatable procedures without recognized forensic standards</td>
    </tr>
  </tbody>
</table>
`
);

// ── Resource 2: California Expert Admissibility Checklist ─────────────────────
const resource2Html = () => htmlShell(
  'California Expert Admissibility Checklist',
  `
<h1>California Expert Admissibility Checklist</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  For expert witnesses across all industries testifying in California state court
</p>

<h2>Pre-Retention Checklist</h2>
<p>Before accepting a retention in a California state court matter, ask yourself:</p>
<div class="check-item">Is this California state court or federal court? (Kelly applies in CA state court; Daubert applies in federal court and most other states)</div>
<div class="check-item">Am I relying on any novel scientific technique, instrument, tool, or analytical method?</div>
<div class="check-item">If yes to above — has that technique been generally accepted in my professional community? Can I document it?</div>
<div class="check-item">Can I demonstrate that I am properly qualified to apply this specific technique?</div>
<div class="check-item">Did I follow the accepted, correct procedures for the technique in this case?</div>
<div class="check-item">Is my opinion free of speculation? Is it based on sufficient data, not an analytical leap?</div>
<div class="check-item">Would my opinion survive a Sargon challenge — is it analytically supported, not speculative?</div>

<div class="alert">
  <strong>Note on scope:</strong> If you are offering a standard professional opinion, clinical
  diagnosis, or experience-based analysis that does not rely on a novel scientific technique,
  Kelly/Frye does not apply to your testimony. However, a Sargon challenge for speculation or
  analytical gaps may still arise.
</div>

<h2>Kelly Challenge Preparation Guide</h2>
<p>
  If your testimony involves a novel scientific technique or methodology, prepare for a Kelly
  challenge by documenting the following <em>before</em> you accept the retention:
</p>
<div class="check-item">Peer-reviewed literature showing adoption of your methodology in the field — not just publication of your own work</div>
<div class="check-item">Usage data from practitioners in your field who apply this method</div>
<div class="check-item">Professional standards documents, guidelines, or recognized protocols that incorporate or endorse the technique</div>
<div class="check-item">Testimony or declarations from colleagues who use the methodology in their practice</div>
<div class="check-item">Absence of significant professional opposition to the technique in peer-reviewed literature</div>
<div class="check-item">Your own qualifications specifically as applied to this technique (training, prior use, publications)</div>
<div class="check-item">Documentation that you applied the technique correctly and followed accepted procedures in this case</div>

<hr class="divider" />

<h3>Industry-Specific Kelly Preparation Notes</h3>

<h2>Medical &amp; Healthcare</h2>
<ul>
  <li>Kelly/Frye applies when the technique is novel — e.g., a new diagnostic instrument, testing protocol, or clinical measurement tool not yet adopted by the specialty</li>
  <li>Standard clinical diagnoses, accepted imaging modalities, and peer-validated laboratory tests are <em>not</em> subject to Kelly/Frye; focus preparation on Sargon (analytical support) instead</li>
  <li>Document adoption within the relevant specialty (oncology, neurology, etc.) — not medicine generally</li>
  <li><strong>Red flags:</strong> proprietary diagnostic tools; tests not approved or endorsed by relevant professional bodies; novel biomarker analysis; methods used in research but not yet in clinical practice</li>
</ul>

<h2>Engineering &amp; Construction</h2>
<ul>
  <li>Kelly/Frye applies when the method is novel — e.g., proprietary simulation software, a unique testing protocol, or an unconventional failure analysis technique not validated by the engineering community</li>
  <li>Standard FEA software in common use, accepted structural analysis methods, and peer-validated testing protocols are not subject to Kelly/Frye</li>
  <li>Document adoption within the specific sub-discipline (structural, mechanical, civil, etc.)</li>
  <li><strong>Red flags:</strong> software developed by the expert; testing methods not documented in peer-reviewed literature; non-standard modeling assumptions without validation</li>
</ul>

<h2>Finance &amp; Accounting</h2>
<ul>
  <li>Kelly/Frye applies when the damages model or valuation tool is novel — e.g., a proprietary quantitative model developed by the expert that is not used by other forensic accountants or valuation professionals</li>
  <li>Accepted valuation methodologies (DCF, comparable transactions, market approach) are not subject to Kelly/Frye; focus preparation on Sargon (analytical support and basis for assumptions)</li>
  <li>Document that the methodology is recognized in forensic accounting or valuation professional practice</li>
  <li><strong>Red flags:</strong> expert-developed quantitative models not published or peer-validated; damages methodologies not recognized by the forensic accounting community; assumptions without documented basis</li>
</ul>

<h2>Digital Forensics &amp; Technology</h2>
<ul>
  <li>Kelly/Frye applies when the attribution method or analysis tool is novel — e.g., a technique not documented in NIST guidelines, not used by the forensic community, or developed without peer validation</li>
  <li>Accepted forensic analysis tools and procedures following NIST or recognized standards are not subject to Kelly/Frye</li>
  <li>Document recognition by NIST, SWGDE, or other authoritative forensic standards bodies</li>
  <li><strong>Red flags:</strong> attribution methodologies not recognized by NIST or peer forensic community; tools without documented, repeatable procedures; novel analysis techniques used only by the testifying expert</li>
</ul>
`
);

// ── Resource 3: Federal Court Daubert Preparation Guide ──────────────────────
const resource3Html = () => htmlShell(
  'Federal Court Daubert Preparation Guide',
  `
<h1>Federal Court Daubert Preparation Guide</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  For expert witnesses across all industries
</p>

<div class="callout">
  <strong>Jurisdiction note:</strong> Daubert applies in all federal courts and in the majority of
  U.S. state courts (many of which apply Daubert or a Daubert-influenced standard), making it the
  dominant national admissibility framework. Always confirm which standard applies in the specific
  jurisdiction before accepting a retention. <strong>California state courts apply Kelly, not
  Daubert.</strong> A number of other states, including Illinois, Pennsylvania, and Washington,
  retain Frye or Frye-influenced standards.
</div>

<h2>What a Daubert Hearing Is</h2>
<p>
  A Daubert hearing (sometimes called an evidentiary hearing or reliability hearing) is a
  pre-trial proceeding in which the judge evaluates whether a proposed expert's methodology meets
  the Daubert reliability standard. If your methodology is excluded at a Daubert hearing, that
  ruling is reviewed on appeal only for abuse of discretion — making reversals rare. Preparation
  before trial is essential.
</p>

<h2>The Daubert Factors: What Judges Look For</h2>
<p>Judges apply a non-exhaustive set of factors. For each, here is what you should be prepared to address:</p>
<table>
  <thead>
    <tr><th style="width:28%">Factor</th><th>What the judge evaluates</th><th>What you should document</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Testing</strong></td>
      <td>Has the theory or technique been empirically tested?</td>
      <td>Testing protocols, test results, independent validation studies</td>
    </tr>
    <tr>
      <td><strong>Peer review &amp; publication</strong></td>
      <td>Has it been subject to peer review and publication in recognized journals?</td>
      <td>Published papers, journal citations, peer reviewer feedback</td>
    </tr>
    <tr>
      <td><strong>Error rate</strong></td>
      <td>What is the known or potential error rate? Are there controls?</td>
      <td>Documented error rates, validation studies, sensitivity/specificity data (where applicable)</td>
    </tr>
    <tr>
      <td><strong>Standards and controls</strong></td>
      <td>Are there professional standards governing application of the technique?</td>
      <td>NIST guidelines, professional organization standards, SOPs used in this case</td>
    </tr>
    <tr>
      <td><strong>General acceptance</strong></td>
      <td>Is it generally accepted in the relevant professional community?</td>
      <td>Adoption data, professional community recognition, absence of significant opposition</td>
    </tr>
  </tbody>
</table>

<h2>How to Document Your Methodology Before Trial</h2>
<div class="check-item">Prepare a written methodology statement explaining how you reached your opinion, step by step</div>
<div class="check-item">List all data, materials, and sources you relied on — and document why each is the type reasonably relied on by experts in your field</div>
<div class="check-item">Identify the specific methodology or analytical framework you applied and its basis in peer-recognized practice</div>
<div class="check-item">Address each Daubert factor in your expert report proactively — don't wait for cross-examination</div>
<div class="check-item">Anticipate and document responses to the most likely challenges to your methodology</div>
<div class="check-item">Ensure your report reflects that your opinion is based on sufficient facts or data, not an unsupported assumption</div>

<hr class="divider" />

<h2>Field-Specific Daubert Guidance</h2>

<h3>Medical &amp; Healthcare</h3>
<ul>
  <li>Causation opinions must show differential diagnosis — how you systematically ruled out alternative causes, not just a conclusion</li>
  <li>Document the clinical literature supporting each step of your diagnostic reasoning</li>
  <li>Opinions based on novel or emerging research without peer-validated methodology are high-risk</li>
  <li><strong>Common exclusion patterns:</strong> "black box" causation opinions; reliance on studies not specifically addressing the causal mechanism at issue; failure to rule out alternative causes; dose-response not addressed</li>
</ul>

<h3>Engineering &amp; Construction</h3>
<ul>
  <li>Failure analysis must show testing, modeling, or peer-validated simulation — not only the engineer's professional judgment</li>
  <li>Document that your FEA or modeling methodology is consistent with accepted engineering practice</li>
  <li>Proprietary software must be validated; show it produces results consistent with established methods</li>
  <li><strong>Common exclusion patterns:</strong> untested hypotheses; failure to test the specific product or conditions at issue; modeling without validation; non-peer-reviewed simulation methods</li>
</ul>

<h3>Finance &amp; Accounting</h3>
<ul>
  <li>Damages models must show accepted valuation methodology — DCF, comparable transactions, market approach — with documented basis for every key assumption</li>
  <li>Speculative projections without reliable foundation are a primary exclusion risk</li>
  <li>The expert must be able to explain why their methodology is the appropriate choice for this damages question</li>
  <li><strong>Common exclusion patterns:</strong> assumptions without evidentiary support; novel methodology not used in the field; failure to address known alternative methodologies; speculative lost profits based on untested projections</li>
</ul>

<h3>Digital Forensics &amp; Technology</h3>
<ul>
  <li>Attribution and evidence analysis must follow documented, repeatable, peer-recognized procedures</li>
  <li>Document every step of your analysis in a manner that could be independently reproduced</li>
  <li>NIST and SWGDE standards are highly persuasive evidence of general acceptance and proper procedure</li>
  <li><strong>Common exclusion patterns:</strong> undocumented analysis methodology; failure to follow chain of custody or documented forensic procedures; attribution methods not recognized by the forensic community; expert conflating correlation with causation in network or malware analysis</li>
</ul>
`
);

// ── Resource 4: Full Module Summary ──────────────────────────────────────────
const resource4Html = () => htmlShell(
  'Admissibility Standards — Full Module Summary',
  `
<h1>Admissibility Standards — Full Module Summary</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Condensed reference notes from all three lessons · Standards of Admissibility: Frye, Kelly, and Daubert
</p>

<h2>Lesson 1: The Landscape of Admissibility Standards</h2>
<p>
  Courts serve as gatekeepers of expert testimony — their role is to protect juries from unreliable,
  speculative, or methodologically unsound expertise. Three primary admissibility frameworks govern
  expert testimony in U.S. courts:
</p>
<ul>
  <li><strong>Frye (1923):</strong> General acceptance in the relevant professional community. Retained
    by a number of states, including Illinois, Pennsylvania, and Washington.</li>
  <li><strong>Daubert (1993):</strong> The federal standard and the dominant national framework.
    Adopted by the majority of U.S. states. Trial judges evaluate methodology directly against a
    non-exhaustive set of reliability factors.</li>
  <li><strong>Kelly/Frye (1976):</strong> California's modified Frye standard. Applies specifically
    to novel scientific techniques in California state courts. A three-prong test.</li>
</ul>

<h3>Which Standard Applies Where</h3>
<ul>
  <li>Federal courts nationwide: <strong>Daubert</strong></li>
  <li>Majority of U.S. state courts: <strong>Daubert</strong> or a Daubert-influenced standard</li>
  <li>California state courts: <strong>Kelly</strong> — a significant exception</li>
  <li>A number of states including Illinois, Pennsylvania, and Washington: <strong>Frye</strong> or Frye-influenced</li>
</ul>
<div class="alert">
  <strong>Key rule:</strong> Always confirm the applicable standard for the specific jurisdiction
  before accepting a retention. The standard is determined by jurisdiction — not by judicial
  preference, case complexity, or the expert's industry.
</div>

<h2>Lesson 2: Frye &amp; Kelly — General Acceptance in California</h2>

<h3>Frye v. United States (1923)</h3>
<p>
  Established the general acceptance standard: expert testimony based on a novel methodology is
  admissible only if the methodology is generally accepted by the relevant professional community —
  not merely endorsed by the testifying expert. "General acceptance" means practitioners in the
  relevant field have embraced the methodology as reliable.
</p>
<p>
  The relevant community is defined by discipline: the clinical specialty (medical), the engineering
  sub-discipline, forensic accounting or valuation peer practice (finance), or the recognized
  forensic community with reference to standards such as NIST (digital forensics).
</p>

<h3>People v. Kelly (1976) — The Three-Prong Test</h3>
<p>
  California's Kelly test applies specifically to novel scientific techniques and methods. To admit
  expert testimony based on a novel technique in California state court, all three prongs must be met:
</p>
<ol>
  <li>The technique is generally accepted in the relevant professional community</li>
  <li>The witness is properly qualified as an expert on that technique</li>
  <li>Correct procedures were used in the particular case</li>
</ol>

<h3>Scope Limitation — Critical for All Four Disciplines</h3>
<p>
  Kelly/Frye applies only to novel scientific techniques and methods — new instruments, tools, or
  processes offered as the basis for expert opinion. It does <em>not</em> apply to all expert
  testimony. Standard professional opinions, clinical diagnoses, and experience-based analysis are
  not subject to Kelly/Frye unless they rest on a novel scientific technique.
</p>
<p>
  Practical implication: a physician's standard differential diagnosis, an engineer's accepted
  structural analysis, a forensic accountant's peer-validated damages methodology, and a
  cybersecurity analyst's recognized forensic procedure are all experience-based opinions that
  Kelly/Frye does not govern. However, any of these could face a Sargon challenge if the opinion
  is speculative or analytically unsupported.
</p>

<h3>Sargon Enterprises v. USC (2012)</h3>
<p>
  California trial judges have a broad gatekeeping duty: they must exclude opinions that are
  speculative, unsupported by the materials relied on, or rest on too great an analytical gap
  between data and conclusion. Sargon did not adopt Daubert and did not change California's Kelly
  standard. But it reinforced that California courts are active gatekeepers across all expert
  testimony, not only novel-technique cases.
</p>

<h2>Lesson 3: Daubert — The Federal Standard &amp; Multi-Industry Application</h2>

<h3>Daubert v. Merrell Dow Pharmaceuticals (1993)</h3>
<p>
  Replaced Frye in federal courts. The trial judge — not the professional community — serves as
  the active gatekeeper, evaluating methodology directly. Since 1993, the majority of U.S. states
  have adopted Daubert or a Daubert-influenced standard.
</p>
<p>
  <strong>Kumho Tire v. Carmichael (1999):</strong> Extended Daubert to all expert testimony —
  not only hard science. Engineering, accounting, and digital forensics experts are equally
  subject to Daubert scrutiny. Experience-based testimony is not exempt.
</p>
<p>
  <strong>General Electric v. Joiner (1997):</strong> Appellate courts review Daubert exclusions
  for abuse of discretion — a deferential standard. Exclusions are difficult to overturn.
</p>

<h3>The Daubert Factors (Non-Exhaustive)</h3>
<ol>
  <li>Has the theory or technique been tested?</li>
  <li>Has it been subject to peer review and publication?</li>
  <li>What is the known or potential error rate?</li>
  <li>Are there standards and controls governing the technique?</li>
  <li>Is it generally accepted in the relevant professional community?</li>
</ol>

<h3>Kelly vs. Daubert — Key Distinctions</h3>
<table>
  <thead>
    <tr><th>Dimension</th><th>Kelly (California)</th><th>Daubert (Federal / Most States)</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>Jurisdiction</td>
      <td>California state courts only</td>
      <td>Federal courts + majority of U.S. state courts</td>
    </tr>
    <tr>
      <td>Scope</td>
      <td>Novel scientific techniques and methods only</td>
      <td>All expert testimony (per Kumho Tire)</td>
    </tr>
    <tr>
      <td>Primary question</td>
      <td>Is the methodology generally accepted in the relevant community?</td>
      <td>Is the methodology reliable, tested, and based on sufficient facts and data?</td>
    </tr>
    <tr>
      <td>Burden on expert</td>
      <td>Show community acceptance of the novel methodology</td>
      <td>Show reliability under the judge's assessment of the Daubert factors</td>
    </tr>
    <tr>
      <td>Practical takeaway</td>
      <td>Your professional community is the gatekeeper for novel techniques</td>
      <td>The judge is the gatekeeper for all expert testimony</td>
    </tr>
  </tbody>
</table>

<h2>Key Principles to Carry Forward</h2>
<ol>
  <li><strong>Know your jurisdiction before you accept a retention.</strong> California state court = Kelly for novel techniques. Federal court and most other states = Daubert for all testimony.</li>
  <li><strong>Publication is not acceptance.</strong> Under Kelly, general acceptance requires that your professional community has adopted the method — not just that you authored it.</li>
  <li><strong>Daubert scrutinizes your process, not just your conclusion.</strong> How you got to your opinion matters as much as the opinion itself.</li>
  <li><strong>Kelly/Frye is not the only California risk.</strong> Sargon gives California judges broad authority to exclude speculative or analytically unsupported opinions — beyond the novel-technique context.</li>
  <li><strong>Non-scientific experts are not exempt from Daubert.</strong> After Kumho Tire, engineers, accountants, and forensic technology experts face the same scrutiny as scientific witnesses in federal and most state courts.</li>
</ol>
`
);

// ── Page component ────────────────────────────────────────────────────────────

const RESOURCES = [
  {
    id: 'r1',
    title: 'Frye vs. Kelly vs. Daubert Quick Reference Card',
    description:
      'Side-by-side comparison table, Kelly three-prong checklist, Daubert five-factor checklist, Sargon summary, and industry application examples across all four disciplines.',
    generate: resource1Html,
  },
  {
    id: 'r2',
    title: 'California Expert Admissibility Checklist',
    description:
      'Pre-retention checklist, Kelly challenge preparation guide with industry-specific notes, and red flags by discipline for California state court testimony.',
    generate: resource2Html,
  },
  {
    id: 'r3',
    title: 'Federal Court Daubert Preparation Guide',
    description:
      'Daubert hearing overview, what federal judges look for, methodology documentation guide, and common exclusion patterns — with field-specific guidance for all four industries.',
    generate: resource3Html,
  },
  {
    id: 'r4',
    title: 'Admissibility Standards — Full Module Summary',
    description:
      'Condensed reference notes from all three lessons covering Frye, Kelly, and Daubert — including jurisdiction rules, Kelly scope limitations, Sargon, and multi-industry application.',
    generate: resource4Html,
  },
];

export default function AdmissibilityResourcesPage() {
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
          Standards of Admissibility: Frye, Kelly, and Daubert &mdash; 4 reference guides
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
              Open Resource →
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link to="/training/admissibility" className="btn btn--secondary">
          ← Back to Training Home
        </Link>
        <Link to="/training" className="btn btn--secondary">
          All Training Modules
        </Link>
      </div>
    </div>
  );
}
