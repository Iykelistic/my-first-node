import connection from './dbconnection';

connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL
    );
    
    CREATE TABLE auth (
        id SERIAL PRIMARY KEY UNIQUE NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        username TEXT NOT NULL,
        password VARCHAR NOT NULL
    );
`, (err, rows) => {
    if (err) throw err;
    console.log('Tables created successfully');
});
