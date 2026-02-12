import React from 'react';
import LegalPage from '../components/LegalPage';

function CookiePolicy() {
  return (
    <LegalPage title="Cookie Policy" effectiveDate="February 11, 2026">
      <section className="legal-section">
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how Veracity Expert Witness (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
          or &ldquo;our&rdquo;) uses cookies and similar tracking technologies when you visit our
          website at veracityexpertwitness.com (the &ldquo;Site&rdquo;). This policy should be read
          alongside our <a href="/privacy-policy">Privacy Policy</a>.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device (computer, tablet, or
          mobile phone) when you visit a website. They are widely used to make websites work
          more efficiently and to provide information to site owners. Cookies can be
          &ldquo;persistent&rdquo; (remaining on your device until deleted or expired) or &ldquo;session&rdquo;
          cookies (deleted when you close your browser).
        </p>
      </section>

      <section className="legal-section">
        <h2>3. How We Use Cookies</h2>
        <p>We use cookies and similar technologies for the following purposes:</p>

        <h3>3.1 Essential Cookies</h3>
        <p>
          These cookies are necessary for the Site to function properly. They enable basic
          features such as page navigation and access to secure areas of the Site. The Site
          cannot function properly without these cookies.
        </p>

        <h3>3.2 Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our Site by collecting
          and reporting information anonymously. This helps us improve the structure and
          content of the Site. We may use third-party analytics services such as Google
          Analytics to collect and analyze usage data.
        </p>

        <h3>3.3 Functional Cookies</h3>
        <p>
          These cookies enable the Site to remember choices you make (such as your preferred
          language or region) and provide enhanced, personalized features. They may be set
          by us or by third-party providers whose services we have added to our pages.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Third-Party Cookies</h2>
        <p>
          Some cookies on our Site are placed by third-party services that appear on our
          pages. We do not control these third-party cookies. The third-party services we
          may use include:
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> For website traffic analysis and usage patterns</li>
          <li><strong>Google Fonts:</strong> For typography rendering on the Site</li>
        </ul>
        <p>
          These third parties may use cookies to collect information about your online
          activities over time and across different websites. We encourage you to review
          the privacy policies of these third parties.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. You can
          typically set your browser to:
        </p>
        <ul>
          <li>Accept all cookies</li>
          <li>Notify you when a cookie is set</li>
          <li>Reject all cookies</li>
          <li>Delete cookies that have already been set</li>
        </ul>
        <p>
          Please note that if you disable or reject cookies, some parts of the Site may
          become inaccessible or not function properly. For more information about managing
          cookies in your browser, visit your browser&rsquo;s help documentation.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Do Not Track Signals</h2>
        <p>
          Some browsers include a &ldquo;Do Not Track&rdquo; (DNT) feature that signals to websites
          that you do not want your online activity tracked. Because there is no uniform
          standard for how DNT signals should be interpreted, our Site does not currently
          respond to DNT signals. However, you can manage your tracking preferences using
          the cookie controls described above.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. California Residents</h2>
        <p>
          If you are a California resident, you have additional rights under the California
          Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA) regarding
          the use of cookies and similar tracking technologies. Please refer to our{' '}
          <a href="/privacy-policy">Privacy Policy</a> for more information about your
          California privacy rights.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Changes to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our
          practices or for other operational, legal, or regulatory reasons. We will notify
          you of any material changes by posting the updated policy on this page and updating
          the &ldquo;Effective Date.&rdquo;
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies, please contact us at:
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

export default CookiePolicy;
