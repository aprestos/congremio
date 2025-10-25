enum Admin {
  dashboard = 'admin.home',
  library = 'admin.library',
  events = 'admin.events',
  tournaments = 'admin.tournaments',
  settings = 'admin.settings',
  settingsGeneral = 'admin.settings.general',
  settingsLibrary = 'admin.settings.library',
  fleeMarket = 'admin.flee-market',
}

enum Public {
  root = 'root',
  home = 'public.home',
  library = 'public.library',
  fleeMarket = 'public.flee-market',
  tournaments = 'public.tournaments',
  prototypes = 'public.prototypes',
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
