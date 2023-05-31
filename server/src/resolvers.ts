import * as queries from './queries.js'
import {Context} from "./index";

export const resolvers = {
    mpaa_rating: {
        G: 'G',
        PG: 'PG',
        PG13: 'PG-13',
        R: 'R',
        NC17: 'NC-17'
    },
    Rental: {
        film: (parent) => queries.filmById(parent.film_id),
        store: (parent) => queries.storeById(parent.store_id),
    },
    Film: {
        categories: (parent) => queries.categoriesOfFilm(parent.film_id),
        actors: (parent) => queries.actorsOfFilm(parent.film_id),
    },
    Query: {
        login: (parent, args) => queries.customer(args.email, args.password),
        films: () => queries.allFilms(),
        filmsWithCategory: (parent, args) => queries.allFilmsWithCategory(args.category),
        film: (parent, args) => queries.filmById(args.film_id),
        rentals: (parent, args, context: Context) => queries.allRentalsOfCustomer(args.customer_id, context),
        rental: (parent, args, context: Context) => queries.rentalById(args.rental_id, context),
        storesFilm: (parent, args) => queries.storeFilmAvailable(args.film_id),
        categories: () => queries.categories(),
    }
};