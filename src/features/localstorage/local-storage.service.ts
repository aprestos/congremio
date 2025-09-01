const TENANT_ID_KEY = 'tenant_id'

export const getTenantId = (): string | null => {
  return localStorage.getItem(TENANT_ID_KEY)
}

export const setTenantId = (id: string): void => {
  localStorage.setItem(TENANT_ID_KEY, id)
}

// Default export for backward compatibility
const LocalStorageService = {
  getTenantId,
  setTenantId,
}

export default LocalStorageService
