import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';

import {LayoutComponent} from './layouts/layout.component';

// Auth
import {isLoggedInGuard} from './core/guards/is-logged-in.guard';
import {isNotLoggedInGuard} from "./core/guards/is-not-logged-in.guard";

const routes: Routes = [
    {
        path: 'jawda',
        component: LayoutComponent,
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        canActivate: [isLoggedInGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        canActivate: [isNotLoggedInGuard]
    },
    {
        path: '',
        redirectTo: 'jawda/dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/auth/errors/404-basic'
    }
];

const routerOptions: ExtraOptions = {
    scrollPositionRestoration: 'top', // scrolls to (0, 0)
    onSameUrlNavigation: 'reload' // Allow reloading when navigating to the same URL
};

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
