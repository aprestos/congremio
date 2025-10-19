import { describe, expect, it } from 'vitest'
import { matchDomain } from '../domain-matcher'

describe('matchDomain', () => {
  it('should match exact domains', () => {
    expect(matchDomain('example.com', 'example.com')).toBe(true)
    expect(matchDomain('subdomain.example.com', 'subdomain.example.com')).toBe(
      true,
    )
    expect(matchDomain('example.com', 'other.com')).toBe(false)
  })

  it('should match wildcard subdomains', () => {
    expect(matchDomain('*.example.com', 'sub.example.com')).toBe(true)
    expect(matchDomain('*.example.com', 'deep.sub.example.com')).toBe(true)
    expect(matchDomain('*.example.com', 'example.com')).toBe(false)
    expect(matchDomain('*.example.com', 'other.com')).toBe(false)
  })

  it('should match wildcard at beginning', () => {
    expect(matchDomain('*.up.railway.app', 'myapp.up.railway.app')).toBe(true)
    expect(matchDomain('*.up.railway.app', 'another-app.up.railway.app')).toBe(
      true,
    )
    expect(matchDomain('*.up.railway.app', 'up.railway.app')).toBe(false)
    expect(matchDomain('*.up.railway.app', 'railway.app')).toBe(false)
  })

  it('should handle multiple subdomains with wildcard', () => {
    expect(matchDomain('*.example.com', 'a.b.c.example.com')).toBe(true)
    expect(matchDomain('*.example.com', 'x.y.example.com')).toBe(true)
  })

  it('should not match different domains with wildcard', () => {
    expect(matchDomain('*.example.com', 'notexample.com')).toBe(false)
    expect(matchDomain('*.example.com', 'example.org')).toBe(false)
  })

  it('should handle case-insensitive matching', () => {
    expect(matchDomain('*.Example.COM', 'sub.example.com')).toBe(true)
    expect(matchDomain('*.example.com', 'SUB.EXAMPLE.COM')).toBe(true)
  })

  it('should not match if pattern has no wildcard and domains differ', () => {
    expect(matchDomain('example.com', 'sub.example.com')).toBe(false)
    expect(matchDomain('sub.example.com', 'example.com')).toBe(false)
  })
})
