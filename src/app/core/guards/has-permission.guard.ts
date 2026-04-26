import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {Permission} from "../enum/permission";
import {AuthService} from "../services/auth.service";

export const hasPermissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const requiredPermissions: Permission[] = route.data['permissions'] || [];
  const authService = inject(AuthService);

  // Fetch userClaim dynamically from UserState
  const userClaim = authService.getUserClaim();

  if (!userClaim) {
    // Redirect to login if userClaim is not authenticated
    void router.navigate(['/auth/signin']);
    return false;
  }

  const userPermissions = userClaim.permissions || [];

  // Check if userClaim has at least one required permission
  const hasPermission = requiredPermissions.length === 0 ||
      requiredPermissions.some(permission => userPermissions.includes(permission));

  if (!hasPermission) {
    console.log("User not authorized - insufficient permissions");
    void router.navigate(['/']); // Redirect to home or error page
    return false;
  }

  return true;
};

