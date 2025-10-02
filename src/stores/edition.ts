import { ref } from 'vue'
import type { Edition } from '@/features/events/model'

export const eventStore = ref<Edition | null>(null)
