import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const isLoggedInGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    // check if user data is in storage is logged in via API.
    if (authService.getUserClaim()) {
        return true;
    }

    // not logged in so redirect to login page with the return url
    void router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
    return false;
};
