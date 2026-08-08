import React from 'react';

/**
 * Reusable PageBackground component for TaxReview AI
 * Variants:
 * - 'hero': Main homepage hero background
 * - 'public': Features, Supported Docs, Tax Guide, Blog, FAQ, Developer, etc.
 * - 'auth': Login and Register pages
 * - 'app': Dashboard and authenticated application pages
 */
const PageBackground = ({ variant = 'public' }) => {
  if (variant === 'hero') {
    return (
      <div className="hero-bg-container">
        <div className="hero-glow-top-left" />
        <div className="hero-glow-top-right" />
        <div className="hero-glow-center" />
        <div className="hero-glow-bottom" />
        <div className="hero-grid-pattern" />
      </div>
    );
  }

  if (variant === 'auth') {
    return (
      <div className="page-bg-container">
        <div className="auth-bg-glow-center" />
        <div className="auth-grid-pattern" />
      </div>
    );
  }

  if (variant === 'app') {
    return (
      <div className="page-bg-container">
        <div className="app-bg-glow-top" />
        <div className="app-bg-glow-bottom" />
        <div className="app-grid-pattern" />
      </div>
    );
  }

  // Default 'public' variant
  return (
    <div className="page-bg-container">
      <div className="public-bg-glow-top" />
      <div className="public-bg-glow-bottom" />
      <div className="public-grid-pattern" />
    </div>
  );
};

export default PageBackground;
