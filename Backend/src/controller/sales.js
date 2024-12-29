import {pool, __dirname, imageBaseDir} from '../../dbCon.js';
import { toDateAndTime } from '../utils/lib.js';
async function getSales(req, res, next) {
    try{
        const response = await pool.query(`SELECT * FROM "Sales"`);
        const data = response.rows;
        const sortedData = data.map((item)=>{
           const { date, time } = toDateAndTime(item.date);
            
            return { ...item, date, time};
        });

        res.status(201).json({ data: sortedData});
    }catch(error){
        console.log(' - ',error)
        res.status(500).send("Internal Server Error");
    }
}

export { getSales };