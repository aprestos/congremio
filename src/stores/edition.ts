import { ref } from 'vue'
import type { Edition } from '@/features/events/event.model.ts'

export const editionStore = ref<Edition | null>(null)
