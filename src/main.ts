import "./assets/main.css";
import "./index.css";

import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import EditionService from "@/features/events/service.ts";
import LocalStorageService from "@/features/localstorage/local-storage.service";
import tenantService from "@/features/tenant/service";
import type { Tenant } from "@/features/tenant/tenant.model.ts";
import { eventStore } from "@/stores/event";
import { tenantStore } from "@/stores/tenant";
import App from "./App.vue";
import router from "./router";

async function loadTenant(): Promise<Tenant | null> {
  const tenantId = LocalStorageService.getTenantId();
  let tenant: Tenant | null;
  if (tenantId) {
    tenant = await tenantService.getById(tenantId);
  } else {
    const domain = window.location.hostname;
    tenant = await tenantService.getByDomain(domain);
    LocalStorageService.setTenantId(tenant.id);
  }
  tenantStore.value = tenant;
  return tenant;
}

async function loadEvent(tenantId: string) {
  if (tenantId) {
    eventStore.value = await EditionService.getCurrentEvent(tenantId);
  }
}

// Initialize app
async function initializeApp() {
  const app = createApp(App);

  const i18n = createI18n({
    // something vue-i18n options here ...
  });

  // Load tenant first before setting up router
  const tenant = await loadTenant();
  if (tenant) {
    await loadEvent(tenant.id);
  }

  app.use(createPinia());
  app.use(router);
  app.use(PrimeVue);
  app.use(i18n);

  app.mount("#app");
}

// Start the app
initializeApp().catch(console.error);
