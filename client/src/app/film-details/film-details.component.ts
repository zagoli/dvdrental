import {Component, Input, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

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
	}

}
