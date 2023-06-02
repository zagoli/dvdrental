import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {FilmsComponent} from "./films/films.component";
import {RentalsComponent} from "./rentals/rentals.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
    {path: '', redirectTo: '/films', pathMatch: 'full' },
    {path: 'login', component: LoginComponent},
    {path: 'films', component: FilmsComponent},
    {path: 'rentals', component: RentalsComponent},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
