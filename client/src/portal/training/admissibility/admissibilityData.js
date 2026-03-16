// ============================================================
// admissibilityData.js
// All content for the "Standards of Admissibility: Frye, Kelly,
// and Daubert" training module.
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
//     comparisonTable? Array<{ dimension, kelly, daubert }>
//   }>
//   keyTakeaway     string
// ============================================================

export const MODULE_TITLE = 'Standards of Admissibility: Frye, Kelly, and Daubert';
export const MODULE_SUBTITLE = '~20 minutes · 3 Lessons · 1 Scenario · 1 Knowledge Check';

export const LESSON_SEQUENCE = ['1', '2', '3'];
export const TOTAL_LESSONS = 3;

export function getNextLesson(lessonId) {
  const idx = LESSON_SEQUENCE.indexOf(lessonId);
  return idx >= 0 && idx < LESSON_SEQUENCE.length - 1 ? LESSON_SEQUENCE[idx + 1] : null;
}

export function getLessonIndex(lessonId) {
  return LESSON_SEQUENCE.indexOf(lessonId) + 1; // 1-based
}

// ============================================================
// LESSONS
// ============================================================

export const LESSONS = {
  '1': {
    title: 'The Landscape of Admissibility Standards',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: null,
        body: [
          'Courts serve as gatekeepers of expert testimony. Not every professional opinion qualifies as admissible expert evidence - the court\'s role is to protect juries from unreliable, speculative, or methodologically unsound expertise before it ever reaches deliberation.',
          'The foundational problem is that not all expert opinions are created equal. A credentialed professional may hold a sincere belief that is nonetheless based on faulty methodology, insufficient data, or a technique that their own professional community has not yet accepted. Admissibility standards give courts a principled framework for distinguishing rigorous analysis from what has sometimes been called junk science.',
        ],
      },
      {
        subheading: 'The Three Standards at a Glance',
        body: ['Three primary admissibility frameworks govern expert testimony in U.S. courts:'],
        bullets: [
          'Frye (1923): The general acceptance standard - expert testimony is admissible only if the underlying methodology is generally accepted in the relevant professional community. A number of states, including Illinois, Pennsylvania, and Washington, retain Frye or a Frye-influenced standard.',
          'Daubert (1993): The federal standard, now adopted by the majority of U.S. states. Trial judges act as active gatekeepers, evaluating methodology directly against a set of non-exhaustive factors including testability, peer review, error rate, and general acceptance.',
          'Kelly (1976): California\'s modified Frye standard, applied specifically to novel scientific techniques in California state courts. Refined into a three-prong test requiring general acceptance of the technique, proper expert qualification, and correct application of the technique in the case.',
        ],
      },
      {
        subheading: 'Which Standard Applies Where',
        body: [
          'The applicable standard is determined by jurisdiction - not judicial preference, not case complexity, and not the expert\'s industry:',
        ],
        bullets: [
          'Federal courts nationwide: Daubert',
          'Majority of U.S. state courts: Daubert or a Daubert-influenced standard - making Daubert the dominant national framework',
          'California state courts: Kelly - a significant exception to the national Daubert trend',
          'A number of states including Illinois, Pennsylvania, and Washington retain Frye or a Frye-influenced standard',
          'Key rule: always confirm the applicable standard for the specific jurisdiction before accepting a retention',
        ],
      },
      {
        subheading: 'Why This Matters Regardless of Industry',
        body: [
          'Admissibility standards do not apply only to medical or scientific testimony. A structural engineer\'s finite element analysis software, a forensic accountant\'s proprietary damages model, a cybersecurity expert\'s novel attribution methodology, a physician\'s causation opinion based on a new diagnostic technique, an environmental scientist\'s novel contaminant transport model, an intellectual property expert\'s proprietary damages methodology, an accident reconstructionist\'s simulation software, and a forensic analyst\'s pattern-matching technique all face the same threshold question: is your methodology admissible?',
          'Your credentials establish that you are qualified to hold an opinion. Admissibility standards ask a separate question entirely: did you reach that opinion the right way?',
        ],
      },
    ],
    keyTakeaway:
      'The standard does not care how credentialed you are. It asks one question: did you get there the right way?',
  },

  '2': {
    title: 'Frye & Kelly: General Acceptance in California',
    estimatedMinutes: 7,
    sections: [
      {
        subheading: 'Frye v. United States (1923)',
        body: [
          'Frye v. United States arose from a murder case in which the defendant sought to introduce expert testimony about a "systolic blood pressure deception test" - a crude precursor to the modern polygraph. The court held the test inadmissible because it had not yet gained general acceptance in the relevant scientific community.',
          'That decision established the general acceptance standard that bears Frye\'s name: expert testimony based on a novel methodology is admissible only if the underlying methodology is generally accepted by the relevant professional community - not merely endorsed by the testifying expert.',
        ],
      },
      {
        subheading: 'Defining the Relevant Community',
        body: [
          '"General acceptance" requires that practitioners in the relevant field - the peers who actually use the methodology in professional practice - have accepted it as reliable. How that community is defined varies by discipline:',
        ],
        bullets: [
          'Medical: the applicable clinical specialty, such as oncology, neurology, or forensic pathology',
          'Engineering: the relevant discipline - structural, mechanical, civil, geotechnical, or other',
          'Finance: forensic accounting or valuation peer practice',
          'Digital forensics: accepted cybersecurity and forensic methodology standards, including NIST guidelines and recognized forensic community practices',
          'Environmental science: toxicologists, hydrogeologists, or environmental engineers in the applicable sub-discipline, with reference to EPA-approved methodologies and ASTM environmental standards',
          'Intellectual property: IP economists, licensing professionals, forensic accountants, and patent valuation practitioners',
          'Accident reconstruction: ACTAR-accredited reconstructionists and vehicle dynamics engineers, with reference to SAE International standards',
          'Forensic analysis: the relevant forensic science sub-discipline (forensic biology, trace evidence, questioned documents, latent prints, etc.), with reference to OSAC/NIST standards and ASTM',
        ],
      },
      {
        subheading: 'People v. Kelly (1976) and the Three-Prong Test',
        body: [
          'People v. Kelly involved voiceprint analysis - spectrographic evidence offered to identify a suspect by voice. The California Supreme Court reaffirmed California\'s adherence to the Frye standard and refined it into a structured three-prong test now known as the Kelly test, or Kelly/Frye. To admit expert testimony based on a novel scientific technique in California, the proponent must establish all three prongs:',
        ],
        numberedList: [
          'The technique is generally accepted in the relevant professional community',
          'The witness is properly qualified as an expert on that technique',
          'Correct procedures were used in the particular case',
        ],
      },
      {
        subheading: 'Important Scope Limitation',
        body: [
          'The Kelly test applies specifically to novel scientific techniques and methods - new instruments, tools, or processes offered as the basis for expert opinion. It does not apply to all expert testimony.',
          'Standard professional opinions, clinical diagnoses, and experience-based analysis are not subject to Kelly/Frye unless they rest on a novel scientific technique or mechanism. This distinction matters across all professional disciplines: a physician offering a standard clinical diagnosis, an engineer applying accepted structural principles, a forensic accountant using peer-validated methodology, a cybersecurity analyst following recognized forensic protocols, an environmental scientist applying accepted EPA protocols, an IP damages expert using established valuation frameworks, an accident reconstructionist applying standard physics and documented measurements, and a forensic analyst following validated OSAC/NIST protocols are all offering experience-based opinions - not novel-technique testimony - and Kelly/Frye does not apply to those opinions.',
        ],
      },
      {
        subheading: 'Sargon Enterprises v. USC (2012)',
        body: [
          'In Sargon Enterprises v. USC, the California Supreme Court confirmed that trial judges have a gatekeeping duty to exclude expert opinions that are speculative, unsupported by the materials relied on, or rest on too great an analytical gap between data and conclusion.',
          'Sargon did not adopt Daubert and did not alter California\'s retention of Kelly/Frye for novel scientific techniques. But it reinforced that California judges are active gatekeepers across all expert testimony - not only in novel-technique cases. An opinion that is speculative or analytically unsupported can be excluded under Sargon even if it does not depend on a novel scientific method.',
        ],
      },
      {
        subheading: 'Kelly Challenge Examples by Industry',
        body: [
          'All of the following examples involve novel scientific techniques or methodologies - the category of testimony subject to Kelly/Frye:',
        ],
        bullets: [
          'Medical: a novel diagnostic protocol or testing instrument not yet adopted by peers in the clinical specialty',
          'Engineering: proprietary structural analysis software developed by the expert but not independently validated or adopted by peers in the field',
          'Finance: a damages calculation tool or quantitative model developed by the expert but not used or validated by forensic accounting or valuation practitioners',
          'Digital forensics: an attribution methodology or analysis tool not recognized by NIST or the peer forensic community',
          'Environmental science: a novel contaminant fate-and-transport model or sampling protocol not yet adopted by environmental scientists in the applicable sub-discipline',
          'Intellectual property: a proprietary damages methodology or valuation model not used by IP valuation practitioners (note: IP damages are economic opinions - the primary California risk is typically Sargon rather than Kelly, unless the methodology depends on a novel scientific or computational technique)',
          'Accident reconstruction: proprietary crash simulation or dynamics software not independently validated or adopted by the reconstruction community',
          'Forensic analysis: a novel evidence interpretation technique - such as a pattern-matching method or forensic identification procedure - not recognized by the relevant forensic science community or OSAC/NIST standards',
        ],
      },
    ],
    keyTakeaway:
      'In California state court, if your testimony depends on a novel scientific technique or methodology that your professional community hasn\'t yet accepted - no matter your industry - expect a Kelly challenge. The question is not whether you believe in your method. It is whether your professional community has.',
  },

  '3': {
    title: 'Daubert: The Federal Standard & Multi-Industry Application',
    estimatedMinutes: 6,
    sections: [
      {
        subheading: 'Daubert v. Merrell Dow Pharmaceuticals (1993)',
        body: [
          'In Daubert v. Merrell Dow Pharmaceuticals, the U.S. Supreme Court replaced Frye in federal courts. Under Daubert, the trial judge - not the expert\'s professional community - serves as the active gatekeeper, evaluating the reliability and relevance of expert methodology directly.',
          'Since 1993, the majority of U.S. states have also adopted Daubert or a Daubert-influenced standard, making it the dominant admissibility framework nationwide. California is a significant exception, retaining Kelly as its state court standard.',
        ],
      },
      {
        subheading: 'The Daubert Factors',
        body: [
          'The Daubert factors are non-exhaustive - courts may consider some or all depending on the case:',
        ],
        numberedList: [
          'Has the theory or technique been tested?',
          'Has it been subject to peer review and publication?',
          'What is the known or potential error rate?',
          'Are there standards and controls governing the technique?',
          'Is it generally accepted in the relevant professional community?',
        ],
        afterList:
          'General acceptance remains one factor under Daubert - but it is no longer the only question. A methodology that is generally accepted but untested or unvalidated can still be challenged under the other factors.',
      },
      {
        subheading: 'Kumho Tire v. Carmichael (1999)',
        body: [
          'Kumho Tire extended Daubert beyond hard science to all forms of expert testimony. A forensic accountant\'s damages model, a cybersecurity analyst\'s attribution methodology, a civil engineer\'s failure analysis, a physician\'s causation opinion, an environmental scientist\'s causation methodology, an IP damages expert\'s valuation model, an accident reconstructionist\'s analysis, and a forensic analyst\'s evidence interpretation are all subject to Daubert scrutiny in federal court and in the majority of state courts.',
          'Engineers, accountants, and digital forensics professionals cannot avoid Daubert scrutiny by characterizing their work as experience-based rather than scientific. After Kumho Tire, that distinction is irrelevant.',
        ],
      },
      {
        subheading: 'General Electric v. Joiner (1997)',
        body: [
          'General Electric v. Joiner established that appellate courts review Daubert rulings for abuse of discretion - a highly deferential standard. Exclusions are difficult to overturn on appeal.',
          'The practical consequence: if your expert opinion is excluded at the trial level under Daubert, you are unlikely to recover that ground on appeal. Pre-trial methodology documentation is essential.',
        ],
      },
      {
        subheading: 'Daubert in Practice by Industry',
        body: ['Daubert scrutiny looks different depending on your field:'],
        bullets: [
          'Medical: causation opinions must show differential diagnosis methodology, not just a conclusion - the court examines how the expert ruled out alternative causes',
          'Engineering: failure analysis must show testing, modeling, or peer-validated simulation - not only the engineer\'s judgment',
          'Finance: damages models must show accepted valuation methodology, not only arithmetic - the court scrutinizes the basis for assumptions and projections',
          'Digital forensics: attribution or evidence analysis must follow documented, repeatable, peer-recognized procedures - undocumented or novel attribution methods are highly vulnerable',
          'Environmental science: exposure or causation opinions must show documented dose-response methodology - the court examines whether transport or dispersion models have been tested and validated against field data',
          'Intellectual property: damages opinions must apply accepted valuation frameworks (e.g., Georgia-Pacific factors for reasonable royalties) with documented basis for assumptions - proprietary models without peer validation are highly vulnerable',
          'Accident reconstruction: opinions must be supported by documented measurements, testing, or peer-validated analytical methods - relying solely on visual assessment without quantitative analysis is insufficient',
          'Forensic analysis: evidence analysis must follow documented, repeatable procedures with validated error rates - techniques lacking scientific validation (as highlighted by the 2009 NAS and 2016 PCAST reports) face heightened scrutiny',
        ],
      },
      {
        subheading: 'Kelly vs. Daubert: Side-by-Side',
        body: [
          'Understanding the key differences between Kelly and Daubert prepares you for the specific challenges you may face depending on jurisdiction:',
        ],
        comparisonTable: [
          {
            dimension: 'Jurisdiction',
            kelly: 'California state courts only',
            daubert:
              'Federal courts + majority of U.S. state courts (many applying Daubert or a Daubert-influenced standard)',
          },
          {
            dimension: 'Scope of application',
            kelly:
              'Applies specifically to novel scientific techniques and methodologies; does not apply to all expert testimony',
            daubert:
              'Applies to all expert testimony, including scientific, technical, and experience-based opinions (per Kumho Tire)',
          },
          {
            dimension: 'Primary question',
            kelly:
              'Is the methodology generally accepted in the relevant professional community?',
            daubert:
              'Is the methodology reliable, tested, and based on sufficient facts and data?',
          },
          {
            dimension: 'Gatekeeping scope',
            kelly:
              'Focused on community acceptance of novel techniques; Sargon extended gatekeeping to speculative or analytically unsupported opinions more broadly',
            daubert:
              'Active judicial scrutiny of the entire methodology - testing, error rate, peer review, acceptance, and standards',
          },
          {
            dimension: 'Burden on the expert',
            kelly:
              'Demonstrate that your professional community has accepted your novel methodology',
            daubert:
              'Demonstrate that your methodology is reliable by the court\'s own assessment of the Daubert factors',
          },
          {
            dimension: 'Novel methodology risk',
            kelly:
              'High - if peers haven\'t adopted the technique, it fails prong one regardless of its validity',
            daubert:
              'High - if it hasn\'t been tested or peer-reviewed, all factors cut against you',
          },
          {
            dimension: 'Practical takeaway',
            kelly:
              'In California state court, your professional community is the gatekeeper for novel techniques',
            daubert:
              'In federal court and most other states, the judge is the gatekeeper for all expert testimony',
          },
        ],
      },
    ],
    keyTakeaway:
      'Under Daubert, a federal judge - or a judge in most other states - will ask: how did you get to that opinion? Can it be tested? Has it been reviewed? What is the error rate? These questions apply whether you are a surgeon, a structural engineer, a forensic accountant, or a cybersecurity analyst.',
  },
};

