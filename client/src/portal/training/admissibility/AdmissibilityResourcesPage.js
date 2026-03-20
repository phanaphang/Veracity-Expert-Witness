import React from 'react';
import { Link } from 'react-router-dom';
import TrainingDisclaimer from '../../components/TrainingDisclaimer';
// ── Shared HTML shell ──────────────────────────────────────────────────────────
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
      <div class="tag">Standards of Admissibility: Frye, Kelly, and Daubert</div>
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

// ── Resource 1: Quick Reference Card ─────────────────────────────────────────
const resource1Html = () => htmlShell(
  'Frye vs. Kelly vs. Daubert Quick Reference Card',
  `
<h1>Frye vs. Kelly vs. Daubert - Quick Reference Card</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  All eight professional disciplines: medical &amp; healthcare, engineering &amp; construction,
  finance &amp; accounting, digital forensics &amp; technology, environmental science,
  intellectual property, accident reconstruction, forensic analysis
</p>

<h2>Standards at a Glance</h2>
<table>
  <thead>
    <tr>
      <th style="min-width:110px">Dimension</th>
      <th>Frye (1923)</th>
      <th>Kelly/Frye - California (1976)</th>
      <th>Daubert (1993)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Origin case</strong></td>
      <td>Frye v. United States (D.C. Cir. 1923) - polygraph precursor excluded</td>
      <td>People v. Kelly (Cal. 1976) - voiceprint analysis</td>
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
      <td>Applies to all expert testimony - scientific, technical, and experience-based (per Kumho Tire, 1999)</td>
    </tr>
    <tr>
      <td><strong>Standard applied</strong></td>
      <td>General acceptance in the relevant professional community</td>
      <td>General acceptance + proper qualification + correct application (three-prong test)</td>
      <td>Reliability and relevance - non-exhaustive multi-factor analysis by the judge</td>
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
      <td>Yes - California state courts only</td>
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

<h2>Sargon Enterprises v. USC (Cal. 2012) - Plain Language Summary</h2>
<p>
  California trial courts have a gatekeeping duty to exclude expert opinions that are speculative,
  unsupported by the materials relied on, or rest on too great an analytical gap between data and
  conclusion. This gatekeeping authority applies across all expert testimony - beyond the
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
      <td>Damages model without accepted valuation methodology - court scrutinizes basis for assumptions and projections</td>
    </tr>
    <tr>
      <td><strong>Digital Forensics &amp; Technology</strong></td>
      <td>Attribution methodology or analysis tool not recognized by NIST or the peer forensic community</td>
      <td>Evidence analysis using undocumented or non-repeatable procedures without recognized forensic standards</td>
    </tr>
    <tr>
      <td><strong>Environmental Science</strong></td>
      <td>Novel contaminant fate-and-transport model or sampling protocol not yet adopted by environmental scientists in the applicable sub-discipline</td>
      <td>Exposure or causation opinion without documented dose-response methodology; transport models not validated against field data</td>
    </tr>
    <tr>
      <td><strong>Intellectual Property</strong></td>
      <td>Proprietary damages methodology or valuation model not used by IP valuation practitioners (note: IP damages are economic opinions - the primary California risk is typically Sargon rather than Kelly, unless the methodology depends on a novel scientific or computational technique)</td>
      <td>Damages opinion without accepted valuation framework (e.g., Georgia-Pacific factors); proprietary models without peer validation; speculative assumptions</td>
    </tr>
    <tr>
      <td><strong>Accident Reconstruction</strong></td>
      <td>Proprietary crash simulation or dynamics software not independently validated or adopted by the reconstruction community</td>
      <td>Opinion based solely on visual assessment without documented measurements, testing, or peer-validated analytical methods</td>
    </tr>
    <tr>
      <td><strong>Forensic Analysis</strong></td>
      <td>Novel evidence interpretation technique - such as a pattern-matching method or identification procedure - not recognized by the relevant forensic science community or OSAC/NIST standards</td>
      <td>Evidence analysis without documented, repeatable procedures or validated error rates; techniques lacking scientific validation per 2009 NAS and 2016 PCAST reports</td>
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
<div class="check-item">If yes to above - has that technique been generally accepted in my professional community? Can I document it?</div>
<div class="check-item">Can I demonstrate that I am properly qualified to apply this specific technique?</div>
<div class="check-item">Did I follow the accepted, correct procedures for the technique in this case?</div>
<div class="check-item">Is my opinion free of speculation? Is it based on sufficient data, not an analytical leap?</div>
<div class="check-item">Would my opinion survive a Sargon challenge - is it analytically supported, not speculative?</div>

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
<div class="check-item">Peer-reviewed literature showing adoption of your methodology in the field - not just publication of your own work</div>
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
  <li>Kelly/Frye applies when the technique is novel - e.g., a new diagnostic instrument, testing protocol, or clinical measurement tool not yet adopted by the specialty</li>
  <li>Standard clinical diagnoses, accepted imaging modalities, and peer-validated laboratory tests are <em>not</em> subject to Kelly/Frye; focus preparation on Sargon (analytical support) instead</li>
  <li>Document adoption within the relevant specialty (oncology, neurology, etc.) - not medicine generally</li>
  <li><strong>Red flags:</strong> proprietary diagnostic tools; tests not approved or endorsed by relevant professional bodies; novel biomarker analysis; methods used in research but not yet in clinical practice</li>
</ul>

<h2>Engineering &amp; Construction</h2>
<ul>
  <li>Kelly/Frye applies when the method is novel - e.g., proprietary simulation software, a unique testing protocol, or an unconventional failure analysis technique not validated by the engineering community</li>
  <li>Standard FEA software in common use, accepted structural analysis methods, and peer-validated testing protocols are not subject to Kelly/Frye</li>
  <li>Document adoption within the specific sub-discipline (structural, mechanical, civil, etc.)</li>
  <li><strong>Red flags:</strong> software developed by the expert; testing methods not documented in peer-reviewed literature; non-standard modeling assumptions without validation</li>
</ul>

<h2>Finance &amp; Accounting</h2>
<ul>
  <li>Kelly/Frye applies when the damages model or valuation tool is novel - e.g., a proprietary quantitative model developed by the expert that is not used by other forensic accountants or valuation professionals</li>
  <li>Accepted valuation methodologies (DCF, comparable transactions, market approach) are not subject to Kelly/Frye; focus preparation on Sargon (analytical support and basis for assumptions)</li>
  <li>Document that the methodology is recognized in forensic accounting or valuation professional practice</li>
  <li><strong>Red flags:</strong> expert-developed quantitative models not published or peer-validated; damages methodologies not recognized by the forensic accounting community; assumptions without documented basis</li>
</ul>

<h2>Digital Forensics &amp; Technology</h2>
<ul>
  <li>Kelly/Frye applies when the attribution method or analysis tool is novel - e.g., a technique not documented in NIST guidelines, not used by the forensic community, or developed without peer validation</li>
  <li>Accepted forensic analysis tools and procedures following NIST or recognized standards are not subject to Kelly/Frye</li>
  <li>Document recognition by NIST, SWGDE, or other authoritative forensic standards bodies</li>
  <li><strong>Red flags:</strong> attribution methodologies not recognized by NIST or peer forensic community; tools without documented, repeatable procedures; novel analysis techniques used only by the testifying expert</li>
</ul>

<h2>Environmental Science</h2>
<ul>
  <li>Kelly/Frye applies when the technique is novel - e.g., a novel contaminant fate-and-transport model or sampling protocol not yet adopted by environmental scientists in the applicable sub-discipline</li>
  <li>Standard EPA-approved methodologies and accepted environmental protocols are <em>not</em> subject to Kelly/Frye; focus preparation on Sargon (analytical support) instead</li>
  <li>Document adoption within the relevant sub-discipline (toxicology, hydrogeology, environmental engineering, etc.) with reference to EPA-approved methodologies and ASTM environmental standards</li>
  <li><strong>Red flags:</strong> proprietary sampling devices; unvalidated transport or dispersion models; no dose-response methodology; novel modeling assumptions without field calibration</li>
</ul>

<h2>Intellectual Property</h2>
<ul>
  <li>IP damages are economic opinions - the primary California risk is typically <strong>Sargon</strong> (speculative or analytically unsupported opinions) rather than Kelly, unless the methodology depends on a novel scientific or computational technique</li>
  <li>Standard valuation frameworks (e.g., Georgia-Pacific factors for reasonable royalties, comparable licensing analysis) are <em>not</em> subject to Kelly/Frye</li>
  <li>Document that the methodology is recognized by IP economists, licensing professionals, forensic accountants, and patent valuation practitioners</li>
  <li><strong>Red flags:</strong> proprietary royalty models without peer validation; speculative lost-profits projections; no Georgia-Pacific framework or accepted valuation basis; untested assumptions about market share or growth</li>
</ul>

<h2>Accident Reconstruction</h2>
<ul>
  <li>Kelly/Frye applies when the technique is novel - e.g., proprietary crash simulation or dynamics software not independently validated or adopted by the reconstruction community</li>
  <li>Standard physics-based analysis, documented measurements, and peer-validated analytical methods are <em>not</em> subject to Kelly/Frye</li>
  <li>Document adoption by ACTAR-accredited reconstructionists and vehicle dynamics engineers, with reference to SAE International standards</li>
  <li><strong>Red flags:</strong> unvalidated simulation software; no scene visit or independent measurements; visual-only speed estimates without quantitative analysis; proprietary methods used only by the testifying expert</li>
</ul>

<h2>Forensic Analysis</h2>
<ul>
  <li>Kelly/Frye applies when the technique is novel - e.g., a novel evidence interpretation technique, pattern-matching method, or forensic identification procedure not recognized by the relevant forensic science community or OSAC/NIST standards</li>
  <li>Validated OSAC/NIST protocols and accepted forensic procedures are <em>not</em> subject to Kelly/Frye</li>
  <li>Document recognition within the relevant forensic science sub-discipline (forensic biology, trace evidence, questioned documents, latent prints, etc.) with reference to OSAC/NIST standards and ASTM</li>
  <li><strong>Red flags:</strong> expert-only techniques not used by the broader forensic community; no validated error rates; undocumented procedures; techniques criticized in the 2009 NAS or 2016 PCAST reports</li>
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
  ruling is reviewed on appeal only for abuse of discretion - making reversals rare. Preparation
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
<div class="check-item">List all data, materials, and sources you relied on - and document why each is the type reasonably relied on by experts in your field</div>
<div class="check-item">Identify the specific methodology or analytical framework you applied and its basis in peer-recognized practice</div>
<div class="check-item">Address each Daubert factor in your expert report proactively - don't wait for cross-examination</div>
<div class="check-item">Anticipate and document responses to the most likely challenges to your methodology</div>
<div class="check-item">Ensure your report reflects that your opinion is based on sufficient facts or data, not an unsupported assumption</div>

<hr class="divider" />

<h2>Field-Specific Daubert Guidance</h2>

<h3>Medical &amp; Healthcare</h3>
<ul>
  <li>Causation opinions must show differential diagnosis - how you systematically ruled out alternative causes, not just a conclusion</li>
  <li>Document the clinical literature supporting each step of your diagnostic reasoning</li>
  <li>Opinions based on novel or emerging research without peer-validated methodology are high-risk</li>
  <li><strong>Common exclusion patterns:</strong> "black box" causation opinions; reliance on studies not specifically addressing the causal mechanism at issue; failure to rule out alternative causes; dose-response not addressed</li>
</ul>

<h3>Engineering &amp; Construction</h3>
<ul>
  <li>Failure analysis must show testing, modeling, or peer-validated simulation - not only the engineer's professional judgment</li>
  <li>Document that your FEA or modeling methodology is consistent with accepted engineering practice</li>
  <li>Proprietary software must be validated; show it produces results consistent with established methods</li>
  <li><strong>Common exclusion patterns:</strong> untested hypotheses; failure to test the specific product or conditions at issue; modeling without validation; non-peer-reviewed simulation methods</li>
</ul>

<h3>Finance &amp; Accounting</h3>
<ul>
  <li>Damages models must show accepted valuation methodology - DCF, comparable transactions, market approach - with documented basis for every key assumption</li>
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

<h3>Environmental Science</h3>
<ul>
  <li>Exposure or causation opinions must show documented dose-response methodology - the court examines whether transport or dispersion models have been tested and validated against field data</li>
  <li>Document that your modeling parameters are grounded in peer-reviewed data and accepted environmental science practice</li>
  <li>EPA-approved methodologies and ASTM environmental standards are strong evidence of reliability</li>
  <li><strong>Common exclusion patterns:</strong> no dose-response analysis; unsupported model parameters without field calibration; transport models not validated against actual site data; novel sampling protocols without peer recognition</li>
</ul>

<h3>Intellectual Property</h3>
<ul>
  <li>Damages opinions must apply accepted valuation frameworks (e.g., Georgia-Pacific factors for reasonable royalties) with documented basis for every key assumption</li>
  <li>Speculative lost-profits projections without reliable foundation are a primary exclusion risk</li>
  <li>The expert must explain why their chosen methodology is the appropriate framework for the specific IP damages question</li>
  <li><strong>Common exclusion patterns:</strong> untested assumptions about market share or licensing rates; novel valuation models not used in the IP valuation community; speculative lost profits based on unvalidated projections; failure to apply Georgia-Pacific or comparable accepted framework</li>
</ul>

<h3>Accident Reconstruction</h3>
<ul>
  <li>Opinions must be supported by documented measurements, testing, or peer-validated analytical methods - relying solely on visual assessment is insufficient</li>
  <li>Document that your analysis follows SAE International standards and accepted reconstruction methodology</li>
  <li>Simulation software must be validated; show it produces results consistent with established physics-based methods</li>
  <li><strong>Common exclusion patterns:</strong> no independent measurements or scene documentation; ipse dixit reasoning without quantitative support; unvalidated simulation software; speed estimates based solely on visual assessment</li>
</ul>

<h3>Forensic Analysis</h3>
<ul>
  <li>Evidence analysis must follow documented, repeatable procedures with validated error rates - techniques lacking scientific validation face heightened scrutiny</li>
  <li>Document every step of your analysis in a manner that could be independently reproduced, with reference to OSAC/NIST standards</li>
  <li>The 2009 NAS and 2016 PCAST reports have influenced judicial scrutiny of pattern-matching and identification disciplines</li>
  <li><strong>Common exclusion patterns:</strong> no validated error rates; undocumented methodology; techniques not recognized by OSAC/NIST or the relevant forensic science community; expert-only methods without independent validation</li>
</ul>
`
);

