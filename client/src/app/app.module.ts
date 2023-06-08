import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JwtHelperService, JWT_OPTIONS} from '@auth0/angular-jwt';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './login/login.component';
import {FilmsComponent} from './films/films.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {NavbarComponent} from './navbar/navbar.component';
import {DataTablesModule} from "angular-datatables";
import {FilmDetailsComponent} from './film-details/film-details.component';
import {RentalsComponent} from './rentals/rentals.component';
import {RentalDetailsComponent} from './rental-details/rental-details.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

@NgModule({
    declarations: [
        AppComponent, LoginComponent, FilmsComponent, NavbarComponent, FilmDetailsComponent, RentalsComponent, RentalDetailsComponent, PageNotFoundComponent
    ],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        GraphQLModule,
        HttpClientModule,
        DataTablesModule,
        FormsModule
    ],
    providers: [
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
