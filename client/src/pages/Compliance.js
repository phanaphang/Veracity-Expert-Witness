import React from 'react';
import LegalPage from '../components/LegalPage';

function Compliance() {
  return (
    <LegalPage title="Compliance" effectiveDate="February 11, 2026">
      <section className="legal-section">
        <h2>1. Our Commitment to Compliance</h2>
        <p>
          Veracity Expert Witness (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
          conducting our business in accordance with all applicable laws, regulations, and
          industry standards. This Compliance page outlines our approach to regulatory
          compliance across the key areas relevant to our expert witness referral services.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Data Privacy Compliance</h2>

        <h3>2.1 CCPA/CPRA Compliance</h3>
        <p>
          We comply with the California Consumer Privacy Act (CCPA) as amended by the
          California Privacy Rights Act (CPRA). This includes:
        </p>
        <ul>
          <li>Providing transparency about how we collect and use personal information</li>
          <li>Honoring consumer rights to know, delete, correct, and opt-out</li>
          <li>Maintaining reasonable security measures to protect personal data</li>
          <li>Not selling personal information to third parties</li>
          <li>Conducting regular privacy impact assessments</li>
        </ul>
        <p>
          For complete details on our privacy practices, please review our{' '}
          <a href="/privacy-policy">Privacy Policy</a>.
        </p>

        <h3>2.2 Data Protection Principles</h3>
        <p>Our data handling practices are guided by the following principles:</p>
        <ul>
          <li><strong>Data Minimization:</strong> We collect only the information necessary to provide our Services</li>
          <li><strong>Purpose Limitation:</strong> We use personal data only for the purposes for which it was collected</li>
          <li><strong>Storage Limitation:</strong> We retain data only as long as necessary for our business purposes</li>
          <li><strong>Integrity and Confidentiality:</strong> We implement appropriate security measures to protect data</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. HIPAA Awareness</h2>
        <p>
          While Veracity Expert Witness is not a covered entity under the Health Insurance
          Portability and Accountability Act (HIPAA), we recognize that case details shared
          with us may include protected health information (PHI). In such cases, we:
        </p>
        <ul>
          <li>Treat all health-related case information with the highest level of confidentiality</li>
          <li>Limit access to sensitive information to authorized personnel only</li>
          <li>Implement administrative, technical, and physical safeguards consistent with HIPAA standards</li>
          <li>Do not use or disclose health information for purposes unrelated to the engagement</li>
          <li>Securely dispose of health-related information when no longer needed</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Professional Ethics and Standards</h2>
        <p>
          We adhere to the highest standards of professional ethics in the expert witness
          referral industry:
        </p>
        <ul>
          <li><strong>Conflict of Interest:</strong> We screen for and disclose potential conflicts of interest in expert witness referrals</li>
          <li><strong>Credential Verification:</strong> We take reasonable steps to verify the qualifications and credentials of expert witnesses in our network</li>
          <li><strong>Impartiality:</strong> We provide objective referrals based on expertise and case requirements, not financial incentives</li>
          <li><strong>Confidentiality:</strong> We maintain strict confidentiality of all client and case information</li>
          <li><strong>Transparency:</strong> We are transparent about our processes, fees, and relationships with expert witnesses</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Information Security</h2>
        <p>We maintain a comprehensive information security program that includes:</p>
        <ul>
          <li><strong>Encryption:</strong> All data in transit is encrypted using industry-standard TLS/SSL protocols</li>
          <li><strong>Access Controls:</strong> Role-based access controls limit data access to authorized personnel</li>
          <li><strong>Secure Infrastructure:</strong> Our systems are hosted on secure, professionally managed infrastructure</li>
          <li><strong>Incident Response:</strong> We maintain procedures for identifying, responding to, and reporting security incidents</li>
          <li><strong>Vendor Management:</strong> We evaluate the security practices of third-party service providers</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Anti-Discrimination</h2>
        <p>
          Veracity Expert Witness is committed to non-discrimination in all aspects of our
          business. We do not discriminate on the basis of race, color, national origin,
          religion, sex, gender identity, sexual orientation, age, disability, or any other
          protected characteristic in:
        </p>
        <ul>
          <li>The provision of our Services to clients</li>
          <li>The selection and referral of expert witnesses</li>
          <li>Our employment and business practices</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>7. Regulatory Updates</h2>
        <p>
          We actively monitor changes in applicable laws and regulations to ensure our
          continued compliance. Our compliance practices are reviewed and updated regularly
          to reflect new legal requirements, industry best practices, and evolving standards.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Reporting Concerns</h2>
        <p>
          If you have any concerns about our compliance practices or wish to report a
          potential compliance issue, please contact us. We take all reports seriously and
          will investigate promptly.
        </p>
        <div className="contact-info-box">
          <p><strong>Veracity Expert Witness</strong></p>
          <p>Email: <a href="mailto:info@veracityexpertwitness.com">info@veracityexpertwitness.com</a></p>
          <p>Website: veracityexpertwitness.com</p>
        </div>
      </section>
    </LegalPage>
  );
}

export default Compliance;