// ── Resource 4: Full Module Summary ──────────────────────────────────────────
const resource4Html = () => htmlShell(
  'Admissibility Standards - Full Module Summary',
  `
<h1>Admissibility Standards - Full Module Summary</h1>
<p style="color:#555;font-family:Arial,sans-serif;font-size:13px;">
  Condensed reference notes from all three lessons · Standards of Admissibility: Frye, Kelly, and Daubert
</p>

<h2>Lesson 1: The Landscape of Admissibility Standards</h2>
<p>
  Courts serve as gatekeepers of expert testimony - their role is to protect juries from unreliable,
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
  <li>California state courts: <strong>Kelly</strong> - a significant exception</li>
  <li>A number of states including Illinois, Pennsylvania, and Washington: <strong>Frye</strong> or Frye-influenced</li>
</ul>
<div class="alert">
  <strong>Key rule:</strong> Always confirm the applicable standard for the specific jurisdiction
  before accepting a retention. The standard is determined by jurisdiction - not by judicial
  preference, case complexity, or the expert's industry.
</div>

<h2>Lesson 2: Frye &amp; Kelly - General Acceptance in California</h2>

<h3>Frye v. United States (1923)</h3>
<p>
  Established the general acceptance standard: expert testimony based on a novel methodology is
  admissible only if the methodology is generally accepted by the relevant professional community -
  not merely endorsed by the testifying expert. "General acceptance" means practitioners in the
  relevant field have embraced the methodology as reliable.
</p>
<p>
  The relevant community is defined by discipline: the clinical specialty (medical), the engineering
  sub-discipline, forensic accounting or valuation peer practice (finance), or the recognized
  forensic community with reference to standards such as NIST (digital forensics).
</p>

<h3>People v. Kelly (1976) - The Three-Prong Test</h3>
<p>
  California's Kelly test applies specifically to novel scientific techniques and methods. To admit
  expert testimony based on a novel technique in California state court, all three prongs must be met:
</p>
<ol>
  <li>The technique is generally accepted in the relevant professional community</li>
  <li>The witness is properly qualified as an expert on that technique</li>
  <li>Correct procedures were used in the particular case</li>
</ol>

<h3>Scope Limitation - Critical for All Disciplines</h3>
<p>
  Kelly/Frye applies only to novel scientific techniques and methods - new instruments, tools, or
  processes offered as the basis for expert opinion. It does <em>not</em> apply to all expert
  testimony. Standard professional opinions, clinical diagnoses, and experience-based analysis are
  not subject to Kelly/Frye unless they rest on a novel scientific technique.
</p>
<p>
  Practical implication: a physician's standard differential diagnosis, an engineer's accepted
  structural analysis, a forensic accountant's peer-validated damages methodology, a
  cybersecurity analyst's recognized forensic procedure, an environmental scientist applying
  accepted EPA protocols, an IP damages expert using established valuation frameworks, an
  accident reconstructionist applying standard physics and documented measurements, and a
  forensic analyst following validated OSAC/NIST protocols are all experience-based opinions that
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

<h2>Lesson 3: Daubert - The Federal Standard &amp; Multi-Industry Application</h2>

<h3>Daubert v. Merrell Dow Pharmaceuticals (1993)</h3>
<p>
  Replaced Frye in federal courts. The trial judge - not the professional community - serves as
  the active gatekeeper, evaluating methodology directly. Since 1993, the majority of U.S. states
  have adopted Daubert or a Daubert-influenced standard.
</p>
<p>
  <strong>Kumho Tire v. Carmichael (1999):</strong> Extended Daubert to all expert testimony -
  not only hard science. Engineering, accounting, and digital forensics experts are equally
  subject to Daubert scrutiny. Experience-based testimony is not exempt.
</p>
<p>
  <strong>General Electric v. Joiner (1997):</strong> Appellate courts review Daubert exclusions
  for abuse of discretion - a deferential standard. Exclusions are difficult to overturn.
</p>

<h3>The Daubert Factors (Non-Exhaustive)</h3>
<ol>
  <li>Has the theory or technique been tested?</li>
  <li>Has it been subject to peer review and publication?</li>
  <li>What is the known or potential error rate?</li>
  <li>Are there standards and controls governing the technique?</li>
  <li>Is it generally accepted in the relevant professional community?</li>
</ol>

<h3>Kelly vs. Daubert - Key Distinctions</h3>
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
  <li><strong>Publication is not acceptance.</strong> Under Kelly, general acceptance requires that your professional community has adopted the method - not just that you authored it.</li>
  <li><strong>Daubert scrutinizes your process, not just your conclusion.</strong> How you got to your opinion matters as much as the opinion itself.</li>
  <li><strong>Kelly/Frye is not the only California risk.</strong> Sargon gives California judges broad authority to exclude speculative or analytically unsupported opinions - beyond the novel-technique context.</li>
  <li><strong>Non-scientific experts are not exempt from Daubert.</strong> After Kumho Tire, engineers, accountants, and forensic technology experts face the same scrutiny as scientific witnesses in federal and most state courts.</li>
</ol>
`
);

