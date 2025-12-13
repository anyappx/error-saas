import { KubernetesError } from './schema'

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: any;
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
  h1: string;
  h2: string[];
  h3: string[];
  canonical: string;
}

export class K8SEOEngine {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://k8s-errors.dev';

  generateErrorSEO(error: KubernetesError): SEOMetadata {
    const title = `${error.title} - Kubernetes Error Fix Guide | K8s Troubleshooting`;
    const description = `${error.summary} Complete step-by-step fix guide, root causes analysis, and prevention tips for ${error.title} Kubernetes error.`;
    
    const keywords = [
      'kubernetes error',
      'k8s troubleshooting',
      'kubernetes debugging',
      error.canonical_slug,
      ...error.aliases,
      `${error.category} errors`,
      'container orchestration',
      'devops',
      'kubectl error',
      'pod troubleshooting'
    ];

    const canonical = `${this.baseUrl}/kubernetes/errors/${error.canonical_slug}`;
    const ogImage = `${this.baseUrl}/api/og/error/${error.canonical_slug}`;

    const breadcrumbs = [
      { name: 'Home', url: this.baseUrl },
      { name: 'Kubernetes Errors', url: `${this.baseUrl}/kubernetes/errors` },
      { name: error.title, url: canonical }
    ];

    const h2Sections = [
      'Root Causes & Analysis',
      'Step-by-Step Fix Guide',
      'Prevention Strategies',
      'Real-World Examples',
      'Related Kubernetes Errors'
    ];

    const h3Sections = [
      ...error.root_causes.map(cause => cause.name),
      ...error.fix_steps.map(step => step.step),
      ...error.examples.map(ex => ex.name)
    ];

    const jsonLd = this.generateTechnicalArticleSchema(error, canonical);

    return {
      title,
      description,
      keywords,
      ogTitle: `🔧 ${error.title} Fix Guide`,
      ogDescription: description,
      ogImage,
      twitterTitle: `⚡ Fix ${error.title}`,
      twitterDescription: `${error.summary.slice(0, 140)}...`,
      twitterImage: ogImage,
      jsonLd,
      breadcrumbs,
      h1: `How to Fix: ${error.title}`,
      h2: h2Sections,
      h3: h3Sections,
      canonical
    };
  }

