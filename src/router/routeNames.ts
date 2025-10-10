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
  home = 'home',
  library = 'library',
  fleeMarket = 'flee-market',
  tournaments = 'tournaments',
  prototypes = 'prototypes',
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
