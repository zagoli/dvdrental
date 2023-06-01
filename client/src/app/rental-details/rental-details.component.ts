import {Component, Input, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: 'app-rental-details',
	templateUrl: './rental-details.component.html',
	styleUrls: ['./rental-details.component.scss']
})
export class RentalDetailsComponent implements OnInit{

	@Input()
	rental_id: number = 1;
	film_title: String = "";
	film_release_year: number = 0;
	film_description: String = "";
	store: any = {};
	rental_date: Date = new Date();
	return_date: Date | null = null;
	cost: number | null = null;

	canViewRental: boolean = true;

	constructor(private apollo: Apollo, public activeModal: NgbActiveModal) {}

	ngOnInit(): void {
		this.apollo.query({
			query: gql`
			query Rental($rentalId: Int!) {
				  rental(rental_id: $rentalId) {
					    cost
					    rental_date
					    return_date
					    store {
					      address
					      district
					      city
					      country
					    }
					    film {
					      title
					      release_year
					      description
					    }
				  }
			}
			`,
			variables: {
				rentalId: this.rental_id
			}
		}).subscribe((result: any) => {
			const rental = result.data.rental;
			if (rental) {
				this.film_title = rental.film.title;
				this.film_release_year = rental.film.release_year;
				this.film_description = rental.film.description;
				this.store = rental.store;
				this.rental_date = new Date(rental.rental_date);
				this.return_date = new Date(rental.return_date);
				this.cost = rental.cost;
			} else {
				this.canViewRental = false;
			}

		})
	}


}
