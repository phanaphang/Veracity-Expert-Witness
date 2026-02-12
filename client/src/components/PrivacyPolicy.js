import React, { useEffect } from 'react';

function PrivacyPolicy({ onNavigateHome }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy">
      <div className="privacy__header">
        <div className="section__container">
          <a href="/" className="privacy__back" onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}>&larr; Back to Home</a>
          <h1 className="privacy__title">Privacy Policy</h1>
          <p className="privacy__effective">Effective Date: February 11, 2026</p>
        </div>
      </div>

      <div className="section__container">
        <div className="privacy__content">

          <section className="privacy__section">
            <h2>1. Introduction</h2>
            <p>
              Veracity Expert Witness ("Company," "we," "us," or "our") is committed to protecting
              your privacy and ensuring the security of your personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit
              our website at veracityexpertwitness.com (the "Site") or use our expert witness referral
              services (the "Services").
            </p>
            <p>
              This Privacy Policy is designed to comply with the California Consumer Privacy Act
              (CCPA) as amended by the California Privacy Rights Act (CPRA), and other applicable
              privacy laws. If you are a California resident, please see Section 8 for additional
              rights specific to you.
            </p>
          </section>

          <section className="privacy__section">
            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide Directly</h3>
            <p>When you use our contact form or otherwise interact with us, we may collect:</p>
            <ul>
              <li><strong>Contact Information:</strong> Your name, email address, and phone number</li>
              <li><strong>Professional Information:</strong> Your law firm or organization name</li>
              <li><strong>Service Details:</strong> The area of expertise you are seeking and case details you provide</li>
              <li><strong>Communications:</strong> Any messages, inquiries, or correspondence you send to us</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>When you visit our Site, we may automatically collect:</p>
            <ul>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, referring URLs, and click patterns</li>
              <li><strong>Network Information:</strong> IP address and approximate geographic location</li>
            </ul>

            <h3>2.3 Categories of Personal Information (CCPA)</h3>
            <p>Under the CCPA, we collect the following categories of personal information:</p>
            <ul>
              <li><strong>Identifiers:</strong> Name, email address, phone number, IP address</li>
              <li><strong>Professional or Employment-Related Information:</strong> Firm name, professional role</li>
              <li><strong>Internet or Other Electronic Network Activity:</strong> Browsing history on our Site, search history, interaction with our Site</li>
              <li><strong>Geolocation Data:</strong> Approximate location derived from IP address</li>
            </ul>
          </section>

          <section className="privacy__section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following business purposes:</p>
            <ul>
              <li>To provide, operate, and maintain our expert witness referral Services</li>
              <li>To respond to your inquiries and fulfill your requests</li>
              <li>To match you with appropriate expert witnesses based on your case needs</li>
              <li>To communicate with you about our Services, including follow-up correspondence</li>
              <li>To improve, personalize, and optimize our Site and Services</li>
              <li>To detect, prevent, and address fraud, security issues, or technical problems</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="privacy__section">
            <h2>4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>Expert Witnesses:</strong> We may share relevant case details with potential expert witnesses to facilitate the matching process. This sharing is limited to information necessary for evaluating the engagement.</li>
              <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our Site and Services (e.g., email hosting, analytics), subject to confidentiality obligations.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or governmental regulation, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction.</li>
            </ul>
          </section>

          <section className="privacy__section">
            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              for which it was collected, including to satisfy legal, accounting, or reporting
              requirements. Contact form submissions are typically retained for the duration of any
              active engagement and for a reasonable period thereafter for follow-up and legal
              compliance purposes.
            </p>
            <p>
              When personal information is no longer needed, we will securely delete or anonymize it
              in accordance with our data retention policies.
            </p>
          </section>

          <section className="privacy__section">
            <h2>6. Data Security</h2>
            <p>
              We implement commercially reasonable administrative, technical, and physical safeguards
              designed to protect your personal information from unauthorized access, use, alteration,
              and disclosure. These measures include encryption of data in transit, secure server
              infrastructure, and access controls.
            </p>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100%
              secure. While we strive to use commercially acceptable means to protect your personal
              information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="privacy__section">
            <h2>7. Sensitive Information &amp; HIPAA Compliance</h2>
            <p>
              In the course of providing expert witness referral services, we may receive case
              details that include sensitive or health-related information. We treat all case
              information as confidential and handle it with the highest level of care.
            </p>
            <p>
              Where applicable, we follow the principles of the Health Insurance Portability and
              Accountability Act (HIPAA) and take appropriate measures to protect any protected
              health information (PHI) that may be disclosed to us. We limit access to sensitive
              information to personnel who require it to fulfill your request and maintain
              appropriate safeguards consistent with HIPAA standards.
            </p>
          </section>

          <section className="privacy__section">
            <h2>8. Your California Privacy Rights (CCPA/CPRA)</h2>
            <p>
              If you are a California resident, you have the following rights under the CCPA as
              amended by the CPRA:
            </p>

            <h3>8.1 Right to Know</h3>
            <p>
              You have the right to request that we disclose the categories and specific pieces of
              personal information we have collected about you, the categories of sources from which
              your information was collected, the business or commercial purposes for collecting your
              information, and the categories of third parties with whom we share your information.
            </p>

            <h3>8.2 Right to Delete</h3>
            <p>
              You have the right to request that we delete the personal information we have collected
              from you, subject to certain exceptions provided by law (e.g., if the information is
              needed to complete a transaction, detect security incidents, or comply with a legal
              obligation).
            </p>

            <h3>8.3 Right to Correct</h3>
            <p>
              You have the right to request that we correct any inaccurate personal information we
              maintain about you.
            </p>

            <h3>8.4 Right to Opt-Out of Sale or Sharing</h3>
            <p>
              We do not sell your personal information. We do not share your personal information
              for cross-context behavioral advertising. As such, there is no need to opt out.
              If our practices change in the future, we will update this policy and provide a
              "Do Not Sell or Share My Personal Information" link.
            </p>

            <h3>8.5 Right to Limit Use of Sensitive Personal Information</h3>
            <p>
              To the extent we collect sensitive personal information, we only use it for purposes
              authorized under the CPRA (i.e., to provide the Services you have requested). You have
              the right to limit our use of sensitive personal information to these purposes.
            </p>

            <h3>8.6 Right to Non-Discrimination</h3>
            <p>
              We will not discriminate against you for exercising any of your CCPA/CPRA rights.
              We will not deny you goods or services, charge you different prices, provide a
              different level or quality of services, or suggest that you will receive a different
              price or quality of services for exercising your rights.
            </p>

            <h3>8.7 How to Exercise Your Rights</h3>
            <p>
              To exercise any of these rights, please contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:info@veracityexpertwitness.com">info@veracityexpertwitness.com</a></li>
            </ul>
            <p>
              We will verify your identity before fulfilling any request. We will respond to
              verifiable consumer requests within 45 days of receipt. If we need additional time
              (up to 90 days total), we will inform you of the reason and extension period in
              writing. You may designate an authorized agent to submit requests on your behalf.
            </p>
          </section>

          <section className="privacy__section">
            <h2>9. Cookies and Tracking Technologies</h2>
            <p>
              Our Site may use cookies and similar tracking technologies to enhance your experience.
              You can control cookies through your browser settings. Disabling cookies may affect
              the functionality of certain features of our Site.
            </p>
          </section>

          <section className="privacy__section">
            <h2>10. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites or services that are not operated
              by us. We have no control over, and assume no responsibility for, the content, privacy
              policies, or practices of any third-party sites or services. We encourage you to
              review the privacy policy of every site you visit.
            </p>
          </section>

          <section className="privacy__section">
            <h2>11. Children's Privacy</h2>
            <p>
              Our Services are not directed to individuals under the age of 18. We do not knowingly
              collect personal information from children. If we become aware that we have collected
              personal information from a child without parental consent, we will take steps to
              delete that information.
            </p>
          </section>

          <section className="privacy__section">
            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new Privacy Policy on this page and updating the "Effective Date"
              at the top. Your continued use of our Site and Services after any changes constitutes
              your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="privacy__section">
            <h2>13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, wish to exercise your privacy
              rights, or have concerns about how we handle your personal information, please
              contact us at:
            </p>
            <div className="privacy__contact-info">
              <p><strong>Veracity Expert Witness</strong></p>
              <p>Email: <a href="mailto:info@veracityexpertwitness.com">info@veracityexpertwitness.com</a></p>
              <p>Website: veracityexpertwitness.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
