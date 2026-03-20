import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Veracity Expert Witness LLC';
const BASE_URL = 'https://veracityexpertwitness.com';
const DEFAULT_IMAGE = `${BASE_URL}/logo-dark.svg`;

function SEO({ title, description, path = '/', image = DEFAULT_IMAGE, serviceSchema }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Qualified Expert Witnesses for Legal Cases`;
  const canonical = `${BASE_URL}${path}`;

  const breadcrumbSchema = title ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: title, item: canonical },
    ],
  }) : null;

  const serviceJsonLd = serviceSchema ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: serviceSchema.serviceType,
    provider: {
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      url: BASE_URL,
    },
    areaServed: { '@type': 'Country', name: 'United States' },
    description: description,
    url: canonical,
  }) : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {breadcrumbSchema && (
        <script type="application/ld+json">{breadcrumbSchema}</script>
      )}
      {serviceJsonLd && (
        <script type="application/ld+json">{serviceJsonLd}</script>
      )}
    </Helmet>
  );
}

export default SEO;