// ── Resource 5: State-by-State Admissibility Standards ────────────────────────
const resource5Html = () => htmlShell(
  'State-by-State Admissibility Standards',
  `
<h1>State-by-State Admissibility Standards</h1>
<div class="subtitle">Which states use Daubert, Frye, or their own standard</div>

<div class="alert">This reference reflects the dominant standard in each jurisdiction as of 2025. Some states have modified or hybrid approaches. <strong>Always confirm the current standard before accepting a retention</strong> - legislatures and courts can change the applicable test.</div>

<h2>Daubert States (39 States + D.C. + Federal Courts + Territories)</h2>
<p>These jurisdictions have adopted the Daubert framework (or a substantially similar reliability-based standard) for evaluating expert testimony admissibility.</p>
<table>
  <thead><tr><th>State</th><th>Adoption</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><strong>Federal Courts</strong></td><td>1993 (Daubert); codified FRE 702</td><td>Applies in all federal districts nationwide. Amended 2023 to clarify preponderance standard.</td></tr>
    <tr><td><strong>Alaska</strong></td><td>State v. Coon (1999)</td><td>Adopted Daubert factors.</td></tr>
    <tr><td><strong>Arizona</strong></td><td>Ariz. R. Evid. 702 amendment (effective Jan. 1, 2012)</td><td>Adopted Daubert reliability framework via court rule amendment. (Note: Logerquist v. McVey (2000) had rejected Daubert.)</td></tr>
    <tr><td><strong>Arkansas</strong></td><td>Farm Bureau Mut. Ins. v. Foote (2001)</td><td>Legislatively adopted via Ark. R. Evid. 702.</td></tr>
    <tr><td><strong>Colorado</strong></td><td>People v. Shreck (2001)</td><td>CRE 702 - applies Daubert-like reliability analysis.</td></tr>
    <tr><td><strong>Connecticut</strong></td><td>State v. Porter (2007)</td><td>Adopted Daubert, replacing prior general acceptance approach.</td></tr>
    <tr><td><strong>Delaware</strong></td><td>M.G. Bancorporation v. Le Beau (1999)</td><td>DRE 702 follows Daubert.</td></tr>
    <tr><td><strong>Florida</strong></td><td>2013 legislation (Fla. Stat. § 90.702)</td><td>Legislatively adopted Daubert, effective 2013. Florida Supreme Court adopted Daubert as court rule in 2019, reversing its prior refusal to adopt the legislative amendments.</td></tr>
    <tr><td><strong>Georgia</strong></td><td>HB 24 (enacted 2011), effective Jan. 1, 2013 (O.C.G.A. § 24-7-702)</td><td>Legislatively moved from Harper (Frye-like) to Daubert. New Evidence Code enacted 2011, effective January 1, 2013.</td></tr>
    <tr><td><strong>Hawaii</strong></td><td>State v. Vliet (2002)</td><td>HRE 702 - reliability-focused analysis.</td></tr>
    <tr><td><strong>Idaho</strong></td><td>State v. Merwin (2004)</td><td>IRE 702 follows Daubert.</td></tr>
    <tr><td><strong>Indiana</strong></td><td>Turner v. State (2000)</td><td>Adopted Daubert factors under IRE 702.</td></tr>
    <tr><td><strong>Iowa</strong></td><td>Leaf v. Goodyear Tire (1999)</td><td>Iowa R. Evid. 5.702 - Daubert framework.</td></tr>
    <tr><td><strong>Kansas</strong></td><td>Kuhn v. Sandoz Pharm. Corp. (2000)</td><td>K.S.A. 60-456 - applies Daubert-like reliability standard.</td></tr>
    <tr><td><strong>Kentucky</strong></td><td>Toyota Motor Corp. v. Gregory (2010)</td><td>KRE 702 - adopted Daubert, replacing Frye.</td></tr>
    <tr><td><strong>Louisiana</strong></td><td>State v. Foret (1993)</td><td>La. Code Evid. art. 702 - early Daubert adopter.</td></tr>
    <tr><td><strong>Maine</strong></td><td>State v. Williams (2002)</td><td>MRE 702 - Daubert factors applied.</td></tr>
    <tr><td><strong>Massachusetts</strong></td><td>Commonwealth v. Lanigan (1994)</td><td>Daubert-Lanigan standard - hybrid but reliability-based.</td></tr>
    <tr><td><strong>Michigan</strong></td><td>Gilbert v. DaimlerChrysler (2004)</td><td>MRE 702 - legislatively adopted Daubert.</td></tr>
    <tr><td><strong>Mississippi</strong></td><td>Miss. Transp. Comm'n v. McLemore (2003)</td><td>MRE 702 follows Daubert.</td></tr>
    <tr><td><strong>Montana</strong></td><td>State v. Cline (2003)</td><td>MRE 702 - Daubert reliability analysis.</td></tr>
    <tr><td><strong>Nebraska</strong></td><td>Schafersman v. Agland Coop (2002)</td><td>Adopted Daubert, replacing Frye.</td></tr>
    <tr><td><strong>Nevada</strong></td><td>Higgs v. State (1997)</td><td>NRS 50.275 - Daubert factors.</td></tr>
    <tr><td><strong>New Hampshire</strong></td><td>Baker Valley Lumber v. Ingersoll-Rand (2005)</td><td>NRE 702 - Daubert framework.</td></tr>
    <tr><td><strong>New Jersey</strong></td><td>Kemp v. State (2002)</td><td>N.J.R.E. 702 - applies a reliability standard consistent with Daubert principles.</td></tr>
    <tr><td><strong>New Mexico</strong></td><td>State v. Alberico (1993)</td><td>Early adopter - NMRA 11-702.</td></tr>
    <tr><td><strong>North Carolina</strong></td><td>2011 legislation (N.C.G.S. § 8C-1, Rule 702)</td><td>Legislatively adopted Daubert, effective 2011.</td></tr>
    <tr><td><strong>Ohio</strong></td><td>Miller v. Bike Athletic Co. (1998)</td><td>ORC 2743.43 - Daubert reliability standard.</td></tr>
    <tr><td><strong>Oklahoma</strong></td><td>Christian v. Gray (2003)</td><td>12 O.S. § 2702 - Daubert standard.</td></tr>
    <tr><td><strong>Oregon</strong></td><td>State v. O'Key (1995)</td><td>OEC 702 - Daubert-like analysis.</td></tr>
    <tr><td><strong>Rhode Island</strong></td><td>Owens v. Silvia (2005)</td><td>Adopted Daubert factors.</td></tr>
    <tr><td><strong>South Carolina</strong></td><td>State v. Council (2006)</td><td>SCRE 702 - adopted Daubert framework.</td></tr>
    <tr><td><strong>South Dakota</strong></td><td>State v. Hofer (2001)</td><td>SDCL 19-15-2 - Daubert reliability test.</td></tr>
    <tr><td><strong>Tennessee</strong></td><td>McDaniel v. CSX Transp. (2007)</td><td>TRE 702 - Daubert standard.</td></tr>
    <tr><td><strong>Texas</strong></td><td>E.I. du Pont v. Robinson (1995)</td><td>TRE 702 - Robinson factors (Texas Daubert).</td></tr>
    <tr><td><strong>Utah</strong></td><td>State v. Crosby (2002)</td><td>URE 702 - Daubert reliability analysis.</td></tr>
    <tr><td><strong>Vermont</strong></td><td>State v. Streich (2003)</td><td>VRE 702 - Daubert factors.</td></tr>
    <tr><td><strong>West Virginia</strong></td><td>Wilt v. Buracker (1993)</td><td>Early adopter - WRE 702.</td></tr>
    <tr><td><strong>Wisconsin</strong></td><td>State v. Giese (2014)</td><td>Wis. Stat. § 907.02 - reliability-based standard.</td></tr>
    <tr><td><strong>Wyoming</strong></td><td>Bunting v. Jamieson (2004)</td><td>WRE 702 - Daubert factors applied.</td></tr>
    <tr><td><strong>D.C.</strong></td><td>Motorola Inc. v. Murray (2016)</td><td>Adopted Daubert for D.C. Superior Court.</td></tr>
    <tr><td><strong>Guam</strong></td><td>GRE 702</td><td>Follows federal Daubert standard.</td></tr>
    <tr><td><strong>Puerto Rico</strong></td><td>P.R. R. Evid. 702</td><td>Follows federal Daubert standard.</td></tr>
    <tr><td><strong>U.S. Virgin Islands</strong></td><td>V.I. R. Evid. 702</td><td>Follows federal Daubert standard.</td></tr>
  </tbody>
</table>

<h2>Frye / Frye-Plus States (7)</h2>
<p>These jurisdictions still apply the Frye "general acceptance" test (1923), sometimes with additional requirements.</p>
<table>
  <thead><tr><th>State</th><th>Standard</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><strong>California</strong></td><td>Kelly/Frye (People v. Kelly, 1976)</td><td>Applies to novel scientific techniques only. Sargon (2012) adds gatekeeping for all expert opinions. Federal cases in CA use Daubert.</td></tr>
    <tr><td><strong>Illinois</strong></td><td>Frye (People v. McKown, 2010)</td><td>General acceptance test. Illinois Supreme Court reaffirmed Frye and rejected Daubert.</td></tr>
    <tr><td><strong>Maryland</strong></td><td>Frye-Reed (Reed v. State, 1978)</td><td>General acceptance - legislature has considered but not adopted Daubert.</td></tr>
    <tr><td><strong>Minnesota</strong></td><td>Frye-Mack (State v. Mack, 1980)</td><td>General acceptance for novel scientific evidence.</td></tr>
    <tr><td><strong>New York</strong></td><td>Frye (People v. Wesley, 1994)</td><td>General acceptance. Court of Appeals has repeatedly declined to adopt Daubert.</td></tr>
    <tr><td><strong>Pennsylvania</strong></td><td>Frye (Grady v. Frito-Lay, 2003)</td><td>General acceptance. PA Supreme Court reaffirmed Frye in 2003.</td></tr>
    <tr><td><strong>Washington</strong></td><td>Frye (State v. Copeland, 1996)</td><td>General acceptance for novel scientific evidence. ER 702 for non-scientific.</td></tr>
  </tbody>
</table>

<h2>Unique / Hybrid Standards (4)</h2>
<p>These states apply their own standard that does not neatly fit into either the Daubert or Frye framework.</p>
<table>
  <thead><tr><th>State</th><th>Standard</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td><strong>Alabama</strong></td><td>Hybrid</td><td>Applies both general acceptance and reliability factors depending on the type of evidence.</td></tr>
    <tr><td><strong>Missouri</strong></td><td>§ 490.065 (Unique)</td><td>Statutory standard - expert testimony requires "reasonable certainty" and must assist the trier of fact. Neither strictly Daubert nor Frye.</td></tr>
    <tr><td><strong>North Dakota</strong></td><td>NDRE 702 (Modified)</td><td>Reliability-focused but does not formally adopt all Daubert factors. Courts apply a flexible analysis.</td></tr>
    <tr><td><strong>Virginia</strong></td><td>Reliability + Helpfulness</td><td>John v. Im (2002) - requires reliability and helpfulness but does not formally follow Daubert or Frye. Expert must be qualified and testimony must assist trier of fact.</td></tr>
  </tbody>
</table>

<h2>Quick Reference Summary</h2>
<table>
  <thead><tr><th>Standard</th><th>Count</th><th>Key Test</th></tr></thead>
  <tbody>
    <tr><td><strong>Daubert</strong></td><td>39 states + D.C. + federal + territories</td><td>Reliability, methodology, fit - judge as gatekeeper</td></tr>
    <tr><td><strong>Frye</strong></td><td>7 states</td><td>General acceptance in the relevant scientific community</td></tr>
    <tr><td><strong>Unique / Hybrid</strong></td><td>4 states</td><td>Varies - see individual state notes</td></tr>
  </tbody>
</table>

<div class="callout">
  <strong>Practice tip:</strong> Before accepting any expert retention, confirm (1) which court the case is in (state vs. federal), (2) which admissibility standard applies in that specific jurisdiction, and (3) whether the standard applies differently to scientific vs. non-scientific expert testimony. A Daubert state's federal court always uses Daubert, but the same state's courts may use Frye or a hybrid standard.
</div>
`
);

