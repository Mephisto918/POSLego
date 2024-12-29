import pg from 'pg';
const {Pool} = pg;

import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageBaseDir = path.resolve(__dirname, 'src', 'assets');

const pool = new Pool({
    user: 'EdwardCamagong',
    host: 'localhost',
    database: 'POSLEGO',
    password: 'password',
    port: 5432
});

export { pool, __dirname, imageBaseDir };