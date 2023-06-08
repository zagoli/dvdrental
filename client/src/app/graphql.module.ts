import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {NgModule} from '@angular/core';
import {ApolloLink, InMemoryCache} from '@apollo/client/core';
import {setContext} from "@apollo/client/link/context";
import {HttpClientModule} from "@angular/common/http";

const uri: string = 'http://localhost:4000/graphql';

export function createApollo(httpLink: HttpLink) {

	const basic = setContext(() => ({
		headers: {
			Accept: 'application/graphql-response+json; charset=utf-8',
		},
	}));

	const auth = setContext(() => {
		const token = sessionStorage.getItem('token');
		if (token === null) {
			return {};
		} else {
			return {
				headers: {
					Authorization: token,
				},
			};
		}
	});

	const link = ApolloLink.from([basic, auth, httpLink.create({uri})]);
	const cache = new InMemoryCache();

	return {
		link,
		cache,
	};
}

@NgModule({
	exports: [HttpClientModule, ApolloModule],
	providers: [
		{
			provide: APOLLO_OPTIONS,
			useFactory: createApollo,
			deps: [HttpLink],
		},
	],
})

export class GraphQLModule {}
