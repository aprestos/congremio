<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { IconArrowLeft } from '@tabler/icons-vue'
import { userService, type User } from '@/features/users/service.ts'
import libraryWithdrawService, {
  type LibraryWithdraw,
} from '@/features/library/withdraws/service.ts'
import logger from '@/lib/logger.ts'
import UserHeader from './UserHeader.vue'
import WithdrawHistory from './WithdrawHistory.vue'
import { RouteNames } from '@/router/routeNames.ts'
import CButton from '@/components/CButton.vue'

const route = useRoute()
const userId = route.params.id as string

const user = ref<User | null>(null)
const withdraws = ref<LibraryWithdraw[]>([])
const isLoadingUser = ref(false)
const isLoadingWithdraws = ref(false)

const groupedWithdraws = computed<Map<number, LibraryWithdraw[]>>(() => {
  const grouped = new Map<number, LibraryWithdraw[]>()

  for (const withdraw of withdraws.value) {
    const editionId = withdraw.edition_id

    if (!grouped.has(editionId)) grouped.set(editionId, [])

    grouped.get(editionId)?.push(withdraw)
  }
  logger.debug('withdraws', { grouped })
  return grouped
})

async function loadUserData(): Promise<void> {
  isLoadingUser.value = true
  try {
    user.value = await userService.getById(userId)
  } catch (error) {
    console.error('Failed to load user:', error)
    toast.error('Failed to load user details')
  } finally {
    isLoadingUser.value = false
  }
}

async function loadWithdraws(): Promise<void> {
  isLoadingWithdraws.value = true
  try {
    withdraws.value = await libraryWithdrawService.getByUserId(userId)
  } catch (error) {
    console.error('Failed to load withdraws:', error)
    toast.error('Failed to load withdrawal history')
  } finally {
    isLoadingWithdraws.value = false
  }
}

onMounted(() => {
  void loadUserData()
  void loadWithdraws()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
    <!-- Back Button -->
    <div class="max-w-6xl mx-auto mb-8">
      <RouterLink
        class="cursor-pointer"
        :to="{ name: RouteNames.public.library }"
      >
        <CButton
          variant="tertiary"
          class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <IconArrowLeft class="size-5" />
          <span class="text-sm font-medium">Back</span>
        </CButton>
      </RouterLink>
    </div>

    <div class="max-w-6xl mx-auto space-y-8">
      <!-- User Header Component -->
      <UserHeader :user="user" :is-loading="isLoadingUser" />

      <!-- Withdrawal History Component -->
      <WithdrawHistory
        :withdraws="withdraws"
        :grouped-withdraws="groupedWithdraws"
        :is-loading="isLoadingWithdraws"
      />
    </div>
  </div>
</template>
