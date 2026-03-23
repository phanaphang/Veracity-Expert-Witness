export const ROLES = [
  "All Staff",
  "Case Coordinator",
  "Account Manager",
  "Billing/Finance",
];

export const MODULES = [
  {
    id: "intake",
    title: "Intake & Case Acceptance",
    icon: "\u{1F4CB}",
    roles: ["All Staff", "Case Coordinator", "Account Manager"],
    description:
      "Learn the end-to-end intake process from initial client contact through conflict checks to signed engagement letters.",
    sections: [
      {
        title: "Initial Client Contact",
        content:
          "When a potential client reaches out, every interaction must be logged immediately in the case management system. The intake coordinator captures: client name, law firm, jurisdiction, case type, opposing parties, timeline urgency, and requested expert specialty. All inquiries must be acknowledged within 2 business hours. Use the standard intake form (Form INT-001) and confirm receipt via email using Template E-100.",
      },
      {
        title: "Conflict of Interest Check",
        content:
          "Before any engagement proceeds, a mandatory conflict check must be completed. Cross-reference the opposing parties, related entities, and case subject matter against our active and historical case database. Conflicts are categorized as:\n\nHard Conflict \u2014 Expert has prior involvement with opposing party, engagement cannot proceed.\n\nSoft Conflict \u2014 Potential overlap exists, escalate to Director for review within 24 hours.\n\nClear \u2014 No conflicts identified, proceed to scope definition.",
      },
      {
        title: "Scope Definition & Engagement Letters",
        content:
          "Once cleared, the Account Manager works with the client to define the engagement scope. This includes: specific questions the expert will address, deliverables (report, deposition, trial testimony), estimated timeline, and rate structure. The engagement letter must be generated using Template EL-200, reviewed by the Account Manager, and sent for client signature before ANY work begins. No exceptions. Digital signatures via DocuSign are acceptable.",
      },
    ],
    quiz: [
      {
        question:
          "A client calls requesting an expert for a case with a hearing in 5 business days. What is the FIRST step?",
        options: [
          "Immediately begin searching for an available expert",
          "Log the inquiry and complete the intake form (INT-001)",
          "Send the client our rate sheet",
          "Schedule a call between the client and a potential expert",
        ],
        correct: 1,
        explanation:
          "Every inquiry must be logged first using Form INT-001, regardless of urgency. This ensures proper tracking and initiates the conflict check process.",
      },
      {
        question:
          "During a conflict check, you discover a potential expert previously consulted with a subsidiary of the opposing party 3 years ago. How do you classify this?",
        options: [
          "Clear \u2014 it was 3 years ago",
          "Hard Conflict \u2014 prior involvement with opposing party",
          "Soft Conflict \u2014 escalate to Director for review",
          "No action needed if the expert doesn't remember",
        ],
        correct: 2,
        explanation:
          "A subsidiary relationship constitutes potential overlap, making this a Soft Conflict. It must be escalated to the Director within 24 hours for determination.",
      },
      {
        question: "When can expert work begin on a new engagement?",
        options: [
          "After the client verbally agrees to the scope",
          "Once the conflict check comes back clear",
          "After the signed engagement letter is received",
          "When the first invoice payment is received",
        ],
        correct: 2,
        explanation:
          "No work may begin until the signed engagement letter is received. This is a firm policy with no exceptions.",
      },
    ],
  },
  {
    id: "matching",
    title: "Expert Matching & Assignment",
    icon: "\u{1F50D}",
    roles: ["Case Coordinator", "Account Manager"],
    description:
      "Master the process of searching, vetting, and assigning qualified experts to client engagements.",
    sections: [
      {
        title: "Expert Database & Search Criteria",
        content:
          "Our expert database contains vetted professionals across all disciplines. When searching for a match, the Case Coordinator filters by: primary specialty area, sub-specialty (if applicable), geographic jurisdiction familiarity, availability for the required timeline, prior testimony experience (number of depositions/trials), and Daubert/Frye challenge history. Always present the client with 2\u20133 qualified candidates ranked by relevance. Never present a single option unless the specialty is extremely narrow.",
      },
      {
        title: "Vetting & Quality Standards",
        content:
          "All experts must meet baseline vetting standards before assignment: Current CV on file (updated within last 12 months), completed background check (refreshed every 2 years), references verified (minimum 3 attorney references), published work reviewed for consistency with anticipated opinions, deposition/trial performance review (if applicable). New experts require full onboarding review by a Senior Case Coordinator before their first assignment.",
      },
      {
        title: "Assignment & Confirmation Protocol",
        content:
          "Once the client selects an expert, the Case Coordinator: 1) Confirms expert availability in writing, 2) Sends the expert a Case Summary Brief (Template CSB-300), 3) Establishes a kickoff call within 48 hours, 4) Creates the case file in the management system, 5) Assigns milestone deadlines. The expert must acknowledge receipt of the Case Summary Brief and sign our Expert Engagement Agreement (Template EEA-310) before accessing any case materials.",
      },
    ],
    quiz: [
      {
        question:
          "How many qualified candidates should you typically present to a client?",
        options: [
          "1 \u2014 the best match only",
          "2\u20133 ranked by relevance",
          "5 or more to give maximum choice",
          "As many as are available",
        ],
        correct: 1,
        explanation:
          "Always present 2\u20133 qualified candidates ranked by relevance. A single option is only acceptable when the specialty is extremely narrow.",
      },
      {
        question:
          "A highly qualified expert's CV on file is 18 months old. Can they be assigned to a new case?",
        options: [
          "Yes \u2014 18 months is close enough",
          "No \u2014 their CV must be updated before assignment",
          "Yes \u2014 but only for cases under $50K",
          "Only if the client doesn't ask for a current CV",
        ],
        correct: 1,
        explanation:
          "CVs must be updated within the last 12 months. An 18-month-old CV does not meet baseline vetting standards and must be refreshed before assignment.",
      },
    ],
  },
  {
    id: "case-mgmt",
    title: "Case Management Workflow",
    icon: "\u{1F4C1}",
    roles: ["All Staff", "Case Coordinator"],
    description:
      "Understand document management, communication protocols, and deadline tracking for active cases.",
    sections: [
      {
        title: "Document Management Standards",
        content:
          "All case documents must be stored in the centralized case management system using our standard folder structure:\n\n/Intake \u2014 engagement letter, conflict check, intake form\n/Expert \u2014 CV, engagement agreement, qualifications\n/Case-Materials \u2014 documents provided by counsel\n/Work-Product \u2014 drafts, notes, reports\n/Correspondence \u2014 emails, call logs, meeting notes\n/Billing \u2014 invoices, expense reports, payment records\n\nDocuments must be named following convention: [CaseID]_[DocType]_[Date]_[Version]. Example: 2024-0847_Report_20240315_v2.pdf",
      },
      {
        title: "Communication Protocols",
        content:
          "All substantive communications regarding a case must be documented: Client calls \u2014 logged within 4 hours using Call Log Template CL-400. Expert communications \u2014 documented in case file within same business day. Internal handoffs \u2014 use the Case Transfer Form (CTF-410) with full status summary. Email communications must CC the case file email address for automatic archival. Never use personal email accounts for case communications. Privileged materials must be marked \u201CCONFIDENTIAL \u2014 ATTORNEY WORK PRODUCT\u201D in the subject line.",
      },
      {
        title: "Deadline & Milestone Tracking",
        content:
          "Every case must have a milestone timeline entered into the system within 24 hours of engagement. Standard milestones include: Document review completion, Draft report due date (minimum 10 business days before submission), Internal QA review, Final report submission, Deposition date, Trial date. Automated reminders fire at 14 days, 7 days, and 2 days before each milestone. The Case Coordinator is responsible for confirming expert acknowledgment of each deadline.",
      },
    ],
    quiz: [
      {
        question:
          "Where should a draft expert report be stored in the case file structure?",
        options: [
          "/Case-Materials",
          "/Correspondence",
          "/Work-Product",
          "/Expert",
        ],
        correct: 2,
        explanation:
          "Draft reports are work product and belong in the /Work-Product folder. /Case-Materials is for documents provided by counsel.",
      },
      {
        question:
          "A client attorney sends you a privileged document via email. What must be included in your reply?",
        options: [
          "A thank you note and confirmation of receipt",
          "CC the case file email and mark subject \u2018CONFIDENTIAL \u2014 ATTORNEY WORK PRODUCT\u2019",
          "Forward it directly to the expert",
          "Print it and store the physical copy",
        ],
        correct: 1,
        explanation:
          "All emails must CC the case file address for archival, and privileged materials require the \u2018CONFIDENTIAL \u2014 ATTORNEY WORK PRODUCT\u2019 marking in the subject line.",
      },
    ],
  },
  {
    id: "reports",
    title: "Report Preparation & Review",
    icon: "\u{1F4DD}",
    roles: ["All Staff", "Case Coordinator"],
    description:
      "Learn report formatting standards, the two-stage QA review process, and secure submission procedures.",
    sections: [
      {
        title: "Report Formatting Standards",
        content:
          "All expert reports must follow our standard format template (Template RPT-500): Cover page with case caption, expert name, and date; Table of contents; Qualifications summary (referencing full CV as exhibit); Assignment/Scope of engagement; Materials reviewed (comprehensive list); Methodology; Analysis and findings; Opinions (numbered and clearly stated); Signature and certification; Appendices and exhibits. Reports must be formatted in 12pt Times New Roman, 1-inch margins, with page numbers. All opinions must be stated to the applicable standard of certainty for the jurisdiction.",
      },
      {
        title: "Quality Assurance Process",
        content:
          "Every report undergoes a two-stage QA review before submission.\n\nStage 1 \u2014 Coordinator Review (within 2 business days): Verify all required sections are present, check formatting compliance, confirm all cited materials are listed, flag any unsupported opinions or logical gaps.\n\nStage 2 \u2014 Senior Review (within 3 business days): Substantive review of methodology and opinions, cross-check with engagement scope, verify jurisdictional requirements are met, final approval signature.\n\nReports returned for revision must be resubmitted for another full QA cycle.",
      },
      {
        title: "Submission & Delivery",
        content:
          "Once QA-approved, the final report is: 1) Converted to PDF with security settings (no-edit, watermarked), 2) Transmitted to counsel via our secure file transfer portal, 3) Delivery confirmation obtained and logged, 4) Hard copies produced if requested (certified mail with tracking). The Case Coordinator must confirm receipt with counsel within 24 hours of transmission. All submission deadlines are tracked against court-ordered due dates with a mandatory 3-business-day buffer.",
      },
    ],
    quiz: [
      {
        question:
          "A report passes Stage 1 QA but is returned in Stage 2 for revisions. After the expert revises it, what happens next?",
        options: [
          "It goes directly to the client since Stage 1 already passed",
          "Only Stage 2 review is repeated",
          "It goes through the full QA cycle again (Stage 1 and Stage 2)",
          "The Case Coordinator makes a judgment call",
        ],
        correct: 2,
        explanation:
          "Reports returned for revision must be resubmitted for a full QA cycle \u2014 both Stage 1 and Stage 2. No shortcuts.",
      },
      {
        question:
          "How far in advance of a court deadline should the final report be submitted to counsel?",
        options: [
          "Same day as the deadline",
          "1 business day before",
          "3 business days before (mandatory buffer)",
          "1 week before",
        ],
        correct: 2,
        explanation:
          "There is a mandatory 3-business-day buffer before court-ordered due dates to allow for any last-minute issues.",
      },
    ],
  },
  {
    id: "deposition-trial",
    title: "Deposition & Trial Support",
    icon: "\u2696\uFE0F",
    roles: ["All Staff", "Case Coordinator", "Account Manager"],
    description:
      "Cover deposition scheduling, expert preparation protocols, day-of support, and post-testimony follow-up.",
    sections: [
      {
        title: "Deposition Scheduling & Logistics",
        content:
          "When a deposition is scheduled, the Case Coordinator must: Confirm the date/time/location with the expert within 24 hours, send the Deposition Preparation Packet (Template DPP-600), arrange travel and accommodations if needed (per Travel Policy TP-001), confirm technology requirements for remote depositions (platform, test connection), send the expert all case materials for refresh review at least 7 days before. For remote depositions, a mandatory technology test must be conducted at least 48 hours in advance. Document the test results using Form TT-610.",
      },
      {
        title: "Expert Preparation Protocol",
        content:
          "Every expert must complete a preparation session before testimony: Review of all materials previously considered, mock cross-examination (minimum 1 hour for depositions, 2 hours for trial), review of opposing expert reports (if available), discussion of anticipated challenges to methodology, review of prior testimony transcripts for consistency. The preparation session must be documented with a Prep Session Summary (Template PSS-620). If the expert has not testified in the last 12 months, an extended preparation session (minimum 3 hours) is required.",
      },
      {
        title: "Day-of Support & Follow-up",
        content:
          "On the day of testimony: Case Coordinator must be available by phone throughout, emergency contact information provided to counsel and expert, technology backup plan documented for remote proceedings, real-time issue escalation to Director if testimony problems arise. Within 48 hours after testimony: Debrief call with expert (documented on Form DB-630), client satisfaction check-in, request and review transcript when available, update case file with testimony summary, trigger post-testimony billing review.",
      },
    ],
    quiz: [
      {
        question:
          "An expert hasn't testified in 14 months. A deposition is scheduled in 10 days. What special requirement applies?",
        options: [
          "Standard 1-hour mock cross-examination is sufficient",
          "Extended preparation session (minimum 3 hours) is required",
          "No special requirements \u2014 experience doesn't expire",
          "The expert should be replaced with someone more active",
        ],
        correct: 1,
        explanation:
          "If an expert has not testified in the last 12 months, an extended preparation session of at least 3 hours is mandatory.",
      },
      {
        question:
          "When must the technology test be completed for a remote deposition?",
        options: [
          "The morning of the deposition",
          "24 hours in advance",
          "At least 48 hours in advance",
          "1 week in advance",
        ],
        correct: 2,
        explanation:
          "A mandatory technology test must be conducted at least 48 hours before a remote deposition, documented using Form TT-610.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Invoicing",
    icon: "\u{1F4B0}",
    roles: ["All Staff", "Billing/Finance", "Account Manager"],
    description:
      "Understand rate structures, expense policies, invoice generation, and the collections process.",
    sections: [
      {
        title: "Rate Structures & Fee Schedules",
        content:
          "Expert fees are structured according to our standard rate tiers:\n\nTier 1 (Standard) \u2014 Document review, research, analysis\nTier 2 (Elevated) \u2014 Report writing, affidavit preparation\nTier 3 (Premium) \u2014 Deposition testimony, trial testimony\nTier 4 (Expedited) \u2014 Rush assignments (< 10 business days), weekend/holiday work\n\nRates are set per expert at onboarding and reviewed annually. Any rate changes must be communicated to active clients 30 days in advance. The fee schedule for each engagement is documented in the engagement letter and cannot be altered without a signed amendment.",
      },
      {
        title: "Expense Policies",
        content:
          "Reimbursable expenses must be pre-approved and documented: Travel \u2014 economy class air, standard hotel, per diem meals per GSA rates. Materials \u2014 printing, binding, demonstratives (requires Account Manager approval over $500). Technology \u2014 specialized software licenses, database access (requires Director approval). Rush charges \u2014 clearly documented and pre-approved by client. All expenses must be submitted with receipts within 30 days. Expenses over 60 days old will not be reimbursed. The Billing Coordinator verifies all expenses against the pre-approval log before invoicing.",
      },
      {
        title: "Invoice Generation & Collections",
        content:
          "Invoicing follows a strict monthly cycle: Time entries due from experts by the 5th of each month, Billing Coordinator reviews and compiles by the 10th, Account Manager reviews and approves by the 12th, Invoices sent to clients by the 15th, Payment terms: Net 30.\n\nFirst reminder at 35 days, second at 45 days, escalation to Director at 60 days. All invoices must itemize: date of service, description of work, time spent, rate applied, and expenses with receipts. Block billing (e.g., \u201Cresearch and analysis \u2014 8 hours\u201D) is prohibited. Each task must be separately itemized.",
      },
    ],
    quiz: [
      {
        question:
          "An expert submits an expense receipt that is 45 days old. What is the correct action?",
        options: [
          "Reject it \u2014 it's past the deadline",
          "Process it \u2014 it's within the 60-day window",
          "Ask the Account Manager to make an exception",
          "Deduct it from the expert's next payment",
        ],
        correct: 1,
        explanation:
          "Expenses must be submitted within 30 days, but the hard cutoff is 60 days. At 45 days, the expense is late but still within the reimbursement window.",
      },
      {
        question:
          "A client invoice reads: \u2018Research and report preparation \u2014 12 hours.\u2019 Is this acceptable?",
        options: [
          "Yes \u2014 it describes the work performed",
          "No \u2014 this is block billing, each task must be separately itemized",
          "Yes \u2014 as long as the total hours are correct",
          "Only if the client has approved block billing in the engagement letter",
        ],
        correct: 1,
        explanation:
          "Block billing is strictly prohibited. Each task must be separately itemized with its own date, description, time, and rate.",
      },
    ],
  },
];
