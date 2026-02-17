import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Veracity Expert Witness';
const BASE_URL = 'https://veracityexpertwitness.com';

function SEO({ title, description, path = '/' }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Qualified Expert Witnesses for Legal Cases`;
  const canonical = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

export default SEO;
