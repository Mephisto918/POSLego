import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function generateToken(user){
    const payload = {
        id: user.id,
        username: user.username
    }
    try{
        const token = await jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '1h'});
        return token;
    }catch(error){
        console.log('err 15', error);
    }
}

async function verifyToken(token){
    try{ //verify
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        return decoded;
    }catch(err){
        console.log('24 - ', err);
        return false;
    }
}

export { generateToken, verifyToken }