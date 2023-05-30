import {Component, OnInit, ViewChild} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {DataTableDirective} from "angular-datatables";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	@ViewChild(DataTableDirective) // @ts-ignore
	datatableElement: DataTableDirective;
	dtOptions: DataTables.Settings = {}
	categories: String[] = [];
	disableFiltering = true;

	constructor(private apollo: Apollo) {
	}

	ngOnInit() {

		this.apollo.query({
			query: gql`
		                query Categories {
		                    categories
		                }
		            `,
		}).subscribe((results: any) => {
			this.categories = results.data.categories;
		})

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
				}).subscribe((result: any) => {
					this.disableFiltering = false;
					callback({
						data: result.data.films,
					})
				})
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

	filterTable(event: Event) {
		let selectedCategory = (event.target as HTMLSelectElement).value;
		this.datatableElement.dtInstance.then( (dtInstance: DataTables.Api) => {
			dtInstance.column(4)
				.search(selectedCategory == "All Categories" ? "" : selectedCategory)
				.draw();
		})
	}
}
