import {pool, __dirname, imageBaseDir} from '../../dbCon.js';
import path, { resolve } from 'path';
import fs, { stat } from 'fs';
import sharp from 'sharp';

function getImg(passId, passType) {
    const id = passId;
    const type = passType == 'set' ? "sets" : "bricks";
    let image = null;
    try{
        const imgPath = path.resolve(__dirname, 'src', 'assets', type, id, `${id}.jpg`);
        try{
            image = fs.readFileSync(imgPath, {encoding: 'base64'});
        }catch(error){
            // console.log('54 - pr - erimg', error);
        }
        const passImage = image ? `data:image/jpeg;base64,${image}` : null
        const message = passImage ? 'Image found' : 'Image not found';
        const status = passImage ? 200 : 409;
        return {
            status: status,
            image: passImage,
            message: message
        }
    }catch(error){
        console.log('26 - ', error);
        return { message: 'Internal Server Error' };
    }
}

async function getProducts(req, res, next) {
    try{
        const result = await pool.query(`SELECT "brickId" AS "id", "type", "quantity", "brickName" AS "name", "brickPrice" AS "price" FROM "Bricks" UNION SELECT "setId" AS "id", "type", "quantity", "setName" AS "name", "setPrice" AS "price" FROM "Sets" ORDER BY id  DESC;`);
        const prodWImage = result.rows.map((prod)=>{
            const image = getImg(prod.id, prod.type);
            return{info: prod, image}
        });
        return res.status(201).send(prodWImage);
    }catch(error){
        console.log('error 9',error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function doTransaction(req, res, next) {
    const client = await pool.connect();
    const data = req.body;
    const cartItems = req.body.cartItems;
    const q = `INSERT INTO "Sales" ("quantity", "tender", "total", "change", "date")
                VALUES ($1, $2, $3, $4, $5);`
    const {quantity, tender, total, change, date, time} = data;
    const data2 = [quantity, tender, total, change, `${date}T${time}Z`];
    try{
        await client.query('BEGIN');
        for(const item of cartItems){
            const type = item.type == 'set' ? 'setId' : 'brickId'; 
            const update = `UPDATE "Stocks" SET "quantity" = GREATEST("quantity" - $1, 0) WHERE "${type}" = $2;`
            await client.query(update, [item.quantity, item.id]);
        }
        const response = await pool.query(q, data2);

        await client.query('COMMIT');
        res.status(201).send('undermaintinance');
    }catch(err){
        await client.query('ROLLBACK');
        console.log('70 - ',err);
        res.status(500).send('bad');
    } finally {
        client.release();
    }
}
export { getProducts, doTransaction};