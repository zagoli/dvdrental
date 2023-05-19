import pg from 'pg';

const {Pool} = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dvdrental',
    password: 'postgres',
    port: 5432,
});

const selectAllFilms:  String = `
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


export async function allFilms(): Promise<[any]> {
    const result = await pool.query(selectAllFilms);
    return result.rows;
}

export async function filmById(film_id: number): Promise<any> {
    const result = await pool.query(selectFilm, [film_id]);
    return result.rows[0];
}

export async function categoriesOfFilm(film_id: number): Promise<[String]> {
    const result = await pool.query(selectCategoriesOfFilm, [film_id]);
    return result.rows.map(i => i.name);
}

export async function actorsOfFilm(film_id: number): Promise<[String]> {
    const result = await pool.query(selectActorsOfFilm, [film_id]);
    return result.rows.map(i => i.name);
}

export async function storeFilmAvailable(film_id: number): Promise<[any]> {
    const result = await pool.query(selectStoresWhereFilmAvailable, [film_id]);
    return result.rows;
}