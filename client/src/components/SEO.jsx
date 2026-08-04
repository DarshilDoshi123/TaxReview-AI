import React, { useEffect } from 'react';
import { SITE_URL } from '../config/site';

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
    const defaultTitle = 'TaxReview AI - AI Income Tax Auditing & Reviews';
    const formattedTitle = title
      ? (title.includes('TaxReview AI') ? title : `${title} | TaxReview AI`)
      : defaultTitle;
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

    // Helper to format absolute URLs using SITE_URL configuration
    const toAbsoluteUrl = (pathOrUrl) => {
      if (!pathOrUrl) {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        return `${SITE_URL}${path}`;
      }
      if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
      return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
    };

    // 2. Description
    const defaultDesc = 'Transform your income tax auditing with TaxReview AI. Automate document checks, detect tax risks, find missing deductions, and generate professional PDF audit reports instantly.';
    const finalDesc = description || defaultDesc;
    setMetaTag('name', 'description', finalDesc);

    // 3. Canonical Link
    const currentUrl = toAbsoluteUrl(canonicalUrl);
    setLinkTag('canonical', currentUrl);

    // 4. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', 'TaxReview AI');
    setMetaTag('property', 'og:title', title || defaultTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', toAbsoluteUrl(ogImage));

    // 5. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title || defaultTitle);
    setMetaTag('name', 'twitter:description', finalDesc);
    setMetaTag('name', 'twitter:image', toAbsoluteUrl(ogImage));

    // 6. JSON-LD Structured Data - Single source of truth in-place tag management
    let scriptElement = document.getElementById('json-ld-structured-data');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'json-ld-structured-data';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    const defaultSchema = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "TaxReview AI",
        "url": "https://tax-review-ai.vercel.app",
        "inLanguage": "en",
        "publisher": {
          "@type": "Organization",
          "name": "TaxReview AI",
          "url": "https://tax-review-ai.vercel.app",
          "logo": "https://tax-review-ai.vercel.app/android-chrome-512x512.png"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "TaxReview AI",
        "url": "https://tax-review-ai.vercel.app",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "description": "AI-powered income tax auditing and document review platform that analyzes tax documents, identifies issues, provides compliance insights, and generates intelligent recommendations.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      }
    ];

    const finalSchema = schema || defaultSchema;
    if (finalSchema) {
      scriptElement.innerHTML = JSON.stringify(finalSchema, null, 2);
    }
  }, [title, description, canonicalUrl, ogType, ogImage, schema]);

  return null; // This component doesn't render any visible UI
};

export default SEO;
