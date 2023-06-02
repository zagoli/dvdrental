import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Apollo, gql} from "apollo-angular";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
    });
    auth_error: boolean = false;

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    constructor(private titleService:Title, private apollo: Apollo, private router: Router) {
        this.titleService.setTitle("Login");
    }

    onFormSubmit(): void {

        this.loginForm.markAllAsTouched()
        if (!this.loginForm.valid){
            return
        }

        this.apollo.query({
            query: gql`
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        customer_id
                        first_name
                        last_name
                    }
                }
            `,
            variables: {
                email: this.email!.value,
                password: this.password!.value
            },
        })
        .subscribe((result: any) => {
            const userData = result.data.login;
            if(!userData){
                this.loginForm.reset();
                this.auth_error = true;
            } else {
                sessionStorage.setItem('first_name', userData.first_name);
                sessionStorage.setItem('last_name', userData.last_name);
                sessionStorage.setItem('customer_id', userData.customer_id);
                this.router.navigate(['films']);
            }
        });
    }

}
