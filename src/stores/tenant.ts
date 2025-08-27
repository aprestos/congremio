import { ref } from "vue";
import type { Tenant } from "@/features/tenant/tenant.model";

export const tenantStore = ref<Tenant | null>(null);
