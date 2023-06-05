import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Apollo, gql} from "apollo-angular";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {RentalDetailsComponent} from "../rental-details/rental-details.component";
import {Title} from "@angular/platform-browser";

@Component({
	selector: 'app-rentals',
	templateUrl: './rentals.component.html',
	styleUrls: ['./rentals.component.scss']
})
export class RentalsComponent implements OnInit {

	dtOptions: DataTables.Settings = {}
	allRentalsQuery = gql`
        query rentalsQuery($customerId: Int!) {
            rentals(customer_id: $customerId) {
                film {
                    title
                }
                store {
                    address
                    city
                }
                cost
                rental_date
                return_date
                rental_id
            }
        }
    `;
	@ViewChild(DataTableDirective) // @ts-ignore
	private datatableElement: DataTableDirective;

	constructor(private titleService:Title, private router: Router, private apollo: Apollo, private modalService: NgbModal) {
		this.titleService.setTitle("My Rentals");
	}

	ngOnInit() {

		if (sessionStorage.getItem('customer_id') == null) {
			this.router.navigate(['films']);
		}

		this.dtOptions = {
			ajax: (dataTablesParameters: any, callback) => {
				this.apollo.query({
					query: this.allRentalsQuery,
					variables: {
						customerId: Number(sessionStorage.getItem('customer_id')),
					},
				}).subscribe((result: any) => {
					callback({
						data: result.data.rentals,
					})
				})
			},
			columns: [
				{title: 'Title', data: 'film.title'},
				{
					title: 'Store',
					data: 'store',
					render:(data) =>{
						return data.address + ", " + data.city;
					},
					orderable: false,
					searchable: false},
				{title: 'Payment Amount', data: 'cost', searchable: false},
				{title: 'Rental Date', data: 'rental_date', searchable: false},
				{title: 'Return Date', data: 'return_date', searchable: false},
				{
					title: 'View Details',
					data: 'rental_id',
					render: (data) => {
						return `<button type="button" class="btn btn-outline-primary" data-rental_id="${data}" aria-label="View rental details" role="link">View Details</button>`;
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
		let rental_id = eventButton.getAttribute('data-rental_id');
		if (rental_id) {
			const modalRef = this.modalService.open(
				RentalDetailsComponent, {scrollable: true});
			modalRef.componentInstance.rental_id = Number(rental_id);
		}
	}


}
