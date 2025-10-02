export interface Setting {
  tenant_id: string
  edition_id: string
  type: Type
  enabled: boolean
  content: unknown
}

export enum Type {
  library = 'library',
  tournaments = 'tournaments',
  events = 'events',
  flea = 'flea',
}
