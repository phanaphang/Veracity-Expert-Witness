import React from 'react';
import LegalPage from '../components/LegalPage';

function CookiePolicy() {
  return (
    <LegalPage title="Cookie Policy" effectiveDate="February 11, 2026" description="Learn how Veracity Expert Witness uses cookies and similar technologies on our website, and how you can manage your cookie preferences." path="/cookie-policy">
      <section className="legal-section">
        <h2>1. About This Policy</h2>
        <p>
          This Cookie Policy explains how Veracity Expert Witness (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          uses cookies on veracityexpertwitness.com. Please read this alongside our{' '}
          <a href="/privacy-policy">Privacy Policy</a>.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They
          help websites work properly and provide information to site owners. Cookies can be
          &ldquo;persistent&rdquo; (staying on your device until deleted) or &ldquo;session&rdquo; cookies (deleted
          when you close your browser).
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Cookies We Use</h2>

        <h3>Essential Cookies</h3>
        <p>
          These are necessary for the Site to work. They handle things like page navigation
          and security. Because they are essential, they do not require your consent.
        </p>

        <h3>Analytics Cookies</h3>
        <p>
          These help us understand how visitors use our Site so we can improve it. We may use
          services like Google Analytics. These cookies are only placed with your consent.
        </p>

        <h3>Functional Cookies</h3>
        <p>
          These remember your preferences (like language settings) to give you a better
          experience. They are only placed with your consent.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Your Consent</h2>
        <p>We believe in fair cookie practices:</p>
        <ul>
          <li>Closing or ignoring a cookie notice does not count as consent</li>
          <li>&ldquo;Accept&rdquo; and &ldquo;Decline&rdquo; options are always equally visible and easy to use</li>
          <li>Declining cookies takes the same number of steps as accepting them</li>
          <li>You can change your preferences at any time</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>5. Third-Party Cookies</h2>
        <p>
          Some cookies may be placed by third-party services we use, including:
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> Helps us understand how visitors use the Site</li>
          <li><strong>Google Fonts:</strong> Provides the fonts used on the Site</li>
        </ul>
        <p>
          We encourage you to review these third parties&rsquo; privacy policies. Third-party
          cookies are only placed with your consent, except where necessary for Site
          functionality.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Managing Your Cookie Preferences</h2>
        <p>You can control cookies in several ways:</p>
        <ul>
          <li><strong>Browser Settings:</strong> Most browsers let you block or delete cookies through their settings</li>
          <li><strong>Global Privacy Control (GPC):</strong> We honor GPC signals from your browser as a request to opt out of non-essential tracking</li>
        </ul>
        <p>
          If you block cookies, some parts of the Site may not work properly.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. California Residents</h2>
        <p>
          If you are a California resident, you have rights under the CCPA/CPRA regarding
          cookies and tracking, including the right to know what information is collected,
          opt out of tracking, and request deletion. See our{' '}
          <a href="/privacy-policy">Privacy Policy</a> for details.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Changes will be posted on this
          page with an updated effective date.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Contact Us</h2>
        <p>
          Questions about cookies? Contact us:
        </p>
        <div className="contact-info-box">
          <p><strong>Veracity Expert Witness</strong></p>
          <p>Los Angeles, California</p>
          <p>Email: <a href="mailto:info@veracityexpertwitness.com">info@veracityexpertwitness.com</a></p>
          <p>Website: veracityexpertwitness.com</p>
        </div>
      </section>
    </LegalPage>
  );
}

export default CookiePolicy;
