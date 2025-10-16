import { supabase } from '@/lib/supabase.ts'

export const queueService = {
  async add(
    tenantId: string | undefined,
    editionId: number | undefined,
    queueName: string,
    items: Array<{ bggId: string; owner: string }>,
  ): Promise<void> {
    if (!tenantId || !editionId) throw new Error('Missing tenant or edition')

    await supabase.functions.invoke(`queues/${queueName}`, {
      body: JSON.stringify({
        tenant_id: tenantId,
        edition_id: editionId,
        games: items.map((item) => {
          return { bgg_id: item.bggId, owner: item.owner }
        }),
      }),
      method: 'POST',
    })
  },
  process(): void {
    void supabase.functions.invoke(`message-processor`, {
      method: 'POST',
    })
  },
} as const