// ── Page component ────────────────────────────────────────────────────────────

const RESOURCES = [
  {
    id: 'r1',
    title: 'Frye vs. Kelly vs. Daubert Quick Reference Card',
    description:
      'Side-by-side comparison table, Kelly three-prong checklist, Daubert five-factor checklist, Sargon summary, and industry application examples across all eight disciplines.',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    generate: resource1Html,
  },
  {
    id: 'r2',
    title: 'California Expert Admissibility Checklist',
    description:
      'Pre-retention checklist, Kelly challenge preparation guide with industry-specific notes, and red flags by discipline for California state court testimony.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    generate: resource2Html,
  },
  {
    id: 'r3',
    title: 'Federal Court Daubert Preparation Guide',
    description:
      'Daubert hearing overview, what federal judges look for, methodology documentation guide, and common exclusion patterns - with field-specific guidance for all eight industries.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0l-3-3m-9 3l3-3m0 0h6',
    generate: resource3Html,
  },
  {
    id: 'r4',
    title: 'Admissibility Standards - Full Module Summary',
    description:
      'Condensed reference notes from all three lessons covering Frye, Kelly, and Daubert - including jurisdiction rules, Kelly scope limitations, Sargon, and multi-industry application.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    generate: resource4Html,
  },
  {
    id: 'r5',
    title: 'State-by-State Admissibility Standards',
    description:
      'All 50 states, D.C., and territories - which jurisdictions use Daubert, Frye, or a hybrid standard, with adoption dates, key cases, and practice notes.',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    generate: resource5Html,
  },
];

export default function AdmissibilityResourcesPage() {
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
        <p className="portal-page__subtitle">5 reference guides - available anytime, open in a new tab</p>
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
