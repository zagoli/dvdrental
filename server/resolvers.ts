import './queries'
import {filmById} from "./queries";

export const resolvers = {
    mpaa_rating: {
        G: 'G',
        PG: 'PG',
        PG13: 'PG-13',
        R: 'R',
        NC17: 'NC-17'
    },
    Store: {
        city: (parent, args, context, info) => 0,
        country: (parent, args, context, info) => 0,
    },
    Rental: {
        film: (parent, args, context, info) => 0,
        store: (parent, args, context, info) => 0,
        cost: (parent, args, context, info) => 0,
    },
    Film: {
        categories: (parent, args, context, info) => 0,
        actors: (parent, args, context, info) => 0,
    },
    Query: {
        films: () => 0,
        film: (parent, args, context, info) => filmById(args.id),
        rentals: (parent, args, context, info) => 0,
        rental: (parent, args, context, info) => 0,
        storesFilm: (parent, args, context, info) => 0,
    }
};