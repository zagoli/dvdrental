import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{

	loggedIn: boolean = false;
	customerName: string | null = null;
	customerId: string | null = null;

	constructor(private router: Router) {
		this.customerId = sessionStorage.getItem('customer_id');
		this.customerName = sessionStorage.getItem('first_name');
		if (this.customerId) {
			this.loggedIn = true;
		}
	}

	logout() {
		sessionStorage.clear();
		this.loggedIn = false;
		this.router.navigate(['dashboard']);
	}


}
