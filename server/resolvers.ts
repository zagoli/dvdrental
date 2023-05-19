import * as queries from './queries.js'

export const resolvers = {
    mpaa_rating: {
        G: 'G',
        PG: 'PG',
        PG13: 'PG-13',
        R: 'R',
        NC17: 'NC-17'
    },
    Film: {
        categories: (parent) => queries.categoriesOfFilm(parent.film_id),
        actors: (parent) => queries.actorsOfFilm(parent.film_id),
    },
    Query: {
        films: () => queries.allFilms(),
        film: (parent, args) => queries.filmById(args.film_id),
        rentals: (parent, args, context, info) => queries.allRentalsOfCustomer(args.customer_id),
        rental: (parent, args, context, info) => 0,
        storesFilm: (parent, args, context, info) => queries.storeFilmAvailable(args.film_id),
    }
};