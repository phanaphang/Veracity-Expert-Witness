import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';

const PAGE_WIDTH = 210;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;

function addPageIfNeeded(doc, y, needed = 20) {
  if (y + needed > 275) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function sectionHeader(doc, y, title) {
  y = addPageIfNeeded(doc, y, 16);
  y += 4;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title, MARGIN, y);
  y += 2;
  doc.setDrawColor(180);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += LINE_HEIGHT;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  return y;
}

function addWrappedText(doc, y, text, fontSize = 10) {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    y = addPageIfNeeded(doc, y);
    doc.text(line, MARGIN, y);
    y += LINE_HEIGHT;
  }
  return y;
}

function addField(doc, y, label, value) {
  if (!value) return y;
  y = addPageIfNeeded(doc, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${label}: `, MARGIN, y);
  const labelWidth = doc.getTextWidth(`${label}: `);
  doc.setFont('helvetica', 'normal');
  const remaining = CONTENT_WIDTH - labelWidth;
  const lines = doc.splitTextToSize(String(value), remaining);
  doc.text(lines[0], MARGIN + labelWidth, y);
  y += LINE_HEIGHT;
  for (let i = 1; i < lines.length; i++) {
    y = addPageIfNeeded(doc, y);
    doc.text(lines[i], MARGIN, y);
    y += LINE_HEIGHT;
  }
  return y;
}

function buildProfilePdf(expert, specialties, education, experience, credentials, testimony, documents) {
  const doc = new jsPDF();
  let y = MARGIN;

  // Header
  const name = expert.first_name
    ? `${expert.first_name} ${expert.last_name || ''}`.trim()
    : expert.email;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(name, MARGIN, y);
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Expert Witness Profile', MARGIN, y);
  y += LINE_HEIGHT;
  doc.setTextColor(0);

  // Basic Info
  y = sectionHeader(doc, y, 'Basic Information');
  y = addField(doc, y, 'Email', expert.email);
  y = addField(doc, y, 'Phone', expert.phone);
  y = addField(doc, y, 'Status', expert.profile_status || 'pending');
  y = addField(doc, y, 'Availability', expert.availability);
  if (expert.rate_review_report) y = addField(doc, y, 'Rate - Review & Report', `$${expert.rate_review_report}/hr`);
  if (expert.rate_deposition) y = addField(doc, y, 'Rate - Deposition', `$${expert.rate_deposition}/hr`);
  if (expert.rate_trial_testimony) y = addField(doc, y, 'Rate - Trial Testimony', `$${expert.rate_trial_testimony}/hr`);
  if (expert.bio) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Bio:', MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont('helvetica', 'normal');
    y = addWrappedText(doc, y, expert.bio);
  }

  // Specialties
  if (specialties.length > 0) {
    y = sectionHeader(doc, y, 'Specialties');
    for (const s of specialties) {
      y = addPageIfNeeded(doc, y);
      doc.text(`  •  ${s}`, MARGIN, y);
      y += LINE_HEIGHT;
    }
  }

  // Credentials
  if (credentials.length > 0) {
    y = sectionHeader(doc, y, 'Credentials');
    for (const cred of credentials) {
      y = addPageIfNeeded(doc, y, 18);
      doc.setFont('helvetica', 'bold');
      doc.text(cred.name || '', MARGIN, y);
      doc.setFont('helvetica', 'normal');
      if (cred.credential_type) {
        doc.setTextColor(100);
        doc.text(`  [${cred.credential_type}]`, MARGIN + doc.getTextWidth((cred.name || '') + ' '), y);
        doc.setTextColor(0);
      }
      y += LINE_HEIGHT;
      if (cred.issuing_body) {
        y = addField(doc, y, '  Issuing Body', cred.issuing_body);
      }
      if (cred.credential_number) {
        y = addField(doc, y, '  Number', cred.credential_number);
      }
      y += 2;
    }
  }

  // Education
  if (education.length > 0) {
    y = sectionHeader(doc, y, 'Education');
    for (const edu of education) {
      y = addPageIfNeeded(doc, y, 14);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree || '', MARGIN, y);
      doc.setFont('helvetica', 'normal');
      const inst = edu.institution ? ` — ${edu.institution}` : '';
      const field = edu.field_of_study ? `, ${edu.field_of_study}` : '';
      doc.text(`${inst}${field}`, MARGIN + doc.getTextWidth((edu.degree || '') + ' '), y);
      y += LINE_HEIGHT;
      const years = [edu.start_year, edu.end_year || 'Present'].filter(Boolean).join(' – ');
      if (years) {
        doc.setTextColor(120);
        doc.text(`  ${years}`, MARGIN, y);
        doc.setTextColor(0);
        y += LINE_HEIGHT;
      }
      y += 2;
    }
  }

  // Work Experience
  if (experience.length > 0) {
    y = sectionHeader(doc, y, 'Work Experience');
    for (const exp of experience) {
      y = addPageIfNeeded(doc, y, 16);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.title || '', MARGIN, y);
      doc.setFont('helvetica', 'normal');
      const org = exp.organization ? ` at ${exp.organization}` : '';
      doc.text(org, MARGIN + doc.getTextWidth((exp.title || '') + ' '), y);
      if (exp.is_current) {
        doc.setTextColor(40, 140, 40);
        doc.text('  (Current)', MARGIN + doc.getTextWidth((exp.title || '') + ' ' + org + ' '), y);
        doc.setTextColor(0);
      }
      y += LINE_HEIGHT;
      if (exp.description) {
        y = addWrappedText(doc, y, exp.description, 9);
      }
      y += 2;
    }
  }

  // Prior Testimony
  const retainedTotal = testimony.filter(t => t.retained_by && t.retained_by !== '').length;
  let testimonyTitle = `Prior Expert Testimony (${testimony.length})`;
  if (retainedTotal > 0) {
    const rc = { plaintiff: 0, defendant: 0, other: 0 };
    testimony.forEach(t => { if (t.retained_by && rc[t.retained_by] !== undefined) rc[t.retained_by]++; });
    const pct = (n) => Math.round((n / retainedTotal) * 100);
    testimonyTitle += `  —  Plaintiff ${pct(rc.plaintiff)}% | Defendant ${pct(rc.defendant)}% | Other ${pct(rc.other)}%`;
  }
  y = sectionHeader(doc, y, testimonyTitle);
  if (testimony.length === 0) {
    doc.setTextColor(120);
    doc.text('No prior testimony on record', MARGIN, y);
    doc.setTextColor(0);
    y += LINE_HEIGHT;
  } else {
    for (const t of testimony) {
      y = addPageIfNeeded(doc, y, 20);
      doc.setFont('helvetica', 'bold');
      doc.text(t.case_name || '', MARGIN, y);
      doc.setFont('helvetica', 'normal');
      if (t.retained_by) {
        doc.text(`  [${t.retained_by}]`, MARGIN + doc.getTextWidth((t.case_name || '') + ' '), y);
      }
      y += LINE_HEIGHT;
      if (t.court || t.jurisdiction) {
        doc.setTextColor(100);
        const courtLine = [t.court, t.jurisdiction].filter(Boolean).join(' — ');
        doc.text(courtLine, MARGIN, y);
        doc.setTextColor(0);
        y += LINE_HEIGHT;
      }
      if (t.topic) {
        y = addField(doc, y, '  Topic', t.topic);
      }
      if (t.date_of_testimony) {
        doc.setTextColor(120);
        doc.text(`  ${new Date(t.date_of_testimony).toLocaleDateString()}`, MARGIN, y);
        doc.setTextColor(0);
        y += LINE_HEIGHT;
      }
      y += 2;
    }
  }

  // Documents list
  if (documents.length > 0) {
    y = sectionHeader(doc, y, `Attached Documents (${documents.length})`);
    for (const d of documents) {
      y = addPageIfNeeded(doc, y);
      doc.text(`  •  ${d.file_name}`, MARGIN, y);
      if (d.document_type) {
        doc.setTextColor(100);
        doc.text(`  (${d.document_type})`, MARGIN + doc.getTextWidth(`  •  ${d.file_name} `), y);
        doc.setTextColor(0);
      }
      y += LINE_HEIGHT;
    }
  }

  return doc.output('arraybuffer');
}

async function fetchDocumentBytes(doc, supabase) {
  try {
    const { data } = await supabase.storage
      .from('expert-documents')
      .createSignedUrl(doc.file_path, 60);
    if (!data?.signedUrl) return null;
    const resp = await fetch(data.signedUrl);
    if (!resp.ok) return null;
    return new Uint8Array(await resp.arrayBuffer());
  } catch {
    return null;
  }
}

function getFileExtension(filename) {
  return (filename || '').split('.').pop().toLowerCase();
}

async function mergeDocuments(profileBytes, documents, supabase) {
  const merged = await PDFDocument.load(profileBytes);

  for (const doc of documents) {
    const bytes = await fetchDocumentBytes(doc, supabase);
    if (!bytes) continue;

    const ext = getFileExtension(doc.file_name);

    if (ext === 'pdf') {
      try {
        const donor = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(donor, donor.getPageIndices());
        for (const page of pages) merged.addPage(page);
      } catch (e) {
        console.warn(`Could not merge PDF: ${doc.file_name}`, e);
      }
    } else if (['jpg', 'jpeg'].includes(ext)) {
      try {
        const img = await merged.embedJpg(bytes);
        const page = merged.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      } catch (e) {
        console.warn(`Could not embed JPEG: ${doc.file_name}`, e);
      }
    } else if (ext === 'png') {
      try {
        const img = await merged.embedPng(bytes);
        const page = merged.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      } catch (e) {
        console.warn(`Could not embed PNG: ${doc.file_name}`, e);
      }
    }
  }

  return merged.save();
}

function triggerDownload(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generateExpertPdf(expert, specialties, education, experience, credentials, testimony, documents, supabase) {
  const profileBytes = buildProfilePdf(expert, specialties, education, experience, credentials, testimony, documents);

  let finalBytes;
  if (documents.length > 0) {
    finalBytes = await mergeDocuments(profileBytes, documents, supabase);
  } else {
    finalBytes = profileBytes;
  }

  const name = expert.first_name
    ? `${expert.first_name}_${expert.last_name || ''}`.trim().replace(/\s+/g, '_')
    : 'expert';
  triggerDownload(finalBytes, `${name}_Profile.pdf`);
}
