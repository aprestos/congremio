class LocalStorageService {
  private static TENANT_ID_KEY = "tenant_id";

  static getTenantId(): string | null {
    return localStorage.getItem(LocalStorageService.TENANT_ID_KEY);
  }

  static setTenantId(id: string): void {
    localStorage.setItem(LocalStorageService.TENANT_ID_KEY, id);
  }
}

export default LocalStorageService;
