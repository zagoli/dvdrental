import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dvdrental',
    password: 'postgres',
    port: 5432,
});

export async function filmById(film_id: number): Promise<object> {
    try {
        const result = await pool.query('select * from film where film_id = $1', [film_id]);
        // Assuming you expect a single film with the provided ID
        return result.rows[0];
    } catch (error) {
        throw error; // Propagate the error if necessary
    }
}