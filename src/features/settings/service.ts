import { supabase } from '@/lib/supabase.ts'
import { Type, type Setting as SettingEntity } from './setting.entity'
import type { Settings, Library, Setting } from './setting.model'

const mapToSettings = (entities: Array<SettingEntity> | null): Settings => {
  if (!entities) return {}
  const settings: Settings = {}
  entities?.forEach((setting: SettingEntity) => {
    switch (setting.type) {
      case Type.library:
        settings.library = mapToSetting<Library>(setting)
        break
      case Type.tournaments:
        settings.tournaments = {
          enabled: setting?.enabled || false,
        }
        break
      case Type.events:
        settings.events = {
          enabled: setting?.enabled || false,
        }
        break
      case Type.flea:
        settings.flea = {
          enabled: setting?.enabled || false,
        }
        break
    }
  })
  return settings
}

const mapToSetting = <T>(entity: SettingEntity | null): Setting<T> => {
  if (!entity) return { enabled: false }

  return {
    enabled: entity?.enabled || false,
    value: entity.content as T,
  }
}

export const settingsService = {
  async get(tenantId: string, editionId: number): Promise<Settings | null> {
    const settings: Settings = {
      library: {
        enabled: false,
      },
      tournaments: {
        enabled: false,
      },
      events: {
        enabled: false,
      },
      flea: {
        enabled: false,
      },
    }
    try {
      let query = supabase
        .from('settings')
        .select()
        .eq('tenant_id', tenantId)
        .eq('edition_id', editionId)

      const result = await query

      return mapToSettings(result.data)
    } catch (error) {
      console.error((error as Error).message)
      return settings
    }
  },
  async updateEnabled(
    tenantId: string,
    editionId: number,
    type: string,
    enabled: boolean,
  ): Promise<Setting<unknown>> {
    try {
      const result = await supabase
        .from('settings')
        .upsert({
          tenant_id: tenantId,
          edition_id: editionId,
          type: type,
          enabled,
        })
        .select()
        .single()
      return mapToSetting(result.data as SettingEntity)
    } catch (error) {
      console.error((error as Error).message)
      throw error
    }
  },
} as const
