import React from 'react';
import { Link } from 'react-router-dom';
import TrainingDisclaimer from '../components/TrainingDisclaimer';

// Shared inline styles for generated HTML resource pages
const pageStyles = `
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
  ul { padding-left: 20px; margin: 0 0 16px; }
  li { margin-bottom: 7px; font-size: 14px; color: #4e5538; line-height: 1.6; }
  p { font-size: 14px; color: #4e5538; margin: 0 0 12px; line-height: 1.6; }
  strong { color: #3e442b; }
  em { font-style: normal; font-size: 13px; color: #676d5f; background: #f0ece3; padding: 2px 6px; border-radius: 4px; display: inline-block; margin: 4px 0 8px; line-height: 1.5; }
  .note { background: #f0ece3; border: 1px solid #e8dab2; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #676d5f; margin-top: 40px; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 24px; font-size: 13px; border-radius: 8px; overflow: hidden; }
  th { background: #3e442b; color: white; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 10px 14px; border-bottom: 1px solid #e8dab2; color: #4e5538; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background: #f7f5f0; }
  .pdf-btn { display: inline-block; margin: 0 0 24px; padding: 9px 20px; background: #d36622; color: #fff; font-family: inherit; font-size: 13px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; letter-spacing: 0.02em; }
  .pdf-btn:hover { background: #b8551a; }
  @page { margin: 0; }
  @media print { .pdf-btn { display: none; } body { padding: 0.45in; } }
  @media (max-width: 600px) {
    .page-wrap { padding: 0 12px 40px; }
    .header-bar { padding: 16px 16px; flex-direction: column; align-items: flex-start; gap: 4px; }
    .content-card { padding: 20px 16px; }
    h1 { font-size: 20px; }
    table { font-size: 12px; display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    th, td { padding: 8px 10px; }
  }
`;

