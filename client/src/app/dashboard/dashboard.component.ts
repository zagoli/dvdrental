import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {DataTableDirective} from "angular-datatables";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FilmDetailsComponent} from "../film-details/film-details.component";
import {flatMap} from "rxjs";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	@ViewChild(DataTableDirective) // @ts-ignore
	private datatableElement: DataTableDirective;
	private allFilmsQuery = gql`
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
	`;
	private filmsWithCategoryQuery = gql`
		query FilmsWithCategory($category: String!) {
			filmsWithCategory(category: $category) {
				film_id
				title
				release_year
				rating
				categories
				language
				rental_rate
			}
		}
	`
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
					query: this.allFilmsQuery,
				}).subscribe((result: any) => {
					this.disableFiltering = false;
					callback({
						data: result.data.films,
					})
				})
			},
			columns: [
				{
					title: 'Title',
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
				{
					title: 'Rent',
					data: 'film_id',
					render: (data) => {
						return `<button type="button" class="btn btn-outline-primary" data-film_id="${data}">RENT</button>`;
					},
					orderable: false,
					searchable: false
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
		this.disableFiltering = true;
		let selectedCategory = (event.target as HTMLSelectElement).value;
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.clear();
			if (selectedCategory == "All Categories") {
				this.apollo.query({
					query: this.allFilmsQuery,
				}).subscribe((result: any) => {
					dtInstance.rows
						.add(result.data.films)
						.draw();
					this.disableFiltering = false;
				})
			} else {
				this.apollo.query({
						query: this.filmsWithCategoryQuery,
						variables: {
							category: selectedCategory,
						},
					}
				).subscribe((result: any) => {
					dtInstance.rows
						.add(result.data.filmsWithCategory)
						.draw();
					this.disableFiltering = false;
				})
			}
		})
	}
}
