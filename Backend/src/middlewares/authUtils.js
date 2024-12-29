import {pool, __dirname, imageBaseDir} from '../../dbCon.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config(); // finsd
const key = process.env.JWT_KEY;

// Helper to generate a token
function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, key, { expiresIn: '1h' });
} 

// Middleware to verify JWT
function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    console.log(token, authHeader);
    if (!token) return res.status(401).send('Access denied: No token provided');
 
    jwt.verify(token, key, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user; // Attach user info to request
        next();
    });
}

async function userVerify(req, res, next) {
    const data = req.body;
    const query = `SELECT * FROM "Users" where username = $1 AND password = $2`
    try{
        const result = await pool.query(query, [data.username, data.password]);
        
        if (result.rows.length === 0) {
            return res.status(401).send("Invalid credentials");
        }
        const token = generateToken(data);        
        return res.status(200).json({id: result.rows[0].id, token: token});
    }catch(error){
        console.log('17 - ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export { generateToken, authenticateToken, userVerify };