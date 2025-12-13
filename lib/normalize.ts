/**
 * Normalizes text according to the specification in master.md
 */
export function normalizeText(text: string): string {
  // Limit length to 20,000 chars
  let normalized = text.slice(0, 20000)
  
  // Lowercase
  normalized = normalized.toLowerCase()
  
  // Strip ANSI color codes
  // eslint-disable-next-line no-control-regex
  normalized = normalized.replace(/\x1b\[[0-9;]*m/g, '')
  
  // Collapse whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim()
  
  return normalized
}