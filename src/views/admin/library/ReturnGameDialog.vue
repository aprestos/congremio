<script setup lang="ts">
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import type { LibraryGame } from '@/features/library/game.model.ts'

interface Props {
  open: boolean
  selectedGame: LibraryGame | null
  isReturningGame: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: []
  cancel: []
}>()
</script>

<template>
  <ConfirmationDialog
    :open="open"
    title="Return Game"
    :message="`Are you sure you want to return the game ${selectedGame?.game.name}?`"
    confirm-text="Yes, return it"
    cancel-text="Cancel"
    :loading="isReturningGame"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
    @close="emit('close')"
  />
</template>
