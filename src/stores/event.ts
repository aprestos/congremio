import { ref } from "vue";
import type { Event } from "@/features/events/model";

export const eventStore = ref<Event | null>(null);
