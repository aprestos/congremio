/**
 * Matches a domain against a pattern that may contain wildcards.
 * Supports wildcard patterns like "*.example.com" to match any subdomain.
 *
 * @param pattern - The domain pattern, which may include a wildcard (*)
 * @param domain - The actual domain to test
 * @returns true if the domain matches the pattern, false otherwise
 *
 * @example
 * matchDomain('*.example.com', 'sub.example.com') // true
 * matchDomain('*.example.com', 'example.com') // false
 * matchDomain('example.com', 'example.com') // true
 */
export function matchDomain(pattern: string, domain: string): boolean {
  // Normalize both to lowercase for case-insensitive comparison
  const normalizedPattern = pattern.toLowerCase()
  const normalizedDomain = domain.toLowerCase()

  // If no wildcard, do exact match
  if (!normalizedPattern.includes('*')) {
    return normalizedPattern === normalizedDomain
  }

  // Handle wildcard pattern
  if (normalizedPattern.startsWith('*.')) {
    const baseDomain = normalizedPattern.substring(2) // Remove "*."

    // The domain must end with the base domain
    if (!normalizedDomain.endsWith(baseDomain)) {
      return false
    }

    // The domain must have at least one character before the base domain
    // and that character must be preceded by a dot
    const beforeBase = normalizedDomain.substring(
      0,
      normalizedDomain.length - baseDomain.length,
    )

    // beforeBase should end with a dot and have at least one character before it
    return beforeBase.length > 0 && beforeBase.endsWith('.')
  }

  // If wildcard is not at the beginning, do exact match
  // (we only support leading wildcards for now)
  return normalizedPattern === normalizedDomain
}
