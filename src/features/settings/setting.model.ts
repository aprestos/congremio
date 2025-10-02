export interface Settings {
  library?: Setting<Library>
  tournaments?: Setting<unknown>
  events?: Setting<unknown>
  flea?: Setting<Flea>
}

export interface Setting<T> {
  enabled: boolean
  value?: T
}

export interface Library {
  reservations: {
    enabled: boolean
    limit: number
    duration: number
  }
}

export interface Flea {
  commission?: number
}
