// Feature flags for enterprise functionality
export const FEATURE_FLAGS = {
  // Enterprise features - will be user-based in future
  BULK_ANALYSIS: false,
  ERROR_CLUSTERING: false,
  EXPORT_REPORTS: false,
  PRIORITY_SUPPORT: false,
  CUSTOM_INTEGRATIONS: false,
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

// Check if user has access to a feature
export function hasFeature(feature: FeatureFlag): boolean {
  // For now, all enterprise features are disabled
  // Later this will check user subscription
  return FEATURE_FLAGS[feature]
}

// Get feature availability message
export function getFeatureMessage(feature: FeatureFlag): string {
  const messages = {
    BULK_ANALYSIS: "Available in Pro and Team plans",
    ERROR_CLUSTERING: "Available in Pro and Team plans", 
    EXPORT_REPORTS: "Available in Pro and Team plans",
    PRIORITY_SUPPORT: "Available in Team plan",
    CUSTOM_INTEGRATIONS: "Available in Team plan",
  }
  
  return messages[feature]
}

// Pricing tiers
export const PRICING_TIERS = {
  FREE: {
    name: "Free",
    price: 0,
    description: "Essential error documentation",
    features: [
      "Full error documentation access",
      "Search and browse all errors",
      "Root cause analysis",
      "Fix procedures and examples",
      "Community support"
    ]
  },
  PRO: {
    name: "Pro", 
    price: 19,
    description: "Enhanced analysis and productivity",
    features: [
      "Everything in Free",
      "Bulk error analysis",
      "Error clustering and patterns",
      "PDF/markdown exports",
      "Email support"
    ]
  },
  TEAM: {
    name: "Team",
    price: 49,
    description: "Team collaboration and integrations",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Custom integrations",
      "Priority support",
      "Usage analytics"
    ]
  }
} as const

export type PricingTier = keyof typeof PRICING_TIERS