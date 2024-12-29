import {pool, __dirname, imageBaseDir} from '../../dbCon.js';
import path from 'path';
import fs, { stat } from 'fs';
import sharp from 'sharp';


function toDateAndTime(dateProperty) { // needs a date property
    const dateObj = new Date(dateProperty);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toISOString().split('T')[1].slice(0, -8);

    return {
        date,
        time
    }
}
async function getAllStocks(req, res, next) {
    const que = `SELECT 
        s."stockId",
        s."quantity",
        s."dateAdded",
        s."expiryDate",
        COALESCE(b."brickName", se."setName") AS "name",
        COALESCE(b."brickId", se."setId") AS "productId",
        CASE 
            WHEN b."brickId" IS NOT NULL THEN 'Brick'
            WHEN se."setId" IS NOT NULL THEN 'Set'
            ELSE 'Unknown'
        END AS "type"
        FROM "Stocks" s
        LEFT JOIN "Bricks" b ON s."brickId" = b."brickId"
        LEFT JOIN "Sets" se ON s."setId" = se."setId"
        ORDER BY "dateAdded" DESC;
    `;
    try{
        const request = await pool.query(que);
        const stocks = request.rows;

        const processStock = stocks.map(stock => { // converts postgres format yy-dd-mmThh:mm:ss.msmsmsZ into seperate date and time
            const addedDateFormated = toDateAndTime(stock.dateAdded);
            const expiryDateFormated = toDateAndTime(stock.expiryDate);
            const id = stock.productId;
            return {...stock, id, addedDateFormated, expiryDateFormated}
        })
        res.status(201).send(processStock);
    }catch(error) {
        console.log('30 - ',error);
        res.status(500).send("Internal Server Error");
    }
}

async function getStockById(req, res, next) {
    const id = req.params.id;
    const que = `SELECT * FROM "Stocks" WHERE "stockId" = $1`;
    try{
        const response = await pool.query(que, [id]);
        const data = response.rows;
        const processedData = data.map(data => {
            const addedDateFormated = toDateAndTime(data.dateAdded);
            const expiryDateFormated = toDateAndTime(data.expiryDate);
            const id = data.brickId || data.setId;
            const name = data.brickName || data.setName;
            const type = data.setId == null ? "bricks" : "sets";
            return { ...data, id, name, type, addedDateFormated, expiryDateFormated }
        });
        return res.status(201).send(processedData);
    }catch(error){
        console.log('46 - ', error);
    }
}

async function searchStocks(req, res, next) {
    const { search } = req.body;
    const q = `SELECT 
                    s."stockId",
                    s."quantity",
                    s."dateAdded",
                    s."expiryDate",
                    COALESCE(b."brickName", se."setName") AS "name",
                    COALESCE(b."brickId", se."setId") AS "productId",
                    CASE 
                        WHEN b."brickId" IS NOT NULL THEN 'Brick'
                        WHEN se."setId" IS NOT NULL THEN 'Set'
                        ELSE 'Unknown'
                    END AS "type"
                FROM "Stocks" s
                LEFT JOIN "Bricks" b ON s."brickId" = b."brickId"
                LEFT JOIN "Sets" se ON s."setId" = se."setId"
                WHERE 
                    b."brickId" = $1 OR 
                    se."setId" = $1
                ORDER BY "dateAdded" DESC;
                `;
    try {
        const response = await pool.query(q, [search]);
        const stocks = request.rows;

        const processStock = stocks.map(stock => { // converts postgres format yy-dd-mmThh:mm:ss.msmsmsZ into seperate date and time
            const addedDateFormated = toDateAndTime(stock.dateAdded);
            const expiryDateFormated = toDateAndTime(stock.expiryDate);
            const id = stock.productId;
            return {...stock, id, addedDateFormated, expiryDateFormated}
        })
        return res.status(201).send(processStock);

    } catch (error) {
        console.log('71 - ', error);
        return res.send(response.rows);
    }
}

async function addStock(req, res, next) {
    const { id, type, name, quantity, expiryDate, dateAdded } = req.body;
    const isSet = type == 'set' ? "setId" : "brickId";
    const data = [id, dateAdded, expiryDate, quantity];
    const query = `INSERT INTO "Stocks" ("${isSet}", "dateAdded", "expiryDate", "quantity")
                    VALUES ( $1, $2, $3, $4)`;
    try {
        const response = await pool.query(query, data);
        return res.status(201).send('ok');
    } catch (error) {
        console.log('45 - ',error);
        return res.status(500).send("Internal Server Error");
    }
}

async function editStock(req, res, next) {
    const { stockId, quantity, newAddedDate, newExpiryDate } = req.body;
    const que = `UPDATE "Stocks" SET "dateAdded" = $1, "expiryDate" = $2, "quantity" = $3 WHERE "stockId" = $4`;
    const data = [newAddedDate, newExpiryDate, quantity, stockId];
    try {
        const response = await pool.query(que, data);
        return res.status(201).send('ok');
    } catch (error) {
        console.log('79 - ',error);
        return res.status(500).send('Internal Server Error');
    }
}
async function deleteStock(req, res, next){
    const id = req.params.id;
    const query = `DELETE FROM "Stocks" WHERE "stockId" = $1`;
    try{
        const response = await pool.query(query, [id]);
        return res.status(201).send('ok');
    }catch(error){
        console.log('60 - ',error);
        return res.status(500).send("Internal Server Error");
    }
}

export { getAllStocks, getStockById, searchStocks, addStock, editStock, deleteStock};