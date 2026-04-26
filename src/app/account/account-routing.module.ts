import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Component Pages
import {LoginComponent} from "./login/login.component";
import {OtpComponent} from './otp/otp.component';
import {CreateAccountComponent} from './create-account/pages/create-account/create-account.component';
import {SuccessPageComponent} from './success-page/success-page.component';

const routes: Routes = [
    {
        path: 'pass-reset',
        loadChildren: () => import('./auth/pass-reset/pass-reset.module').then(m => m.PassResetModule)
    },
    {
        path: 'pass-create',
        loadChildren: () => import('./auth/pass-create/pass-create.module').then(m => m.PassCreateModule)
    },
    {
        path: 'success-msg',
        loadChildren: () => import('./auth/success-msg/success-msg.module').then(m => m.SuccessMsgModule)
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "otp",
        component: OtpComponent
    },
    {
        path: "create-account",
        component: CreateAccountComponent,
    },
    {
        path: "success-page",
        component: SuccessPageComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {
}
