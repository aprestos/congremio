import './assets/main.css'
import './index.css'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import VueCountdown from '@chenfengyuan/vue-countdown'

import EditionService from '@/features/events/service.ts'
import LocalStorageService from '@/features/localstorage/local-storage.service'
import tenantService from '@/features/tenant/service'
import type { Tenant } from '@/features/tenant/tenant.model.ts'
import { eventStore } from '@/stores/edition'
import { tenantStore } from '@/stores/tenant'
import App from './App.vue'
import router from './router'
import { createHead } from '@unhead/vue/client'
import { settingsStore } from '@/features/settings/useSettings.store.ts'
import { settingsService } from '@/features/settings/service.ts'
import type { Edition } from '@/features/events/model.ts'

async function loadTenant(): Promise<Tenant | null> {
  const tenantId = LocalStorageService.getTenantId()
  let tenant: Tenant | null
  if (tenantId) {
    tenant = await tenantService.getById(tenantId)
  } else {
    const domain = window.location.hostname
    tenant = await tenantService.getByDomain(domain)
    LocalStorageService.setTenantId(tenant.id)
  }
  tenantStore.value = tenant
  return tenant
}

async function loadEdition(tenantId: string): Promise<Edition | null> {
  if (tenantId) {
    eventStore.value = await EditionService.getCurrentEvent(tenantId)
    return eventStore?.value || null
  }
  return null
}

async function loadSettings(
  tenantId: string,
  editionId: number,
): Promise<void> {
  if (tenantId && editionId) {
    settingsStore.value = await settingsService.get(tenantId, editionId)
  }
}

// Initialize app
async function initializeApp(): Promise<void> {
  const app = createApp(App)

  const i18n = createI18n({
    // something vue-i18n options here ...
  })

  // Load tenant first before setting up router
  const tenant = await loadTenant()
  if (tenant) {
    const edition = await loadEdition(tenant.id)
    if (edition) {
      await loadSettings(tenant.id, edition.id)
    }
  }

  app.use(createPinia())
  app.use(router)
  app.use(PrimeVue, {
    unstyled: true,
  })
  app.use(i18n as any)
  app.component(VueCountdown.name as string, VueCountdown)

  const head = createHead()
  app.use(head)

  app.mount('#app')
}

// Start the app
initializeApp().catch(console.error)
