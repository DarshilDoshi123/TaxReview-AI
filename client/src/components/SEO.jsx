import React, { useEffect } from 'react';

const SEO = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.png',
  schema
}) => {
  useEffect(() => {
    // 1. Title
    const formattedTitle = title ? `${title} | TaxReview AI` : 'TaxReview AI - AI Income Tax Auditing & Reviews';
    document.title = formattedTitle;

    // Helper to find or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to find or create link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Description
    const defaultDesc = 'Transform your income tax auditing with TaxReview AI. Automate document checks, detect tax risks, find missing deductions, and generate professional PDF audit reports instantly.';
    const finalDesc = description || defaultDesc;
    setMetaTag('name', 'description', finalDesc);

    // 3. Canonical Link
    const currentUrl = canonicalUrl || window.location.href;
    setLinkTag('canonical', currentUrl);

    // 4. Open Graph Meta Tags
    setMetaTag('property', 'og:title', title || 'TaxReview AI - AI Income Tax Auditing');
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

    // 5. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title || 'TaxReview AI - AI Income Tax Auditing');
    setMetaTag('name', 'twitter:description', finalDesc);
    setMetaTag('name', 'twitter:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

    // 6. JSON-LD Structured Data
    let scriptElement = document.getElementById('json-ld-structured-data');
    if (scriptElement) {
      scriptElement.remove();
    }

    if (schema) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'json-ld-structured-data';
      scriptElement.type = 'application/ld+json';
      scriptElement.innerHTML = JSON.stringify(schema);
      document.head.appendChild(scriptElement);
    }

    return () => {
      // Clean up injected structured data when component unmounts
      const scriptToRemove = document.getElementById('json-ld-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schema]);

  return null; // This component doesn't render any visible UI
};

export default SEO;
