import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { authService } from "@/features/auth/service.ts";
import { RouteNames } from "@/router/routeNames";

// Guard function type
export type RouteGuard = () => Promise<boolean>;

// Authentication check guard
export const requiresAuth = async (): Promise<boolean> => {
  try {
    const user = await authService.getUser();
    return !!user.data.user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Staff permission check guard
export const requiresStaff = async (): Promise<boolean> => {
  try {
    return await authService.hasAdminAccess();
  } catch (error) {
    console.error("Error checking staff permissions:", error);
    return false;
  }
};

// Admin permission check guard
export const requiresAdmin = async (): Promise<boolean> => {
  try {
    // Assuming there's an isAdmin method in AuthService
    // If not, you can implement this logic based on your user model
    const user = await authService.getUser();
    return user.data.user?.user_metadata?.role === "admin";
  } catch (error) {
    console.error("Error checking admin permissions:", error);
    return false;
  }
};

// Combined staff or admin guard
export const requiresStaffOrAdmin = async (): Promise<boolean> => {
  try {
    const [isStaff, isAdmin] = await Promise.all([
      requiresStaff(),
      requiresAdmin(),
    ]);
    return isStaff || isAdmin;
  } catch (error) {
    console.error("Error checking staff or admin permissions:", error);
    return false;
  }
};

// Main navigation guard handler (Vue 2 style)
export const navigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    // Check custom guard function
    if (to.meta.guard) {
      console.log("calling guard", to.meta.guard);
      const hasPermission = await to.meta.guard();
      console.log("hasPermission", hasPermission);

      if (hasPermission) {
        next();
      } else {
        next({ name: RouteNames.error.notFound });
      }
      return;
    }

    // Check authentication requirement
    if (to.meta.requiresAuth) {
      const isAuthenticated = await requiresAuth();

      if (isAuthenticated) {
        next();
      } else {
        next({ name: RouteNames.auth.signIn });
      }
      return;
    }

    // No guards required, proceed
    next();
  } catch (error) {
    console.error("Navigation guard error:", error);
    next({ name: RouteNames.error.notFound });
  }
};
