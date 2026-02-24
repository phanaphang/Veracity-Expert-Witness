-- ============================================================
-- Migration: Subspecialty Categorization + Expert Tags
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Add parent_id to specialties (enables two-tier taxonomy)
-- ------------------------------------------------------------
ALTER TABLE specialties ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES specialties(id) ON DELETE CASCADE;

-- ------------------------------------------------------------
-- 2. Add free-text tags array to profiles
-- ------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- ------------------------------------------------------------
-- 3. Seed subspecialties (72 total, linked to parent by name)
-- ------------------------------------------------------------

-- MEDICAL & HEALTHCARE (12 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Medical & Healthcare')
FROM (VALUES
  ('Medical Malpractice',                    'medical-malpractice'),
  ('Orthopedic Surgery',                     'orthopedic-surgery'),
  ('Neurology & Neurosurgery',               'neurology-neurosurgery'),
  ('Cardiology',                             'cardiology'),
  ('Radiology & Diagnostic Imaging',         'radiology-diagnostic-imaging'),
  ('Psychiatry & Psychology',                'psychiatry-psychology'),
  ('Nursing Standard of Care',               'nursing-standard-of-care'),
  ('Pharmacy & Toxicology',                  'pharmacy-toxicology'),
  ('Emergency Medicine',                     'emergency-medicine'),
  ('Oncology',                               'oncology'),
  ('Pain Management',                        'pain-management'),
  ('Life Care Planning & Medical Economics', 'life-care-planning-medical-economics')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- FINANCIAL & ACCOUNTING (9 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Financial & Accounting')
FROM (VALUES
  ('Forensic Accounting',          'forensic-accounting'),
  ('Business Valuation',           'business-valuation'),
  ('Economic Damages',             'economic-damages'),
  ('Securities & Investments',     'securities-investments'),
  ('Banking & Lending',            'banking-lending'),
  ('Tax',                          'tax'),
  ('Insurance',                    'insurance'),
  ('Real Estate Finance',          'real-estate-finance'),
  ('Bankruptcy & Restructuring',   'bankruptcy-restructuring')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- TECHNOLOGY & CYBER (9 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Technology & Cyber')
FROM (VALUES
  ('Cybersecurity',                          'cybersecurity'),
  ('Digital Forensics',                      'digital-forensics'),
  ('Software & Technology',                  'software-technology'),
  ('IP & Trade Secrets (Tech)',              'ip-trade-secrets-tech'),
  ('Data Privacy & Compliance',             'data-privacy-compliance'),
  ('Electronic Discovery',                   'electronic-discovery'),
  ('Internet & E-Commerce',                  'internet-ecommerce'),
  ('Artificial Intelligence & Emerging Tech','artificial-intelligence-emerging-tech'),
  ('Telecommunications',                     'telecommunications')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- CONSTRUCTION & ENGINEERING (9 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Construction & Engineering')
FROM (VALUES
  ('Construction Defects',           'construction-defects'),
  ('Structural Engineering',         'structural-engineering'),
  ('Construction Delays & Disputes', 'construction-delays-disputes'),
  ('Civil Engineering',              'civil-engineering'),
  ('Mechanical & Electrical Systems','mechanical-electrical-systems'),
  ('Geotechnical Engineering',       'geotechnical-engineering'),
  ('Building Codes & Standards',     'building-codes-standards'),
  ('Construction Safety',            'construction-safety'),
  ('Project Management',             'project-management')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- ENVIRONMENTAL SCIENCE (8 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Environmental Science')
FROM (VALUES
  ('Environmental Contamination',     'environmental-contamination'),
  ('Toxic Exposure & Health',         'toxic-exposure-health'),
  ('Water Resources',                 'water-resources'),
  ('Air Quality',                     'air-quality'),
  ('Environmental Compliance',        'environmental-compliance'),
  ('Ecological Assessment',           'ecological-assessment'),
  ('Environmental Site Assessment',   'environmental-site-assessment'),
  ('Geology & Earth Science',         'geology-earth-science')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- INTELLECTUAL PROPERTY (8 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Intellectual Property')
FROM (VALUES
  ('Patent Litigation',         'patent-litigation'),
  ('Trade Secrets',             'trade-secrets'),
  ('Trademark & Brand',         'trademark-brand'),
  ('Copyright',                 'copyright'),
  ('IP Damages & Valuation',    'ip-damages-valuation'),
  ('Technology Patents',        'technology-patents'),
  ('Life Sciences Patents',     'life-sciences-patents'),
  ('IP Licensing & Transactions','ip-licensing-transactions')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- ACCIDENT RECONSTRUCTION (8 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Accident Reconstruction')
FROM (VALUES
  ('Vehicle Accident Reconstruction',  'vehicle-accident-reconstruction'),
  ('Pedestrian & Bicycle Accidents',   'pedestrian-bicycle-accidents'),
  ('Commercial & Industrial Accidents','commercial-industrial-accidents'),
  ('Biomechanics & Injury Causation',  'biomechanics-injury-causation'),
  ('Vehicle Systems & Defects',        'vehicle-systems-defects'),
  ('Highway & Road Design',            'highway-road-design'),
  ('Event Data & Digital Evidence',    'event-data-digital-evidence'),
  ('Aviation & Marine Accidents',      'aviation-marine-accidents')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- FORENSIC ANALYSIS (9 subspecialties)
INSERT INTO specialties (name, slug, parent_id)
SELECT name, slug, (SELECT id FROM specialties WHERE name = 'Forensic Analysis')
FROM (VALUES
  ('DNA & Biological Evidence',       'dna-biological-evidence'),
  ('Forensic Pathology',              'forensic-pathology'),
  ('Questioned Documents',            'questioned-documents'),
  ('Fire & Explosion Investigation',  'fire-explosion-investigation'),
  ('Firearms & Toolmarks',            'firearms-toolmarks'),
  ('Trace Evidence',                  'trace-evidence'),
  ('Forensic Chemistry & Toxicology', 'forensic-chemistry-toxicology'),
  ('Crime Scene Analysis',            'crime-scene-analysis'),
  ('Forensic Engineering',            'forensic-engineering')
) AS t(name, slug)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Verify: should show 8 parents + 72 subspecialties = 80 rows
-- ============================================================
-- SELECT
--   CASE WHEN parent_id IS NULL THEN 'Parent' ELSE 'Subspecialty' END AS tier,
--   COUNT(*) AS count
-- FROM specialties
-- GROUP BY tier;