function makeHtml(title, subtitle, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Veracity Expert Witness LLC</title>
  <style>${pageStyles}</style>
</head>
<body>
  <div class="header-bar">
    <div>
      <div class="brand">Veracity Expert Witness LLC</div>
      <div class="tag">Expert Witness Foundations</div>
    </div>
  </div>
  <div class="page-wrap">
    <div class="content-card">
      <button class="pdf-btn" onclick="window.print()">PDF</button>
      <h1>${title}</h1>
      <div class="subtitle">${subtitle}</div>
      ${bodyHtml}
      <div class="note">This document is provided by Veracity Expert Witness LLC as a training reference. It is for educational purposes only and does not constitute legal advice. Veracity Expert Witness LLC assumes no liability for how this content is applied. You remain solely responsible for your own professional conduct and testimony.</div>
    </div>
  </div>
</body>
</html>`;
}

const RESOURCES = [
  {
    id: 1,
    title: 'Court-Ready CV Checklist',
    description: 'Ensure your CV is formatted and complete for expert witness engagements.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    generate: () => makeHtml(
      'Court-Ready CV Checklist',
      'Expert Witness Foundations · Veracity Expert Witness LLC',
      `
      <h2>Personal & Contact Information</h2>
      <ul>
        <li>Full legal name as it appears on licenses and credentials</li>
        <li>Current professional title and primary employer/affiliation</li>
        <li>Business address and contact email (not personal)</li>
        <li>Phone number for attorney contact</li>
      </ul>

      <h2>Education</h2>
      <ul>
        <li>All degrees listed in reverse chronological order (most recent first)</li>
        <li>Institution name, degree, field of study, and year conferred for each</li>
        <li>Residency, fellowship, or post-doctoral training included (if applicable)</li>
        <li>No gaps in academic timeline that cannot be explained</li>
      </ul>

      <h2>Licensure & Certifications</h2>
      <ul>
        <li>All current professional licenses (state, type, license number, expiration)</li>
        <li>Board certifications with issuing board and date of certification</li>
        <li>Any expired licenses disclosed - do not omit them</li>
        <li>CLE, CME, or continuing education relevant to your area of expertise noted</li>
      </ul>

      <h2>Professional Experience</h2>
      <ul>
        <li>All positions in reverse chronological order with dates, employer, and title</li>
        <li>Brief description of responsibilities for each role (2–3 lines)</li>
        <li>Any consulting or independent practice included</li>
        <li>Gaps in employment addressed (leave of absence, sabbatical, etc.)</li>
      </ul>

      <h2>Publications & Research</h2>
      <ul>
        <li>Peer-reviewed articles in correct citation format</li>
        <li>Books, book chapters, and monographs listed separately</li>
        <li>Conference presentations and proceedings included</li>
        <li>No publications listed that you cannot fully defend in deposition</li>
      </ul>

      <h2>Expert Witness Experience</h2>
      <ul>
        <li>Cases listed by type and jurisdiction (not by party name - maintain confidentiality)</li>
        <li>Number of depositions given (approximate, by year if possible)</li>
        <li>Number of trial appearances (approximate)</li>
        <li>Percentage of cases for plaintiff vs. defendant disclosed accurately</li>
        <li>Any cases where your opinion was excluded by the court noted (opposing counsel will find these)</li>
      </ul>

      <h2>Before Submitting</h2>
      <ul>
        <li>CV reviewed for accuracy by a colleague or staff member</li>
        <li>No exaggerations or embellishments - opposing counsel will verify</li>
        <li>All prior testimony consistent with your current opinions</li>
        <li>CV dated and versioned so you can track what was disclosed in each matter</li>
      </ul>
      `
    ),
  },
  {
    id: 2,
    title: 'Pre-Deposition Preparation Protocol',
    description: 'A step-by-step protocol to prepare for your expert deposition.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    generate: () => makeHtml(
      'Pre-Deposition Preparation Protocol',
      'Expert Witness Foundations · Veracity Expert Witness LLC',
      `
      <h2>Two Weeks Before the Deposition</h2>
      <ul>
        <li>Re-read your expert report from cover to cover - know every word</li>
        <li>Review all documents, records, and materials you relied upon in forming your opinion</li>
        <li>Review your CV for accuracy and prepare to explain every entry</li>
        <li>Review any prior testimony you have given in similar cases</li>
        <li>Research any treatises, standards, or guidelines opposing counsel is likely to use</li>
      </ul>

      <h2>One Week Before</h2>
      <ul>
        <li>Pre-deposition meeting with retaining counsel - confirm topics, likely attack areas, and ground rules</li>
        <li>Confirm the deposition date, time, location, and format (in-person or remote)</li>
        <li>Identify any materials you will bring to the deposition (your report, CV - nothing else unless instructed)</li>
        <li>Review the operative complaint and any defense filings to understand the case posture</li>
        <li>Prepare brief, clear articulations of your core opinions and methodology</li>
      </ul>

      <h2>The Night Before</h2>
      <ul>
        <li>Do NOT review new materials - only what you have already relied upon</li>
        <li>Confirm logistics: location, start time, parking, remote connection details</li>
        <li>Get adequate rest - fatigue degrades performance under pressure</li>
        <li>Do not discuss the case with anyone other than retaining counsel</li>
      </ul>

      <h2>Day of Deposition</h2>
      <ul>
        <li>Arrive at least 15 minutes early for in-person; log in 10 minutes early for remote</li>
        <li>Bring: your expert report, your CV, a notepad, water</li>
        <li>Dress professionally - even for remote depositions</li>
        <li>Brief check-in with retaining counsel immediately before starting</li>
      </ul>

      <h2>During the Deposition - Key Rules</h2>
      <ul>
        <li>Listen to the complete question before formulating your answer</li>
        <li>Pause briefly before answering every question</li>
        <li>Answer only the question asked - do not volunteer additional information</li>
        <li>Ask for clarification if a question is confusing or compound</li>
        <li>"I don't know" and "I don't recall" are legitimate answers - use them when true</li>
        <li>Correct any false premises embedded in questions before answering</li>
        <li>Request a break if you need one - this is your right</li>
      </ul>

      <h2>After the Deposition</h2>
      <ul>
        <li>Note any questions you were unprepared for - prepare better answers for trial</li>
        <li>Debrief with retaining counsel promptly</li>
        <li>Review the transcript when available and submit any errata within the deadline</li>
        <li>Flag any inconsistencies between your deposition testimony and your report</li>
      </ul>
      `
    ),
  },
  {
    id: 3,
    title: 'California Expert Witness Rules Quick Reference',
    description: 'Key California statutes and standards every expert should know.',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    generate: () => makeHtml(
      'California Expert Witness Rules Quick Reference',
      'Expert Witness Foundations · Veracity Expert Witness LLC',
      `
      <table>
        <tr><th>Statute / Standard</th><th>What It Governs</th><th>Key Requirement</th></tr>
        <tr><td><strong>Evidence Code § 720</strong></td><td>Expert Qualifications</td><td>Expert must have special knowledge, skill, experience, training, OR education on the subject. No degree required - practical experience alone can qualify.</td></tr>
        <tr><td><strong>Evidence Code § 801</strong></td><td>Expert Opinion Admissibility</td><td>Opinion must relate to subject sufficiently beyond common experience and be based on matter reasonably relied upon by experts in the field.</td></tr>
        <tr><td><strong>Evidence Code § 802</strong></td><td>Basis of Opinion</td><td>Expert may state the basis for their opinion on direct examination. Court may require disclosure of underlying data.</td></tr>
        <tr><td><strong>CCP § 2034</strong></td><td>Expert Disclosure</td><td>Expert lists exchanged ~50 days before trial. Includes expert name, qualifications, and general substance of opinion. Late or non-disclosure → potential exclusion.</td></tr>
        <tr><td><strong>CCP § 2025.290</strong></td><td>Deposition Duration</td><td>General depositions limited to 7 hours on the record absent agreement or court order. Expert witness depositions are expressly exempt under § 2025.290(b).</td></tr>
        <tr><td><strong>Sargon Enterprises v. USC (2012)</strong></td><td>Gatekeeping Standard</td><td>Trial courts must exclude speculative, unfounded, or methodologically unsound expert opinions - even from qualified experts. California's Daubert equivalent.</td></tr>
        <tr><td><strong>Case Law / Ethics</strong></td><td>Fee Arrangements</td><td>Contingency fee arrangements for expert witnesses are prohibited in California under case law and professional ethical standards.</td></tr>
        <tr><td><strong>Evidence Code § 721</strong></td><td>Cross-Examination</td><td>Expert may be cross-examined on qualifications, subject matter, and the basis and reasons for the opinion. Under § 721(b), an expert may not be cross-examined on the content of a treatise unless the expert relied on it, it was admitted in evidence, or it was established as a reliable authority.</td></tr>
        <tr><td><strong>Evidence Code § 722</strong></td><td>Bias / Compensation</td><td>Expert's compensation is admissible to attack credibility. Expert can be asked about fees, frequency of testimony, and percentage of work for each side.</td></tr>
      </table>

      <h2>Disclosure Checklist (CCP § 2034)</h2>
      <ul>
        <li>Expert name, address, and qualifications</li>
        <li>General substance of anticipated testimony</li>
        <li>Any reports, writings, or materials the expert will rely on</li>
        <li>Expert must be willing to be deposed after disclosure</li>
      </ul>

      <h2>Sargon - What Courts Can Exclude</h2>
      <ul>
        <li>Opinions based on insufficient factual foundation</li>
        <li>Speculative or conjectural conclusions</li>
        <li>Opinions derived from unsound or unreliable methodology</li>
        <li>Opinions that are internally inconsistent</li>
        <li>Opinions that contradict the expert's own prior testimony or writings without explanation</li>
      </ul>
      `
    ),
  },
  {
    id: 4,
    title: 'Expert Fee & Disclosure Language Guide',
    description: 'Standard language for fee agreements and disclosure responses.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    generate: () => makeHtml(
      'Expert Fee & Disclosure Language Guide',
      'Expert Witness Foundations · Veracity Expert Witness LLC',
      `
      <h2>Standard Fee Categories</h2>
      <table>
        <tr><th>Service</th><th>Billing Practice</th><th>Notes</th></tr>
        <tr><td>Record review / case analysis</td><td>Hourly rate</td><td>Billed in 0.25-hour increments; minimum typically 1 hour</td></tr>
        <tr><td>Written expert report</td><td>Hourly rate</td><td>Include time for review, drafting, and revision</td></tr>
        <tr><td>Deposition preparation</td><td>Hourly rate</td><td>Typically includes pre-deposition meeting with counsel</td></tr>
        <tr><td>Deposition testimony</td><td>Hourly rate or half/full day flat fee</td><td>Portal-to-portal (travel time included) is common</td></tr>
        <tr><td>Trial testimony</td><td>Daily flat fee or hourly</td><td>Cancellation/standby fee standard if case settles</td></tr>
        <tr><td>Travel</td><td>Actual expenses + hourly for travel time</td><td>Coach airfare standard unless long-haul; receipts required</td></tr>
      </table>

      <h2>Deposition Testimony - Response to Fee Questions</h2>
      <p><strong>Q: "How much are you being paid for your opinion in this case?"</strong></p>
      <p><em>Suggested response:</em> "I'm being compensated at my standard hourly rate of $[X]/hour for all time spent on this matter - reviewing records, preparing my report, and for this deposition. My total time to date is approximately [X] hours. I'm not paid for the content of my opinion, and my fee is the same regardless of the outcome of this case."</p>

      <p><strong>Q: "What percentage of your income comes from expert witness work?"</strong></p>
      <p><em>Suggested response:</em> "Approximately [X]% of my professional time is currently devoted to consulting and expert witness work. The remainder is [clinical practice / academic work / other professional activities]."</p>

      <p><strong>Q: "Do you work more for plaintiffs or defendants?"</strong></p>
      <p><em>Suggested response:</em> "Over the course of my expert witness work, I have been retained by both plaintiff and defense counsel. My practice is to accept engagements where I believe my analysis can be genuinely helpful, regardless of which side retains me."</p>

      <h2>CCP § 2034 Disclosure Language</h2>
      <p>The following language is standard for the expert declaration required under CCP § 2034.260:</p>
      <p><em>"[Expert Name] is a [credential] with [X] years of experience in [field]. [He/She/They] will testify regarding [general subject area] and is expected to opine that [general substance of opinion, stated broadly]. [Expert] will rely upon the records, reports, and materials listed in the attached Exhibit A, as well as [his/her/their] education, training, and professional experience."</em></p>

      <h2>Engagement Letter - Key Provisions</h2>
      <ul>
        <li><strong>Scope of engagement:</strong> Records review, report preparation, deposition, and/or trial (specify which)</li>
        <li><strong>Hourly rate:</strong> Stated clearly with any minimum billing increments</li>
        <li><strong>Retainer:</strong> Amount and replenishment terms</li>
        <li><strong>Cancellation policy:</strong> Minimum notice required to avoid cancellation fee for depositions and trial</li>
        <li><strong>Independence clause:</strong> "Expert's opinions will reflect expert's independent professional judgment based on the materials reviewed and expert's training and experience."</li>
        <li><strong>No contingency:</strong> "Compensation is not contingent on the outcome of the matter." (Required under California case law and ethical standards)</li>
      </ul>
      `
    ),
  },
  {
    id: 5,
    title: 'Expert Witness Foundations - Full Lesson Summary',
    description: 'A complete written summary of all 10 lessons for ongoing reference.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    generate: () => makeHtml(
      'Expert Witness Foundations - Full Lesson Summary',
      'Expert Witness Foundations · Veracity Expert Witness LLC',
      `
      <h2>Unit 1: The Expert Witness Role</h2>

      <p><strong>Lesson 1.1 - What Expert Witnesses Actually Do</strong></p>
      <ul>
        <li>Your primary duty runs to the court and the trier of fact, not to the retaining party</li>
        <li>Expert testimony must be grounded in sufficient facts, reliable methodology, and sound reasoning</li>
        <li>Independence is the source of your credibility - not a constraint on it</li>
      </ul>

      <p><strong>Lesson 1.2 - Ethics, Independence & the Hired Gun Problem</strong></p>
      <ul>
        <li>The "hired gun" label follows experts throughout their careers and is professionally fatal</li>
        <li>Your obligations arise from your licensing board, professional codes, and FRCP Rule 26 / CCP § 2034.260</li>
        <li>Acknowledging limitations in your opinion strengthens your credibility with the jury</li>
        <li>An opinion that is honest but 70% favorable is worth more than one that is 100% favorable but dishonest</li>
      </ul>

      <h2>Unit 2: How Depositions Work</h2>

      <p><strong>Lesson 2.1 - Deposition Basics: Anatomy & Preparation</strong></p>
      <ul>
        <li>Depositions are sworn discovery proceedings - your testimony can be used for impeachment at trial</li>
        <li>California's general 7-hour deposition limit (CCP § 2025.290) does not apply to expert witnesses; expert depositions have no statutory time cap</li>
        <li>Pre-deposition preparation is mandatory: re-read your report, review all relied-upon materials, meet with counsel</li>
        <li>Never review new materials the night before - only what you have already relied upon</li>
      </ul>

      <p><strong>Lesson 2.2 - Deposition Demeanor & Answering Strategy</strong></p>
      <ul>
        <li>Answer only the question asked - do not volunteer beyond the scope of the question</li>
        <li>Pause before every answer: allows objections and prevents impulsive responses</li>
        <li>"I don't know" and "I don't recall" are legitimate, professional answers when true</li>
        <li>Correct false premises embedded in questions before answering</li>
        <li>You have the right to provide a complete answer to a question that cannot be fairly answered yes or no</li>
      </ul>

      <h2>Unit 3: Handling Cross-Examination</h2>

      <p><strong>Lesson 3.1 - The Goals of Cross-Examination</strong></p>
      <ul>
        <li>The three attacks: qualifications, methodology, and credibility</li>
        <li>Identifying which attack is underway helps you formulate an appropriate response</li>
        <li>Cross-examination has a script - preparation removes the element of surprise</li>
      </ul>

      <p><strong>Lesson 3.2 - Handling Fees, Bias & Treatise Attacks</strong></p>
      <ul>
        <li>Fee questions: acknowledge transparently, note all experts are compensated, cite your track record of independence</li>
        <li>Bias questions: don't deny your case mix - emphasize that your opinion follows the facts, not the retaining party</li>
        <li>Treatise attacks: accept the general principle, then distinguish based on the specific facts of the case</li>
        <li>Prior testimony attacks: consistency is your best defense - review prior testimony before every engagement</li>
      </ul>

      <p><strong>Lesson 3.3 - Staying Composed Under Pressure</strong></p>
      <ul>
        <li>Composure is a learnable professional skill, not a personality trait</li>
        <li>Hostile questioning tone does not require a hostile answering tone</li>
        <li>Look at the jury when giving explanatory answers - they are your real audience</li>
        <li>"I'd like to finish my answer" is a complete, professional, and effective sentence</li>
        <li>The more composed you are under aggressive cross, the more credible you appear to the jury</li>
      </ul>

      <h2>Unit 4: What Attorneys Want & California Rules</h2>

      <p><strong>Lesson 4.1 - What Attorneys Need from You</strong></p>
      <ul>
        <li>Plaintiff experts: clarity, accessibility, causal narrative, connection with the jury</li>
        <li>Defense experts: methodological rigor, alternative explanations, calm authority</li>
        <li>Both sides need: reliability, consistency, promptness, and credibility</li>
        <li>Understanding attorney needs improves communication - it does not compromise independence</li>
      </ul>

      <p><strong>Lesson 4.2 - California Evidence Code § 720</strong></p>
      <ul>
        <li>Qualifications require knowledge, skill, experience, training, OR education - not necessarily a degree</li>
        <li>Practical experience alone can qualify an expert in California</li>
        <li>Connect your specific background to the specific opinion you are offering in this specific case</li>
        <li>Generic credential recitation is less effective than targeted qualification explanation</li>
      </ul>

      <p><strong>Lesson 4.3 - California-Specific Rules & Procedures</strong></p>
      <ul>
        <li>CCP § 2034: expert disclosures required ~50 days before trial; failure can result in exclusion</li>
        <li>Sargon (2012): California courts gatekeep speculative or methodologically unsound opinions</li>
        <li>Contingency fee arrangements for experts are prohibited in California under case law and ethical standards</li>
        <li>Only disclosed experts may testify at trial - unlisted experts are generally excluded</li>
        <li>JCCP proceedings may modify standard expert witness rules</li>
      </ul>
      `
    ),
  },
];

export default function ResourcesPage() {
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
