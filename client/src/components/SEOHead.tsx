import React, { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  structuredData?: object;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = "https://fitbite.app/og-image.jpg",
  ogType = "website",
  articleAuthor,
  articlePublishedTime,
  articleModifiedTime,
  structuredData
}: SEOHeadProps) {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]') ||
      document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', description);
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    // Set keywords if provided
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]') ||
        document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', keywords);
      if (!document.querySelector('meta[name="keywords"]')) {
        document.head.appendChild(metaKeywords);
      }
    }

    // Set canonical URL if provided
    if (canonical) {
      const linkCanonical = document.querySelector('link[rel="canonical"]') ||
        document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonical);
      if (!document.querySelector('link[rel="canonical"]')) {
        document.head.appendChild(linkCanonical);
      }
    }

    // Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonical || window.location.href },
      { property: 'og:site_name', content: 'FitBite - AI-Powered Global Diet Planner' }
    ];

    ogTags.forEach(({ property, content }) => {
      const existingTag = document.querySelector(`meta[property="${property}"]`) ||
        document.createElement('meta');
      existingTag.setAttribute('property', property);
      existingTag.setAttribute('content', content);
      if (!document.querySelector(`meta[property="${property}"]`)) {
        document.head.appendChild(existingTag);
      }
    });

    // Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
      { name: 'twitter:site', content: '@FitBiteApp' }
    ];

    twitterTags.forEach(({ name, content }) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`) ||
        document.createElement('meta');
      existingTag.setAttribute('name', name);
      existingTag.setAttribute('content', content);
      if (!document.querySelector(`meta[name="${name}"]`)) {
        document.head.appendChild(existingTag);
      }
    });

    // Article-specific meta tags
    if (ogType === "article") {
      if (articleAuthor) {
        const authorTag = document.querySelector('meta[property="article:author"]') ||
          document.createElement('meta');
        authorTag.setAttribute('property', 'article:author');
        authorTag.setAttribute('content', articleAuthor);
        if (!document.querySelector('meta[property="article:author"]')) {
          document.head.appendChild(authorTag);
        }
      }

      if (articlePublishedTime) {
        const publishedTag = document.querySelector('meta[property="article:published_time"]') ||
          document.createElement('meta');
        publishedTag.setAttribute('property', 'article:published_time');
        publishedTag.setAttribute('content', articlePublishedTime);
        if (!document.querySelector('meta[property="article:published_time"]')) {
          document.head.appendChild(publishedTag);
        }
      }

      if (articleModifiedTime) {
        const modifiedTag = document.querySelector('meta[property="article:modified_time"]') ||
          document.createElement('meta');
        modifiedTag.setAttribute('property', 'article:modified_time');
        modifiedTag.setAttribute('content', articleModifiedTime);
        if (!document.querySelector('meta[property="article:modified_time"]')) {
          document.head.appendChild(modifiedTag);
        }
      }
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // We don't actually remove them since we want to keep SEO tags
      // But this is where cleanup would happen if needed
    };
  }, [title, description, keywords, canonical, ogImage, ogType, articleAuthor, articlePublishedTime, articleModifiedTime, structuredData]);

  return null;
}