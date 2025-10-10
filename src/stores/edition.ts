import { ref } from 'vue'
import type { Edition } from '@/features/events/event.model.ts'

export const eventStore = ref<Edition | null>(null)
