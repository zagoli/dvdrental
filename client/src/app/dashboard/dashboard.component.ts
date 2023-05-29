import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	dtOptions: DataTables.Settings = {}

	constructor(private apollo: Apollo) {
	}

	ngOnInit() {
		this.dtOptions = {
			ajax: (dataTablesParameters: any, callback) => {
				this.apollo.query({
					query: gql`
		                query Films {
		                    films {
		                        title
		                        release_year
		                        rating
		                        categories
		                        language
		                        rental_rate
		                    }
		                }
		            `,
				}).subscribe((result: any) => callback({
					data: result.data.films,
				}))
			},
			columns: [
				{title: 'Title', data: 'title'},
				{title: 'Year', data: 'release_year', searchable: false},
				{title: 'Rating', data: 'rating', searchable: false},
				{title: 'Categories', data: 'categories', searchable: false},
				{title: 'Language', data: 'language', searchable: false},
				{title: 'Rental Cost', data: 'rental_rate', searchable: false},
			],
			responsive: true,
			//@ts-ignore
			keys: true
		}
	}

}
