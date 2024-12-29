import {pool, __dirname} from '../../dbCon.js';
import path from 'path';
import fs from 'fs';

async function ifProductExist(req, res, next){
    const data = req.body;
    const que = `SELECT "brickId" AS "id"
                FROM "Bricks"
                WHERE "brickId" = $1
                UNION
                SELECT "setId" AS "id"
                FROM "Sets"
                WHERE "setId" = $1;`;
    try{
        // const response = await pool.query(que, [data.id]);
        // if((response.rows.length === 0)){
            // console.log('Product does not exist');
            // return next();
            next();
        // }else{
            // console.log('Exist');
            // return res.status(409).json({ message: 'Product already exists' });
        // }
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server Error!' });
    }
}

// async function ifProductImgExist(id){

// }

export { ifProductExist };