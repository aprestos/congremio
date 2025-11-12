export type LocaleCode = 'en' | 'pt'

export interface LocaleInfo {
  code: LocaleCode
  name: string
  nativeName: string
}

export const AVAILABLE_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
]

export const DEFAULT_LOCALE: LocaleCode = 'en'

export const FALLBACK_LOCALE: LocaleCode = 'en'

/**
 * Translation schema - defines the structure of all translation keys
 * This ensures type safety and autocomplete for translations
 */

// Common translations used across the app
export interface CommonTranslationSchema {
  cancel: string
  confirm: string
  save: string
  delete: string
  edit: string
  close: string
  yes: string
  no: string
  loading: string
  error: string
  success: string
}

// Authentication and user management
export interface AuthTranslationSchema {
  signIn: string
  signOut: string
  signUp: string
  email: string
  password: string
  forgotPassword: string
  authenticationRequired: string
  authenticationRequiredMessage: string
  signInToAccount: string
  signInDescription: string
  emailAddress: string
  enterEmailPlaceholder: string
  sendMagicLink: string
  sendingMagicLink: string
  orContinueWith: string
  google: string
  apple: string
  checkInbox: string
  verificationCodeSent: string
  enterCodeDescription: string
  enterVerificationCode: string
  verifyCode: string
  verifying: string
  didntReceiveCode: string
  tryAgain: string
  codeExpiresNote: string
  sendToDifferentEmail: string
  confirmingSignIn: string
  pleaseWaitVerify: string
  welcomeBack: string
  successfullySignedIn: string
  redirectingIn: string
  continueToHome: string
  almostThere: string
  provideDisplayName: string
  displayName: string
  enterDisplayName: string
  updateDisplayName: string
  updating: string
  authenticationFailed: string
  verifySignInFailed: string
  backToSignIn: string
  displayNameRequired: string
  displayNameMinLength: string
}

// Game status and general game-related translations
export interface GameTranslationSchema {
  reserve: string
  reserved: string
  available: string
  unavailable: string
  notAvailable: string
  withdrawn: string
  inUse: string
  imageUnavailable: string
  coverImage: string
  status: {
    availableForBorrowing: string
    canWithdrawFromLibrary: string
    withdrawnFromLibrary: string
    currentlyWithdrawn: string
    currentlyNotAvailable: string
    underMaintenanceOrUnavailable: string
    reservedByAnotherUser: string
    checkBackLater: string
    lastUpdated: string
  }
  detail: {
    players: string
    min: string
    age: string
    description: string
    notAvailable: string
    productInformation: string
    best: string
    good: string
    playable: string
    recommended: string
    languageDependence: {
      no_necessary: string
      some_necessary: string
      moderate: string
      extensive: string
    }
    viewOnBGG: string
  }
}

// Public library view translations
export interface LibraryTranslationSchema {
  title: string
  games: string
  search: string
  noGamesFound: string
  noGamesFoundDescription: string
  closeMenu: string
  loadingMoreGames: string
  reserveGame: string
  status: {
    reserved: string
    available: string
    unavailable: string
    notAvailable: string
    withdrawn: string
  }
  filters: {
    title: string
    'new-arrivals': string
    family: string
    classics: string
    'two-player-only': string
    children: string
    players: string
    playtime: string
  }
  sort: {
    sortBy: string
    bestRating: string
    newest: string
    name: string
  }
}

// Reservation-specific translations
export interface ReservationTranslationSchema {
  areYouSureReserve: string
  important: string
  reservationValid: string
  minutes: string
  oneReservationPerUser: string
}

// Withdrawal/loan-specific translations
export interface WithdrawTranslationSchema {
  history: string
  totalWithdrawals: string
  totalWithdrawalsPlural: string
  noWithdrawalsYet: string
  noWithdrawalsMessage: string
  returned: string
  active: string
  returnedOn: string
  hours: string
}

