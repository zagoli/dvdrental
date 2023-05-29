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
		// @ts-ignore
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
				{
					title: 'title',
					data: 'title'
				},
				{
					title: 'year',
					data: 'release_year'
				},
				{
					title: 'ratting',
					data: 'rating'
				},
				{
					title: 'categories',
					data: 'categories'
				},
				{
					title: 'language',
					data: 'language'
				},
				{
					title: 'cost',
					data: 'rental_rate'
				},
			]
		}
	}

}
