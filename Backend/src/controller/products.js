import {pool, __dirname, imageBaseDir} from '../../dbCon.js';
import path from 'path';
import fs, { stat } from 'fs';
import sharp from 'sharp';
import { error } from 'console';

async function getProducts (req, res){
    try{
        const result = await pool.query(`SELECT "brickId" AS "id", "type", "quantity", "brickName" AS "name", "brickPrice" AS "price" FROM "Bricks" UNION SELECT "setId" AS "id", "type", "quantity", "setName" AS "name", "setPrice" AS "price" FROM "Sets" ORDER BY id;`);
        res.send(result.rows);
    }catch(error){
        console.log('error 9',error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getProductById (req, res, next){
    try{
        const paramsId = req.params.id;
        const paramsType = req.params.type;
        const type = req.params.type.includes("set") ? "Sets" : "Bricks";
        const result = await pool.query(`SELECT * FROM "${type}" WHERE "${type == 'Bricks' ? 'brickId' : 'setId'}" = '${req.params.id}'`);
        if(paramsId && paramsType){
            req.productInfo = result.rows[0];
            return next();
        }
        if (result.rows.length > 0) {
            return res.send(result.rows);
        } else {
            return res.status(404).json({ message: "No data found" });
        }
    }catch(error){
        console.error("Error in getProductById:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getImg(req, res) {
    const prodId = req.params.id;
    const typeCap = req.params.type.includes("set") ? "Sets" : "Bricks";
    const typeSmal = req.params.type.includes("set") ? "sets" : "bricks";
    let image = null;
    try{
        const imgPath = path.resolve(__dirname, 'src', 'assets', typeSmal, prodId, `${prodId}.jpg`);
        try{
            image = fs.readFileSync(imgPath, {encoding: 'base64'});
        }catch(error){
            console.log('54 - pr - erimg');
        }
        const passImage = image ? `data:image/jpeg;base64,${image}` : null
        const message = passImage ? 'Image found' : 'Image not found';
        const status = passImage ? 200 : 409;
        return res.status(status).json({
            product: req.productInfo,
            image: passImage,
            message: message
        })
    }catch(error){
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function searchProduct(req, res, next) {
    const { search } = req.body;
    const q = `SELECT "brickId" AS "id", "type", "quantity", "brickName" AS "name", "brickPrice" AS "price" FROM "Bricks" WHERE 
	"brickId" = $1 OR "brickName" ILIKE '%' || $1 || '%' 
UNION SELECT "setId" AS "id", "type", "quantity", "setName" AS "name", "setPrice" AS "price" FROM "Sets" WHERE 
    "setId" = $1 OR "setName" ILIKE '%' || $1 || '%';`
    try {
        const response = await pool.query(q, [search]);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log('71 - ', error);
        return res.send(response.rows);
    }
}

async function addProduct(req, res){
    const data = req.body;
    const ifImage = req.body.image == 'none' ? false : true;
    const image = Buffer.from(data.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const querySet = `INSERT INTO "Sets" ("setId" , "setName", "setDescription", "setPrice","theme", "pieces", "yr_release", "type")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const arraySet = [data.id, data.name, data.description, data.price, data.theme, data.pieces, data.yr_release, data.type];
    const queryBrick = `INSERT INTO "Bricks" ("brickId" , "brickName", "brickPrice", "design", "category", "type")
                        VALUES ($1, $2, $3, $4, $5, $6)`;
    const arrayBrick = [data.id, data.name, data.price, data.design, data.category, data.type];
    try{
        if(((await pool.query(`SELECT * FROM "Sets" WHERE "setId" = $1`, [data.id])).rowCount > 0)) return res.status(409).send('Conflict Sets');
        if(((await pool.query(`SELECT * FROM "Bricks" WHERE "brickId" = $1`, [data.id])).rowCount > 0)) return res.status(409).send('Conflict Bricks');

        const toQue = data.type == 'brick' ? queryBrick : querySet;
        const toArr = data.type == 'brick' ? arrayBrick : arraySet;
        const pasteImg = path.join(imageBaseDir, data.type+'s', data.id, `${data.id}.jpg`)
        if(!fs.existsSync(path.join(imageBaseDir,data.type+'s', data.id))){
            fs.mkdirSync(path.join(imageBaseDir, data.type+'s', data.id), { recursive: true });
            try{
                await pool.query('BEGIN'); // Start the transaction
                const response = await pool.query(toQue, toArr);
                if(ifImage){
                    await sharp(image)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 }) // quality, optional
                    .toFile(path.join(pasteImg));
                }
                await pool.query('COMMIT'); // Commit the transaction if both are successful
            }catch(error){
                await pool.query('ROLLBACK'); // Rollback the transaction 
                try { // file write clean up
                    await fs.promises.rm(path.join(imageBaseDir, data.type+'s', data.id), { recursive: true, force: true });
                    return res.status(409).json({ error: 'Data Already Exist!' });
                } catch (error) {
                    // console.error('110 Error deleting file during cleanup:', error);
                    return res.status(500).json({ error: 'An unexpected error occurred' });
                }
            }
            return res.status(201).send({ message: 'Product added successfully'});
        }
        return res.status(409).json({ error: 'Data Already Exist!' });
    }catch(error){
        await pool.query('ROLLBACK'); // Rollback the transaction 
        if(error.code == 'EEXIST')return res.status(409).json({ error: 'Data Already Exist!' });
        // Return a generic error response
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
    
}

async function editProduct(req, res, next) {
    const targetId = req.params.id;
    const data = req.body.product;
    const dataImage = req.body.image;
    const ifImage = req.body.image == null ? false : true;
    const image = dataImage == null ? null : Buffer.from(dataImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const processData = (data)=>{
        const { setId, brickId,
                setName, brickName,
                setPrice, brickPrice,
                type, ...misc } = data;
        const id = setId || brickId;
        const name = setName || brickName;
        const price = setPrice || brickPrice;
        return { id, name, price, type, misc: { ...misc } };
    };
                                        //----brick-misc--// //-----------set misc--------------------//
    const { id, name, price, type, misc: { design, category, setDescription, theme, pieces, yr_release } } = processData(data);
    const qBrick = `UPDATE "Bricks" 
                    SET 
                        "brickId" = $2;
                        "brickName" = $3, 
                        "brickPrice" = $4, 
                        "design" = $5, 
                        "category" = $6 
                    WHERE "brickId" = $1`;
    const arrBrick = [targetId, id, name, price, design, category]
    
    const qSet = `UPDATE "Sets" 
                    SET 
                        "setId" = $2, 
                        "setName" = $3, 
                        "setPrice" = $4, 
                        "setDescription" = $5,
                        "theme" = $6, 
                        "pieces" = $7,
                        "yr_release" = $8 
                    WHERE "setId" = $1;`;
    const arrSet = [targetId, id, name, price, setDescription, theme, pieces, yr_release]
    try {
        const oldDir = path.join(imageBaseDir,type+'s', targetId);
        const newDir = path.join(imageBaseDir,type+'s', id);
        const oldImagePath = path.join(oldDir, `${targetId}.jpg`);
        const newImagePath = path.join(newDir, `${id}.jpg`);
        if(!fs.existsSync(oldDir)){
            throw new Error(`dir ${targetId} does not exist`);
        }

        if(fs.existsSync(oldImagePath)){
            fs.promises.unlink(oldImagePath);
        }   

        try{
            await fs.promises.rename(oldDir, newDir);
            if(ifImage){
                await sharp(image)
                .toFormat('jpeg')
                .jpeg({ quality: 90 }) // quality, optional
                .toFile(newImagePath);
            }else{
                // console.log('no image written');
            }
        }catch(er){
            console.log('196 - ',er);
            throw new Error(er);
        }
        
        if(type == 'set'){
            const result = await pool.query(qSet, arrSet);
            if(result.rowCount === 0){
                throw new Error('Product does not exist - 158'); 
            }
            return res.status(201).send('Edit ok 160');
        }else if(type == 'brick'){
            const result = await pool.query(qBrick, arrBrick);
            if(result.rowCount === 0){
                throw new Error('Product does not exist - 164'); 
            }
            return res.status(201).send('Edit ok 166');
        }
    } catch (error) {
        console.log('214 - ', error);
        if (error.message === 'Product does not exist') return res.status(404).send({ message: 'Product does not exist' });

        return res.status(500).send({ message: 'Internal Server Error' });
    }
}

async function deleteProduct(req, res, next) {
    try{
        const {id, type} = req.params;
        const query = `DELETE FROM "${type == 'brick' ? 'Bricks' : 'Sets'}" WHERE "${type == 'brick' ? 'brickId' : 'setId'}" = $1`;
        const result = await pool.query(query,[id]);

        if(!fs.existsSync(path.join(imageBaseDir, id))){
            await fs.promises.rm(path.join(imageBaseDir, type+'s', id), { recursive: true, force: true });
            return res.status(201).send({ message: 'Product deleted successfully'});
        }else{
            return res.status(409).json({ error: 'Could not Delete the product' });
        }
    }catch(error){
        console.log('err 112', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


export { getProducts, getProductById, getImg, searchProduct, addProduct, editProduct, deleteProduct};