// ============================================================
// BRANCHING SCENARIO
// Two sequential choice points.
//
// choicePoints[].redirectIfWrongCp1 - shown before CP2 when
// the learner chose an incorrect answer at CP1.
// ============================================================

export const SCENARIO_DATA = {
  id: 'challenge',
  title: 'The Challenge',
  setup:
    'You have been retained as an expert witness in a California state court civil case. You plan to offer an opinion on causation using a specialized analytical tool you developed, published in a peer-reviewed journal two years ago, and have used in your professional practice - but which has not yet been widely adopted by others in your field. Opposing counsel files a motion to exclude your testimony before trial, arguing that your method has not gained general acceptance in your professional community.',
  choicePoints: [
    {
      id: 'cp1',
      title: 'Choice Point 1: "What standard applies?"',
      prompt:
        'The judge asks you to identify the correct admissibility standard for this California state court proceeding.',
      choices: [
        {
          id: 'a',
          text: '"The Daubert standard applies - the court should evaluate whether my methodology is scientifically reliable."',
          correct: false,
          consequence:
            'Incorrect. Daubert applies in federal court and the majority of U.S. state courts - but not in California state court. California applies the Kelly standard. Misidentifying the applicable standard in front of the judge signals a lack of familiarity with the legal framework governing your own testimony.',
          takeaway:
            'Always confirm jurisdiction before testimony. California state court = Kelly. Federal court and most other states = Daubert. This applies regardless of your industry.',
        },
        {
          id: 'b',
          text: '"The Kelly standard applies - the question is whether my methodology is generally accepted in my professional community."',
          correct: true,
          consequence:
            'Correct. You have accurately identified that California state courts apply Kelly, not Daubert. The judge proceeds to the substance of the challenge.',
          takeaway:
            'Knowing the applicable standard before you walk into the courtroom is not optional - and it is the same answer whether you are a physician, engineer, accountant, or digital forensics expert testifying in California state court with a novel methodology at issue.',
        },
        {
          id: 'c',
          text: '"Either standard could apply - it depends on the judge\'s preference."',
          correct: false,
          consequence:
            'Incorrect. The applicable standard is determined by jurisdiction, not judicial discretion. This answer signals a fundamental misunderstanding of evidentiary law.',
          takeaway:
            'The standard is jurisdictional, not discretionary. California state court = Kelly. Federal court and most other states = Daubert.',
        },
      ],
    },
    {
      id: 'cp2',
      title: 'Choice Point 2: "How do you respond to the Kelly challenge?"',
      prompt:
        'Opposing counsel argues that while your analytical tool has been published, it has not been adopted as standard practice by other professionals in your field.',
      redirectIfWrongCp1:
        'Let\'s assume you correctly identified that Kelly applies. Now - how do you respond to the challenge?',
      choices: [
        {
          id: 'a',
          text: '"My peer-reviewed publication establishes general acceptance."',
          correct: false,
          consequence:
            'Insufficient under Kelly. Publication demonstrates that your methodology entered the scientific or professional conversation - but general acceptance requires that the community has embraced it, not merely that you introduced it. Defense will argue this correctly, and the judge is likely to agree.',
          takeaway:
            'Under Kelly, general acceptance means the professional community has adopted the method - not just that one expert developed and published it. This standard applies equally to a novel clinical instrument, a proprietary engineering software tool, a new quantitative model, or an untested forensic analysis technique.',
        },
        {
          id: 'b',
          text: '"I will provide peer-reviewed literature showing growing adoption, usage data from practitioners in my field, and if available, testimony from colleagues who use this methodology - demonstrating it has gained acceptance since publication."',
          correct: true,
          consequence:
            'Correct approach. You are building an affirmative record of community acceptance that goes beyond your own authorship. This directly addresses the Kelly prong under attack and gives the court a basis to find general acceptance.',
          takeaway:
            'Anticipate Kelly challenges on novel or emerging methodologies before you accept the retention. If your method is newer, document its acceptance trail proactively - citations, adoption rates, professional standards references, and peer usage.',
        },
        {
          id: 'c',
          text: '"Sargon only applies to speculative opinions - my methodology is published and therefore not subject to exclusion."',
          correct: false,
          consequence:
            'Incorrect. Sargon reinforced judicial gatekeeping over speculative and analytically unsupported opinions - but the challenge here is a Kelly challenge to the general acceptance of your novel technique, which Sargon did not eliminate. An opinion resting on a methodology that lacks general acceptance remains vulnerable under Kelly regardless of whether it has been published.',
          takeaway:
            'Publication reduces admissibility risk but does not eliminate it. General community acceptance is the operative Kelly standard for novel techniques - and Sargon gives judges broad authority to exclude opinions that are speculative or analytically unsupported as well.',
        },
      ],
    },
  ],
  summaryPrinciples: [
    'Know your jurisdiction - Kelly in California state court; Daubert in federal court and the majority of other U.S. state courts',
    'Publication is not acceptance - community adoption of your novel technique is the standard, not authorship',
    'Build your admissibility defense before retention - document your methodology\'s acceptance trail proactively',
  ],
};