  generateListSEO(category?: string, page: number = 1): SEOMetadata {
    const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
    const pageStr = page > 1 ? ` - Page ${page}` : '';
    
    const title = category 
      ? `${categoryName} Kubernetes Errors - Complete Fix Guide${pageStr}`
      : `Kubernetes Error Database - 150+ Troubleshooting Guides${pageStr}`;
    
    const description = category
      ? `Complete list of ${categoryName} Kubernetes errors with instant fixes, root cause analysis, and step-by-step troubleshooting guides.`
      : 'Comprehensive database of 150+ Kubernetes errors with instant fixes, root cause analysis, and expert troubleshooting guides. Search by error message or upload screenshots.';

    const keywords = [
      'kubernetes errors list',
      'k8s troubleshooting guide',
      'kubernetes debugging',
      'container orchestration errors',
      'devops troubleshooting',
      'kubectl errors',
      'pod errors',
      'deployment errors',
      'service errors'
    ];

    if (category) {
      keywords.unshift(`kubernetes ${category} errors`);
    }

    const canonical = category 
      ? `${this.baseUrl}/kubernetes/errors?category=${category}`
      : `${this.baseUrl}/kubernetes/errors`;

    const breadcrumbs = [
      { name: 'Home', url: this.baseUrl },
      { name: 'Kubernetes Errors', url: `${this.baseUrl}/kubernetes/errors` }
    ];

    if (category) {
      breadcrumbs.push({
        name: `${categoryName} Errors`,
        url: canonical
      });
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": title,
      "description": description,
      "url": canonical,
      "publisher": this.getOrganizationSchema(),
      "breadcrumb": this.getBreadcrumbSchema(breadcrumbs),
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const h2Sections = category 
      ? [`${categoryName} Error Categories`, 'Quick Fixes', 'Common Issues']
      : ['Error Categories', 'Popular Fixes', 'Search Errors', 'Upload Screenshot'];

    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.baseUrl}/api/og/list${category ? `/${category}` : ''}`,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.baseUrl}/api/og/list${category ? `/${category}` : ''}`,
      jsonLd,
      breadcrumbs,
      h1: title.replace(' - Complete Fix Guide', '').replace(pageStr, ''),
      h2: h2Sections,
      h3: [],
      canonical
    };
  }

  generateHomeSEO(): SEOMetadata {
    const title = 'K8S Error Intelligence - Instant Kubernetes Troubleshooting & Error Fixes';
    const description = 'Get instant fixes for any Kubernetes error. Upload error screenshots or paste error messages for step-by-step solutions. 150+ errors covered with expert troubleshooting guides.';
    
    const keywords = [
      'kubernetes troubleshooting',
      'k8s error fix',
      'kubernetes debugging tool',
      'container orchestration support',
      'devops troubleshooting',
      'kubectl error help',
      'pod troubleshooting',
      'kubernetes error database',
      'k8s support tool',
      'kubernetes error search'
    ];

    const canonical = this.baseUrl;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "K8S Error Intelligence",
      "description": description,
      "url": canonical,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": this.getOrganizationSchema(),
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": "K8S Error Intelligence",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    };

    return {
      title,
      description,
      keywords,
      ogTitle: '🚀 K8S Error Intelligence - Instant Kubernetes Fixes',
      ogDescription: description,
      ogImage: `${this.baseUrl}/api/og/home`,
      twitterTitle: '⚡ Instant Kubernetes Error Fixes',
      twitterDescription: 'Upload screenshots or paste error messages. Get step-by-step fixes instantly.',
      twitterImage: `${this.baseUrl}/api/og/home`,
      jsonLd,
      breadcrumbs: [{ name: 'Home', url: canonical }],
      h1: 'Instant Kubernetes Error Intelligence',
      h2: ['How It Works', 'Upload Screenshot', 'Search Errors', 'Popular Categories'],
      h3: ['Step 1: Upload or Paste', 'Step 2: Get Analysis', 'Step 3: Follow Fix'],
      canonical
    };
  }

  generateSearchSEO(query?: string): SEOMetadata {
    const title = query 
      ? `"${query}" - Kubernetes Error Search Results`
      : 'Search Kubernetes Errors - Find Instant Fixes';
    
    const description = query
      ? `Search results for "${query}" in our Kubernetes error database. Find step-by-step fixes and troubleshooting guides.`
      : 'Search through 150+ Kubernetes errors to find instant fixes, root cause analysis, and troubleshooting guides.';

    const canonical = query 
      ? `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
      : `${this.baseUrl}/search`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      "name": title,
      "description": description,
      "url": canonical,
      "publisher": this.getOrganizationSchema()
    };

    return {
      title,
      description,
      keywords: ['kubernetes error search', 'k8s troubleshooting', 'error lookup'],
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.baseUrl}/api/og/search`,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.baseUrl}/api/og/search`,
      jsonLd,
      breadcrumbs: [
        { name: 'Home', url: this.baseUrl },
        { name: 'Search', url: `${this.baseUrl}/search` }
      ],
      h1: query ? `Search Results for "${query}"` : 'Search Kubernetes Errors',
      h2: ['Search Results', 'Related Errors', 'Popular Fixes'],
      h3: [],
      canonical
    };
  }

  private generateTechnicalArticleSchema(error: KubernetesError, url: string) {
    return {
      "@context": "https://schema.org",
      "@type": "TechnicalArticle",
      "headline": `${error.title} - Kubernetes Error Fix Guide`,
      "description": error.summary,
      "author": this.getOrganizationSchema(),
      "publisher": this.getOrganizationSchema(),
      "datePublished": error.created_at,
      "dateModified": error.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "about": {
        "@type": "SoftwareApplication",
        "name": "Kubernetes",
        "applicationCategory": "Container Orchestration Platform",
        "operatingSystem": "Linux"
      },
      "teaches": error.fix_steps.map(step => step.step),
      "keywords": [error.canonical_slug, ...error.aliases].join(', '),
      "articleSection": "Troubleshooting",
      "wordCount": this.estimateWordCount(error),
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".summary", ".fix-steps"]
      }
    };
  }

  private getOrganizationSchema() {
    return {
      "@type": "Organization",
      "name": "K8S Error Intelligence",
      "url": this.baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${this.baseUrl}/logo.png`,
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://github.com/k8s-error-intelligence",
        "https://twitter.com/k8serrors"
      ]
    };
  }

  private getBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
    return {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  private estimateWordCount(error: KubernetesError): number {
    const text = [
      error.title,
      error.summary,
      ...error.root_causes.map(c => `${c.name} ${c.why}`),
      ...error.fix_steps.map(s => s.step),
      ...error.examples.map(e => `${e.name} ${e.symptom} ${e.fix}`)
    ].join(' ');
    
    return text.split(/\s+/).length;
  }
}

// Legacy compatibility
export function generateSEOMetadata(error: KubernetesError) {
  const seo = new K8SEOEngine();
  const metadata = seo.generateErrorSEO(error);
  return {
    title: metadata.title,
    description: metadata.description
  };
}

export function generateFAQJsonLd(error: KubernetesError) {
  const faqItems = [
    {
      "@type": "Question",
      "name": `What does ${error.title} mean?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": error.summary
      }
    },
    {
      "@type": "Question", 
      "name": "Why does this error happen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": error.root_causes.slice(0, 2).map(cause => `${cause.name}: ${cause.why}`).join('. ')
      }
    },
    {
      "@type": "Question",
      "name": "How to fix this error quickly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": error.fix_steps.slice(0, 3).map((step, i) => `${i + 1}. ${step.step}`).join(' ')
      }
    }
  ]

  if (error.fix_steps.length > 0) {
    faqItems.push({
      "@type": "Question",
      "name": "What should I check first?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": error.fix_steps[0].step
      }
    })
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems
  }
}

export const seoEngine = new K8SEOEngine();