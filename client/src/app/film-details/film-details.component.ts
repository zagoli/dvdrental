import {Component, Input, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

@Component({
	selector: 'app-film-details',
	templateUrl: './film-details.component.html',
	styleUrls: ['./film-details.component.scss']
})
export class FilmDetailsComponent implements OnInit {

	@Input()
	film_id: number = 1;
	title: String = "";
	description: String = "";
	release_year: number = 0;
	language: String = "";
	rental_duration: number = 0;
	rental_rate: number = 0;
	length: number = 0;
	replacement_cost: number = 0;
	rating: String = "";
	special_features: String[] = [];
	fulltext: String = "";
	categories: String[] = [];
	actors: String[] = [];

	// form variables
	rentForm = new FormGroup({
		rentalDate: new FormControl('', [Validators.required, this.dateRangeValidator(2)]),
		store: new FormControl()
	});
	stores: String[] = []
	loggedIn: boolean = !!sessionStorage.getItem('customer_id');
	filmRented: boolean = false;

	constructor(private apollo: Apollo, public activeModal: NgbActiveModal) {
	}

	ngOnInit(): void {
		this.apollo.query({
			query: gql`
		                query Film($filmId: Int!) {
		                    film(film_id: $filmId) {
							    film_id
							    title
							    description
							    release_year
							    language
							    rental_duration
							    rental_rate
							    length
							    replacement_cost
							    rating
							    special_features
							    fulltext
							    categories
							    actors
							  }
		                }
		            `,
			variables: {
				filmId: this.film_id,
			},
		}).subscribe((results: any) => {
			const film = results.data.film;
			this.title = film.title;
			this.description = film.description;
			this.release_year = film.release_year;
			this.language = film.language;
			this.rental_duration = film.rental_duration;
			this.rental_rate = film.rental_rate;
			this.length = film.length;
			this.replacement_cost = film.replacement_cost;
			this.rating = film.rating;
			this.special_features = film.special_features;
			this.fulltext = film.fulltext;
			this.categories = film.categories;
			this.actors = film.actors;
		})

		// stores where the film is available to rent
		this.apollo.query({
			query: gql`
			query Film($filmId: Int!) {
				  storesFilm(film_id: $filmId) {
					    address
					    district
					    city
					    country
				  }
			}
			`,
			variables: {
				filmId: this.film_id
			}
		}).subscribe((results: any) => {
			this.stores = results.data.storesFilm.map((s: any) =>
				`${s.address}, ${s.district}, ${s.city}, ${s.country}`
			)
		})
	}

	dateRangeValidator(days: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const selectedDate: Date = new Date(new Date(control.value).toDateString());
			const today: Date = new Date(new Date().toDateString());
			const futureDate: Date = new Date(new Date().toDateString());
			futureDate.setDate(futureDate.getDate() + days);
			if (selectedDate && (selectedDate < today || selectedDate > futureDate)) {
				return { dateOutOfRange: true };
			}
			return null;
		};
	}

	onFormSubmit(): void {
		this.rentForm.markAllAsTouched()
		if (this.rentForm.valid){
			this.filmRented = true;
		}
	}

}