// ============================================================
// KNOWLEDGE CHECK
// 5 questions, pass score = 4/5, one retry allowed.
// Industry rotation: Q1 neutral, Q2 engineering, Q3 multi-industry,
// Q4 finance, Q5 digital forensics.
// ============================================================

export const PASS_SCORE = 4;
export const TOTAL_QUESTIONS = 5;

export const QUIZ_DATA = {
  questions: [
    {
      id: 'q1',
      text: 'In which court systems does the Daubert standard apply?',
      options: [
        { id: 'a', text: 'California state courts only', correct: false },
        {
          id: 'b',
          text: 'Federal courts and the majority of state courts nationwide',
          correct: true,
        },
        { id: 'c', text: 'Federal courts only', correct: false },
        { id: 'd', text: 'Only in criminal proceedings', correct: false },
      ],
      explanation:
        'Daubert v. Merrell Dow (1993) replaced Frye in federal courts and has since been adopted by the majority of U.S. states as their standard - or they apply a Daubert-influenced standard. California is a notable exception: California state courts apply the Kelly standard, not Daubert. A number of other states, including Illinois, Pennsylvania, and Washington, also retain Frye or Frye-influenced standards. Experts should always confirm which standard applies in the specific jurisdiction where they are testifying.',
    },
    {
      id: 'q2',
      text: 'A structural engineer plans to testify in a California state court construction defect case using a proprietary finite element analysis software he developed. The software has not been validated by independent engineers or adopted by others in his field. What is his greatest admissibility risk?',
      options: [
        { id: 'a', text: 'A Daubert challenge to his error rate', correct: false },
        {
          id: 'b',
          text: 'A Kelly challenge to the general acceptance of his novel methodology',
          correct: true,
        },
        {
          id: 'c',
          text: 'A Sargon challenge to the relevance of his opinion',
          correct: false,
        },
        {
          id: 'd',
          text: 'A Frye challenge to his qualifications as an engineer',
          correct: false,
        },
      ],
      explanation:
        'Under Kelly, general acceptance in the relevant professional community is required for novel scientific techniques. A proprietary software methodology developed by the expert but not independently validated or adopted by peers is a novel technique directly vulnerable to a Kelly challenge on the first prong. Note that Kelly applies here because the testimony relies on a novel analytical tool - not simply on the engineer\'s professional opinion.',
    },
    {
      id: 'q3',
      text: 'What did Kumho Tire v. Carmichael (1999) establish?',
      options: [
        {
          id: 'a',
          text: 'That Daubert applies only to scientific expert testimony',
          correct: false,
        },
        {
          id: 'b',
          text: 'That California courts must apply Daubert in all federal cases',
          correct: false,
        },
        {
          id: 'c',
          text: 'That Daubert applies to all expert testimony including technical, financial, and experience-based opinions',
          correct: true,
        },
        {
          id: 'd',
          text: 'That general acceptance is the only relevant factor under Daubert',
          correct: false,
        },
      ],
      explanation:
        'Kumho Tire extended Daubert beyond hard science to all forms of expert testimony. A forensic accountant\'s damages model, a cybersecurity analyst\'s attribution methodology, and a civil engineer\'s failure analysis are all subject to Daubert scrutiny in federal court and in the majority of state courts.',
    },
    {
      id: 'q4',
      text: 'A forensic accountant is retained as an expert in a federal court commercial litigation matter. Opposing counsel challenges her damages calculation model, arguing it has not been tested, has no known error rate, and is not used by other valuation professionals. Which standard will the judge apply, and what is the core question?',
      options: [
        {
          id: 'a',
          text: 'Kelly - whether her model is generally accepted in the forensic accounting community',
          correct: false,
        },
        {
          id: 'b',
          text: 'Daubert - whether her methodology is reliable and based on sufficient facts and data',
          correct: true,
        },
        {
          id: 'c',
          text: 'Frye - whether her calculations are generally accepted by financial experts',
          correct: false,
        },
        { id: 'd', text: 'Sargon - whether her opinion is speculative', correct: false },
      ],
      explanation:
        'Federal court applies Daubert. The judge will evaluate whether her methodology is reliable - including whether it has been tested, peer-reviewed, and is generally accepted. An untested, non-peer-reviewed damages model with no known error rate is highly vulnerable to Daubert exclusion.',
    },
    {
      id: 'q5',
      text: 'A cybersecurity expert plans to testify in a California state court case about the source of a data breach. She intends to use an attribution methodology - a novel analytical technique she developed - that is not documented in any NIST guidelines and has not been recognized by the peer forensic community. Under which standard will her testimony be evaluated, and what must she establish?',
      options: [
        {
          id: 'a',
          text: 'Daubert - she must show her methodology has been peer-reviewed and tested',
          correct: false,
        },
        {
          id: 'b',
          text: 'Kelly - she must show her novel attribution methodology is generally accepted in the relevant digital forensics community, that she is properly qualified, and that correct procedures were followed',
          correct: true,
        },
        {
          id: 'c',
          text: 'Frye - she must show general acceptance in any scientific community',
          correct: false,
        },
        {
          id: 'd',
          text: 'Sargon - she must show her opinion is not speculative',
          correct: false,
        },
      ],
      explanation:
        'California state court applies Kelly. Because she is relying on a novel analytical technique, Kelly applies. She must satisfy all three prongs: general acceptance of her attribution methodology in the digital forensics community, her own qualification to apply it, and correct application in this case. An unrecognized methodology with no NIST or peer community validation fails the first prong. Note that if she were offering a standard professional opinion rather than relying on a novel technique, Kelly/Frye would not apply - but a Sargon challenge to speculation or analytical gaps could still arise.',
    },
  ],
};
