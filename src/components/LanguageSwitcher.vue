<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import CButton from '@/components/CButton.vue'
import { LanguageIcon } from '@heroicons/vue/24/outline'
import type { LocaleCode } from '@/i18n/types'

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'yellow' | 'danger'
  showIcon?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  showIcon: true,
})

const { availableLocales, currentLocale, setLocale } = useLocale()

const otherLocales = computed(() => {
  const current = currentLocale.value
  if (!current) return availableLocales
  return availableLocales.filter((locale) => locale.code !== current.code)
})

const handleLocaleChange = (code: LocaleCode): void => {
  setLocale(code)
}
</script>

<template>
  <div class="relative inline-block">
    <div
      v-if="otherLocales.length > 0 && otherLocales[0]"
      class="flex items-center gap-2"
    >
      <CButton
        :variant="variant"
        size="sm"
        @click="handleLocaleChange(otherLocales[0].code)"
      >
        <LanguageIcon v-if="showIcon" class="size-4" />
        <span>{{ otherLocales[0].nativeName }}</span>
      </CButton>
    </div>

    <!-- For multiple locales, you could implement a dropdown menu here -->
    <div v-else-if="currentLocale" class="flex items-center gap-2">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ currentLocale.nativeName }}
      </span>
    </div>
  </div>
</template>
