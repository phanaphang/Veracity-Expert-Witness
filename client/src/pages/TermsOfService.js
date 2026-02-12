import React from 'react';
import LegalPage from '../components/LegalPage';

function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="February 11, 2026">
      <section className="legal-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the website at veracityexpertwitness.com (the &ldquo;Site&rdquo;) and
          the expert witness referral services provided by Veracity Expert Witness
          (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these Terms of
          Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you may not access or use
          the Site or Services.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Description of Services</h2>
        <p>
          Veracity Expert Witness provides expert witness referral and matching services for
          legal professionals. Our Services include connecting attorneys and law firms with
          qualified expert witnesses across various fields and specializations. We facilitate
          introductions and provide coordination support but do not provide legal advice or
          expert testimony directly.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Eligibility</h2>
        <p>
          You must be at least 18 years of age and have the legal authority to enter into
          these Terms to use our Services. By using the Site, you represent and warrant that
          you meet these eligibility requirements.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. User Responsibilities</h2>
        <p>When using our Services, you agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information in any forms or communications</li>
          <li>Use the Services only for lawful purposes and in accordance with these Terms</li>
          <li>Not misrepresent your identity, credentials, or professional affiliations</li>
          <li>Not use the Services to transmit any harmful, threatening, or objectionable content</li>
          <li>Not attempt to interfere with the proper functioning of the Site or Services</li>
          <li>Maintain the confidentiality of any case-related information shared through our platform</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Expert Witness Referrals</h2>
        <p>
          We exercise professional judgment in matching expert witnesses with client needs.
          However, we do not guarantee the availability, qualifications, or performance of
          any expert witness. You are responsible for independently verifying the credentials,
          expertise, and suitability of any expert witness referred through our Services.
        </p>
        <p>
          The relationship between you and any expert witness is independent of Veracity
          Expert Witness. We are not a party to any engagement agreement between you and
          an expert witness and bear no responsibility for the terms, performance, or
          outcome of such engagements.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Confidentiality</h2>
        <p>
          We understand the sensitive nature of legal matters and treat all information
          shared with us as confidential. We will not disclose your case details, client
          information, or engagement specifics to any party other than potential expert
          witnesses being considered for your matter, unless required by law.
        </p>
        <p>
          You acknowledge that sharing case information with potential expert witnesses is
          necessary for the matching process and consent to such limited disclosure.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Intellectual Property</h2>
        <p>
          All content, features, and functionality on the Site &mdash; including text, graphics,
          logos, icons, images, and software &mdash; are the exclusive property of Veracity Expert
          Witness or its licensors and are protected by copyright, trademark, and other
          intellectual property laws. You may not reproduce, distribute, modify, or create
          derivative works from any content on the Site without our prior written consent.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, Veracity Expert Witness and its
          officers, directors, employees, and agents shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising out of or related
          to your use of or inability to use the Site or Services, including but not limited to:
        </p>
        <ul>
          <li>The performance or conduct of any expert witness referred through our Services</li>
          <li>Any errors or omissions in expert witness credentials or qualifications</li>
          <li>Any loss of data, profits, or business opportunities</li>
          <li>Any unauthorized access to or alteration of your transmissions or data</li>
        </ul>
        <p>
          Our total liability for any claims arising under these Terms shall not exceed the
          total fees paid by you to us in the twelve (12) months preceding the claim.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Veracity Expert Witness and its
          officers, directors, employees, and agents from and against any and all claims,
          liabilities, damages, losses, costs, and expenses (including reasonable attorneys&rsquo;
          fees) arising out of or related to your use of the Site or Services, your violation
          of these Terms, or your violation of any rights of a third party.
        </p>
      </section>

      <section className="legal-section">
        <h2>10. Disclaimer of Warranties</h2>
        <p>
          The Site and Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of
          any kind, whether express or implied, including but not limited to implied warranties
          of merchantability, fitness for a particular purpose, and non-infringement. We do
          not warrant that the Site will be uninterrupted, error-free, or free of viruses or
          other harmful components.
        </p>
      </section>

      <section className="legal-section">
        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the
          State of California, without regard to its conflict of law provisions. Any disputes
          arising under these Terms shall be resolved in the state or federal courts located
          in California, and you consent to the personal jurisdiction of such courts.
        </p>
      </section>

      <section className="legal-section">
        <h2>12. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify you of any
          material changes by posting the updated Terms on this page and updating the
          &ldquo;Effective Date.&rdquo; Your continued use of the Site or Services after any changes
          constitutes your acceptance of the revised Terms.
        </p>
      </section>

      <section className="legal-section">
        <h2>13. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;
