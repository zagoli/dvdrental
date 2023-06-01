import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {NavbarComponent} from './navbar/navbar.component';
import {DataTablesModule} from "angular-datatables";
import {FilmDetailsComponent} from './film-details/film-details.component';
import {RentalsComponent} from './rentals/rentals.component';
import {RentalDetailsComponent} from './rental-details/rental-details.component';

@NgModule({
	declarations: [
		AppComponent, LoginComponent, DashboardComponent, NavbarComponent, FilmDetailsComponent, RentalsComponent, RentalDetailsComponent
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
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
