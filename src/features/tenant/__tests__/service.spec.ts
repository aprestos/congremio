/* eslint-disable @typescript-eslint/unbound-method */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { tenantService } from '../service'
import { supabase } from '@/lib/supabase'

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('tenantService.getByDomain', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return tenant on exact domain match', async () => {
    const mockTenant = {
      id: '1',
      name: 'Test Tenant',
      domain: 'example.com',
      logo: '',
      current_event: '',
      email: '',
    }

    const mockSelect = vi.fn().mockReturnThis()
    const mockOr = vi.fn().mockReturnThis()
    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: mockTenant, error: null })

    const mockedFrom = vi.mocked(supabase.from)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mockedFrom.mockReturnValue({
      select: mockSelect,
      or: mockOr,
      single: mockSingle,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const result = await tenantService.getByDomain('example.com')

    expect(result).toEqual(mockTenant)
    expect(supabase.from).toHaveBeenCalledWith('tenants')
  })

  it('should return tenant on wildcard domain match', async () => {
    const mockTenants = [
      {
        id: '1',
        name: 'Wildcard Tenant',
        domain: '*.up.railway.app',
        logo: '',
        current_event: '',
        email: '',
      },
      {
        id: '2',
        name: 'Other Tenant',
        domain: 'example.com',
        logo: '',
        current_event: '',
        email: '',
      },
    ]

    const mockSelect = vi.fn().mockReturnThis()
    const mockOr = vi.fn().mockReturnThis()
    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: 'Not found' } })

    let callCount = 0
    const mockedFrom = vi.mocked(supabase.from)
    mockedFrom.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        // First call - exact match query
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          select: mockSelect,
          or: mockOr,
          single: mockSingle,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      } else {
        // Second call - fetch all tenants
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          select: vi.fn().mockReturnValue({ data: mockTenants, error: null }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
    })

    const result = await tenantService.getByDomain('myapp.up.railway.app')

    expect(result).toEqual(mockTenants[0])
    expect(result.name).toBe('Wildcard Tenant')
  })

  it('should match wildcard in other_domains field', async () => {
    const mockTenants = [
      {
        id: '1',
        name: 'Tenant with other domains',
        domain: 'example.com',
        other_domains: ['*.subdomain.example.com', 'another.com'],
        logo: '',
        current_event: '',
        email: '',
      },
    ]

    const mockSelect = vi.fn().mockReturnThis()
    const mockOr = vi.fn().mockReturnThis()
    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: 'Not found' } })

    let callCount = 0
    const mockedFrom = vi.mocked(supabase.from)
    mockedFrom.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          select: mockSelect,
          or: mockOr,
          single: mockSingle,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          select: vi.fn().mockReturnValue({ data: mockTenants, error: null }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
    })

    const result = await tenantService.getByDomain('test.subdomain.example.com')

    expect(result).toEqual(mockTenants[0])
    expect(result.name).toBe('Tenant with other domains')
  })

  it('should throw error when no tenant matches', async () => {
    const mockTenants = [
      {
        id: '1',
        name: 'Test Tenant',
        domain: 'example.com',
        logo: '',
        current_event: '',
        email: '',
      },
    ]

    const mockSelect = vi.fn().mockReturnThis()
    const mockOr = vi.fn().mockReturnThis()
    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: 'Not found' } })

    let callCount = 0
    const mockedFrom = vi.mocked(supabase.from)
    mockedFrom.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          select: mockSelect,
          or: mockOr,
          single: mockSingle,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          select: vi.fn().mockReturnValue({ data: mockTenants, error: null }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
    })

    await expect(tenantService.getByDomain('nonexistent.com')).rejects.toThrow(
      'No tenant found for domain: nonexistent.com',
    )
  })
})
