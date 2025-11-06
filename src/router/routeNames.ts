enum Admin {
  dashboard = 'admin.home',
  library = 'admin.library',
  events = 'admin.events',
  tournaments = 'admin.tournaments',
  tickets = 'admin.tickets',
  settings = 'admin.settings',
  settingsGeneral = 'admin.settings.general',
  settingsLibrary = 'admin.settings.library',
}

enum Public {
  root = 'root',
  home = 'public.home',
  library = 'public.library',
  tournaments = 'public.tournaments',
  prototypes = 'public.prototypes',
  fleaMarket = 'public.flea-market',
  user = 'public.user',
}

enum Auth {
  signIn = 'auth.sign-in',
  signUp = 'auth.sign-up',
  checkInbox = 'auth.check-inbox',
  confirm = 'auth.confirm',
}

enum ErrorRoutes {
  notFound = 'error.not-found',
}

export const RouteNames = {
  admin: Admin,
  public: Public,
  auth: Auth,
  error: ErrorRoutes,
}
