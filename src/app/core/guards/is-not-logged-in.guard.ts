import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const isNotLoggedInGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService)
    const router = inject(Router)

    if (authService.getUserClaim()) {
        void router.navigate(['/'])
        return false;
    }


    return true;
};
