import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {DataTableDirective} from "angular-datatables";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FilmDetailsComponent} from "../film-details/film-details.component";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

	@ViewChild(DataTableDirective) // @ts-ignore
	private datatableElement: DataTableDirective;
	dtOptions: DataTables.Settings = {}
	categories: String[] = [];
	disableFiltering = true;

	constructor(private apollo: Apollo, private modalService: NgbModal) {
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
				{title: 'Title',
				 data: 'title',
				 render: (data, type, row) => {
					return `<a href="#" data-film_id="${row.film_id}">${data}</a>`
				 }
				},
				{title: 'Year', data: 'release_year', searchable: false},
				{title: 'Rating', data: 'rating', searchable: false},
				{title: 'Categories', data: 'categories', searchable: false},
				{title: 'Language', data: 'language', searchable: false},
				{title: 'Rental Cost', data: 'rental_rate', searchable: false},
				{title: 'Rent',
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
		let eventButton = event.target as HTMLElement;
		let film_id = eventButton.getAttribute('data-film_id');
		if (film_id) {
			const modalRef = this.modalService.open(FilmDetailsComponent);
			modalRef.componentInstance.film_id = Number(film_id);
			event.preventDefault();
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
