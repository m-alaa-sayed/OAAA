import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Permission } from "../enum/permission";
import { AuthService } from "../services/auth.service";
import { UserClaim } from "../models/user-claim";
import { Subscription } from 'rxjs';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private requiredPermissions: Permission[] = [];
  private requiredRoles: string[] = [];
  private requiredProcedures: string[] = [];
  private excludedRoles: string[] = [];
  private excludedProcedures: string[] = [];
  private userClaim: UserClaim | null = null;
  private userSubscription?: Subscription;

  constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private authService: AuthService
  ) {}

  @Input() set hasPermission(config: Permission[] | { permissions?: Permission[], roles?: string[], excludeRoles?: string[], procedures?: string[], excludeProcedures?: string[] }) {
    if (Array.isArray(config)) {
      // Legacy support: just permissions array
      this.requiredPermissions = config;
      this.requiredRoles = [];
      this.requiredProcedures = [];
      this.excludedRoles = [];
      this.excludedProcedures = [];
    } else {
      // New format: object with permissions, roles, procedures, and exclusions
      this.requiredPermissions = config.permissions ?? [];
      this.requiredRoles = config.roles ?? [];
      this.requiredProcedures = config.procedures ?? [];
      this.excludedRoles = config.excludeRoles ?? [];
      this.excludedProcedures = config.excludeProcedures ?? [];
    }
  }

  ngOnInit() {
    // ✅ Subscribe to user state changes (handles login/logout & role changes)
    this.userSubscription = this.authService.getUserClaimObservable().subscribe(userClaim => {
      this.userClaim = userClaim;
      this.updateView(); // ✅ Only update the view when user data changes
    });
  }

  private updateView() {
    if (!this.userClaim) {
      this.viewContainer.clear(); // Remove the element if no user is found
      return;
    }

    const userPermissions = this.userClaim.permissions ?? []; // Ensure it's always an array
    const userRoles = this.userClaim.roles ?? []; // Ensure it's always an array
    const userProcedures = this.userClaim.procedures ?? []; // Ensure it's always an array

    // First check if user has any excluded roles - if so, hide the element
    if (this.excludedRoles.length > 0) {
      const hasExcludedRole = this.excludedRoles.some(role => userRoles.includes(role));
      if (hasExcludedRole) {
        this.viewContainer.clear(); // Hide the element if user has excluded roles
        return;
      }
    }

    // Check if user has any excluded procedures - if so, hide the element
    if (this.excludedProcedures.length > 0) {
      const hasExcludedProcedure = this.excludedProcedures.some(procedure => userProcedures.includes(procedure));
      if (hasExcludedProcedure) {
        this.viewContainer.clear(); // Hide the element if user has excluded procedures
        return;
      }
    }

    // If no permissions, roles, or procedures are required, grant access
    if (this.requiredPermissions.length === 0 && this.requiredRoles.length === 0 && this.requiredProcedures.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Check if user has required permissions (only if permissions are specified)
    const hasRequiredPermissions = this.requiredPermissions.length > 0 &&
        this.requiredPermissions.some(permission => userPermissions.includes(permission));

    // Check if user has required roles (only if roles are specified)
    const hasRequiredRoles = this.requiredRoles.length > 0 &&
        this.requiredRoles.some(role => userRoles.includes(role));

    // Check if user has required procedures (only if procedures are specified)
    const hasRequiredProcedures = this.requiredProcedures.length > 0 &&
        this.requiredProcedures.some(procedure => userProcedures.includes(procedure));

    // Grant access if user has either required permissions OR required roles OR required procedures
    const hasAccess = hasRequiredPermissions || hasRequiredRoles || hasRequiredProcedures;

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef); // Show the element
    } else {
      this.viewContainer.clear(); // Hide the element
    }
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe(); // ✅ Prevent memory leaks
  }
}
