export interface Settings {
  library?: Setting<Library>
  tournaments?: Setting<unknown>
  events?: Setting<unknown>
  flea?: Setting<Flea>
  tickets?: Setting<Tickets>
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

export interface Tickets {
  commission?: number
}
