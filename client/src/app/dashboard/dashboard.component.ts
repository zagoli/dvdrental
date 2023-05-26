import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    ngOnInit() {
        console.log(sessionStorage.getItem('customer_id'))
        console.log(sessionStorage.getItem('first_name'))
        console.log(sessionStorage.getItem('last_name'))
    }
}
