import pg from 'pg';
import {Context} from "./index";

const {Pool} = pg;

const dvdPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dvdrental',
    password: 'postgres',
    port: 5432,
});

const usersPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dvdrental_users',
    password: 'postgres',
    port: 5432,
});

const selectAllFilms: String = `
select film_id, title, description, release_year, l.name as language, rental_duration,
rental_rate, length, replacement_cost, rating, special_features, fulltext
from film
join language l on film.language_id = l.language_id`

const selectFilm: String = selectAllFilms + ' where film_id = $1'

const selectCategoriesOfFilm: String = `
select name
from category
join film_category fc on category.category_id = fc.category_id
where film_id = $1`

const selectActorsOfFilm: String = `
select first_name || ' ' || last_name as name
from actor
join film_actor fa on actor.actor_id = fa.actor_id
where fa.film_id = $1`

const selectStoresWhereFilmAvailable: String = `
select distinct s.store_id, a.address, a.district, c.city, c2.country
from inventory i
join rental r on i.inventory_id = r.inventory_id
join store s on i.store_id = s.store_id
join address a on a.address_id = s.address_id
join city c on c.city_id = a.city_id
join country c2 on c.country_id = c2.country_id
where (i.inventory_id, r.rental_date) in (
    select i.inventory_id, max(rental_date) as maxdate
    from inventory i
    join rental r on i.inventory_id = r.inventory_id
    where film_id = $1
    group by i.inventory_id
) and r.return_date is not null`

const selectAllRentalsOfCustomer: String = `
select r.rental_id, r.customer_id, f.film_id, i.store_id, 
       (r.return_date::date - r.rental_date::date) * f.rental_rate as cost,
       cast(r.rental_date as text), cast(r.return_date as text)
from rental r
join inventory i on i.inventory_id = r.inventory_id
join film f on i.film_id = f.film_id
where r.customer_id = $1`

const selectRentalById: String = `
select r.rental_id, r.customer_id, f.film_id, i.store_id, 
       (r.return_date::date - r.rental_date::date) * f.rental_rate as cost,
       cast(r.rental_date as text), cast(r.return_date as text)
from rental r
join inventory i on i.inventory_id = r.inventory_id
join film f on i.film_id = f.film_id
where r.rental_id = $1`

const selectStoreById: String = `
select s.store_id, a.address, a.district, c.city, c2.country
from store s
join address a on a.address_id = s.address_id
join city c on c.city_id = a.city_id
join country c2 on c2.country_id = c.country_id
where s.store_id = $1`

const selectUser: String = `
select customer_id, password from users where email = $1`

const selectCustomer: String = `
select customer_id, first_name, last_name from customer where customer_id = $1`

const selectAllCategories: String = `
select name from category`


export async function allFilms(): Promise<[any]> {
    const result = await dvdPool.query(selectAllFilms);
    return result.rows;
}

export async function filmById(film_id: number): Promise<any> {
    const result = await dvdPool.query(selectFilm, [film_id]);
    return result.rows[0];
}

export async function storeById(store_id: number): Promise<any> {
    const result = await dvdPool.query(selectStoreById, [store_id]);
    return result.rows[0];
}

export async function categoriesOfFilm(film_id: number): Promise<[String]> {
    const result = await dvdPool.query(selectCategoriesOfFilm, [film_id]);
    return result.rows.map(i => i.name);
}

export async function actorsOfFilm(film_id: number): Promise<[String]> {
    const result = await dvdPool.query(selectActorsOfFilm, [film_id]);
    return result.rows.map(i => i.name);
}

export async function storeFilmAvailable(film_id: number): Promise<[any]> {
    const result = await dvdPool.query(selectStoresWhereFilmAvailable, [film_id]);
    return result.rows;
}

export async function allRentalsOfCustomer(customer_id: number, context: Context): Promise<[any]> {
    if (context.customer_id && context.customer_id == customer_id) {
        const result = await dvdPool.query(selectAllRentalsOfCustomer, [customer_id]);
        return result.rows;
    } else {
        return null;
    }
}

export async function rentalById(rental_id: number, context: Context): Promise<any> {
    const result = await dvdPool.query(selectRentalById, [rental_id]);
    const rental = result.rows[0];
    if (rental && context.customer_id && rental.customer_id == context.customer_id) {
        return rental;
    } else {
        return null;
    }

}

export async function customer(email: String, password: String): Promise<any> {
    const user = (await usersPool.query(selectUser, [email])).rows[0];
    if (user && user.password === password) {
        const result = await dvdPool.query(selectCustomer, [user.customer_id]);
        return result.rows[0];
    } else {
        return null;
    }
}

export async function categories(): Promise<any> {
    const categories = await dvdPool.query(selectAllCategories);
    const result: String[] = [];
    categories.rows.forEach( (c) => {
        result.push(c.name)}
    );
    return result;

}