// Navigation translations
export interface NavigationTranslationSchema {
  library: string
  admin: string
  profile: string
}

// Admin panel translations
export interface AdminTranslationSchema {
  navigation: {
    dashboard: string
    library: string
    events: string
    tournaments: string
    settings: string
    fleaMarket: string
  }
  library: {
    title: string
    description: string
    search: string
    name: string
    status: string
    location: string
    players: string
    playtime: string
    age: string
    owner: string
    game: string
    notes: string
    optional: string
    year: string
    person: string
    noImage: string
    unknown: string
    unknownGame: string
    unknownUser: string
    typeToSearch: string
    selectALocation: string
    selectLocation: string
    selectGame: string
    selectUser: string
    user: string
    actions: string
    // Game actions
    addGame: string
    editGame: string
    deleteGame: string
    moveGame: string
    returnGame: string
    withdrawGame: string
    gameHistory: string
    addToLibrary: string
    moveToLocation: string
    markAsNotAvailable: string
    markAsAvailable: string
    // Action states
    updating: string
    update: string
    submitting: string
    submit: string
    moving: string
    withdrawing: string
    // Reservation management
    reservation: string
    reservationDetails: string
    reservationNumber: string
    reservationNotFound: string
    reservationExpired: string
    reservedGame: string
    reservedBy: string
    confirmReservation: string
    cancelReservation: string
    loadingReservation: string
    expiresAt: string
    createdAt: string
    // Withdrawal management
    withdrawnBy: string
    withdrawTo: string
    withdrawHistory: string
    noWithdrawalsYet: string
    gameNotWithdrawn: string
    confirmWithdraw: string
    searchAndSelectUser: string
    createNewUser: string
    selectExistingUser: string
    // Return management
    return: string
    loan: string
    returned: string
    returnedOn: string
    confirmReturn: string
    areYouSureReturn: string
    yesReturnIt: string
    // Move management
    currentLocation: string
    newLocation: string
    // History
    history: string
    noHistory: string
    checkingHistory: string
    hours: string
    active: string
    // General actions
    edit: string
    move: string
    gameDetails: string
    // Confirmations and warnings
    confirmDelete: string
    deleteWarning: string
    cannotDeleteHasHistory: string
    // Success messages
    deleteSuccess: string
    moveSuccess: string
    withdrawSuccess: string
    returnSuccess: string
    addSuccess: string
    editSuccess: string
    // Error messages
    deleteFailed: string
    moveFailed: string
    withdrawFailed: string
    returnFailed: string
    addFailed: string
    editFailed: string
    stats: {
      total: string
      available: string
      withdrawn: string
      reserved: string
    }
  }
  tickets: {
    title: string
    description: string
    addTicket: string
    totalTickets: string
    revenuePotential: string
    totalCapacity: string
    activeStatus: string
    active: string
    inactive: string
    soldOut: string
    currentlyOnSale: string
    basedOnQuantityPrice: string
    totalAvailableSlots: string
    noTicketsYet: string
    getStartedCreating: string
    createFirstTicket: string
    name: string
    price: string
    quantity: string
    status: string
    salePeriod: string
    validPeriod: string
    actions: string
    general: string
    vip: string
    earlyBird: string
    view: string
    edit: string
    delete: string
    confirmDelete: string
    deleteSuccess: string
    deleteFailed: string
    loadFailed: string
    editFunctionalityComingSoon: string
    viewDetailsFunctionalityComingSoon: string
    addTicketFunctionalityComingSoon: string
  }
}

// Main translation schema
export interface TranslationSchema {
  common: CommonTranslationSchema
  auth: AuthTranslationSchema
  game: GameTranslationSchema
  library: LibraryTranslationSchema
  reservation: ReservationTranslationSchema
  withdraw: WithdrawTranslationSchema
  navigation: NavigationTranslationSchema
  admin: AdminTranslationSchema
}

/**
 * Helper type to make all properties optional recursively
 * Used for non-English locales to allow partial translations
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
