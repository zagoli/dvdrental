import {Component, OnInit, ViewChild, Renderer2, HostListener} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {DataTableDirective} from "angular-datatables";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

	@ViewChild(DataTableDirective) // @ts-ignore
	datatableElement: DataTableDirective;
	dtOptions: DataTables.Settings = {}
	categories: String[] = [];
	disableFiltering = true;

	constructor(private renderer: Renderer2, private apollo: Apollo) {
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
								film_id
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
				{	title: 'Rent',
					data: 'film_id',
					render: (data) => {
					return `<button type="button" class="btn btn-outline-primary" data-film_id="${data}">RENT</button>`;}

				},
			],
			responsive: true,
		}
	}
	@HostListener('click', ['$event'])
	openFilm(event: Event) {
		let eventButton = event.target as HTMLButtonElement;
		let film_id = eventButton.getAttribute('data-film_id');
		if (film_id) {
			console.log(film_id)
		}
	}

	filterTable(event: Event) {
		let selectedCategory = (event.target as HTMLSelectElement).value;
		this.datatableElement.dtInstance.then( (dtInstance: DataTables.Api) => {
			dtInstance.column(3)
				.search(selectedCategory == 'All Categories' ? '' : selectedCategory)
				.draw();
		})
	}
}
