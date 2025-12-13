import { getErrorsCollection } from './db'
import { ErrorSchema, KubernetesError } from './schema'
import { logger } from './logger'

// Static dataset imports
import { K8S_ERRORS } from '../kubernetes/errors/k8s_errors'
import { HELM_ERRORS } from '../helm/errors/helm_errors'
import { KUBECTL_ERRORS } from '../kubectl/errors/kubectl_errors'
import { DOCKER_ERRORS } from '../docker/errors/docker_errors'
import { CNI_ERRORS } from '../cni/errors/cni_errors'

// Combined static datasets
export const STATIC_DATASETS = {
  kubernetes: K8S_ERRORS,
  helm: HELM_ERRORS,
  kubectl: KUBECTL_ERRORS,
  docker: DOCKER_ERRORS,
  cni: CNI_ERRORS
} as const

// All tools combined for search
export const ALL_STATIC_ERRORS = [
  ...K8S_ERRORS,
  ...HELM_ERRORS,
  ...KUBECTL_ERRORS,
  ...DOCKER_ERRORS,
  ...CNI_ERRORS
]

export async function safeFindErrors(tool?: string): Promise<KubernetesError[]> {
  try {
    // Try database first
    const collection = await getErrorsCollection()
    
    if (collection) {
      console.log('[DB] Using database for error lookup')
      
      const query = tool ? { tool } : {}
      const errors = await collection.find(query).toArray()
      
      // Validate and filter errors
      const validErrors = errors
        .map(error => {
          try {
            return ErrorSchema.parse(error)
          } catch {
            return null
          }
        })
        .filter((error): error is KubernetesError => error !== null)

      if (validErrors.length > 0) {
        return validErrors
      }
      
      logger.warn('[DB] No valid errors found in database, falling back to static')
    }
  } catch (error) {
    logger.warn('[DB] Database query failed, using static fallback:', error instanceof Error ? error.message : 'Unknown error')
  }

  // Fallback to static datasets
  logger.log('[STATIC] Using static dataset fallback')
  
  if (tool && tool in STATIC_DATASETS) {
    return STATIC_DATASETS[tool as keyof typeof STATIC_DATASETS] as KubernetesError[]
  }
  
  // Return all errors if no specific tool requested
  return ALL_STATIC_ERRORS as KubernetesError[]
}

export async function safeFindErrorBySlug(tool: string, slug: string): Promise<KubernetesError | null> {
  try {
    // Try database first
    const collection = await getErrorsCollection()
    
    if (collection) {
      const error = await collection.findOne({ tool, canonical_slug: slug })
      
      if (error) {
        try {
          return ErrorSchema.parse(error)
        } catch (validationError) {
          logger.warn('[DB] Error validation failed for', slug, validationError instanceof Error ? validationError.message : 'Unknown error')
        }
      }
    }
  } catch (error) {
    logger.warn('[DB] Database query failed for slug lookup:', error instanceof Error ? error.message : 'Unknown error')
  }

  // Fallback to static data
  const staticErrors = tool in STATIC_DATASETS ? STATIC_DATASETS[tool as keyof typeof STATIC_DATASETS] : []
  return (staticErrors.find(error => error.canonical_slug === slug) as KubernetesError) || null
}

// Get error count for health checks
export async function getErrorStats() {
  try {
    const collection = await getErrorsCollection()
    
    if (collection) {
      const total = await collection.countDocuments()
      const byTool = await collection.aggregate([
        { $group: { _id: '$tool', count: { $sum: 1 } } }
      ]).toArray()
      
      return {
        source: 'database',
        total,
        byTool: byTool.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
      }
    }
  } catch (error) {
    logger.warn('[DB] Stats query failed:', error instanceof Error ? error.message : 'Unknown error')
  }

  // Static fallback
  const staticStats = {
    kubernetes: K8S_ERRORS.length,
    helm: HELM_ERRORS.length,
    kubectl: KUBECTL_ERRORS.length,
    docker: DOCKER_ERRORS.length,
    cni: CNI_ERRORS.length
  }

  return {
    source: 'static',
    total: Object.values(staticStats).reduce((sum, count) => sum + count, 0),
    byTool: staticStats
  }
}