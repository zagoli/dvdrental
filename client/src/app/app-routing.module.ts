import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    // qua si mettono i path per il routing
    // ricordando di importare i components
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
