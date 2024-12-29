import {pool, __dirname, imageBaseDir} from '../../dbCon.js';
import path from 'path';
import fs, { stat } from 'fs';
import sharp from 'sharp';

async function getAllUsers(req, res, next) {
    try{
        const result = await pool.query(`SELECT * FROM "Users"`);
        res.send(result.rows);
    }catch(error){
        console.log('error 10, users.js controller', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getUserById(req, res, next) {
    const que = `Select * FROM "Users" WHERE "id" = $1`;
    const id = req.params.id;
    let image = null;
    try{
        const result = await pool.query(que, [id]);
        try{
            image = fs.readFileSync(path.resolve(path.join(imageBaseDir, 'users', id, `${id}.jpg` )), {encoding: 'base64'});
        }catch(error){
            console.log('24 - ',error); 
        }
        
        const passImage = image ? `data:image/jpeg;base64,${image}` : null
        const message = image ? 'Image found' : 'Image not found';
        const status = passImage ? 200 : 409;
        if(result.rows.length > 0){
            return res.status(status).json({
                user: result.rows[0],
                image: passImage,
                message: message
            });
        }
        return res.status(404).send('Not Found');
    }catch(error){
        console.log('27 - ',error);
        return res.status(500).send("Internal Server Error");
    }
}

async function deleteUser(req, res, next){
    try{
        const {id} = req.params;
        const query = `DELETE FROM "Users" WHERE "id" = $1`;
        const result = await pool.query(query, [id]);
        await fs.promises.rm(path.join(imageBaseDir, 'users', id), { recursive: true, force: true });
        // possible error for constraints
        res.status(201).send('Ok');
    }catch(error){
        console.log('err 22', error);
        res.status(500).send("Internal Server Error");
    }
}

async function editUser(req, res, next) {
    const { id, name, username, password } = req.body.user;
    const bodyimage = req.body.image;
    const ifImage = req.body.image == null ? false : true;
    const editQue = `UPDATE "Users" SET "name" = $1, "username" = $2 WHERE "id" = $3`;
    const editQuePass = `UPDATE "Users" SET "name" = $1, "username" = $2, "password" = $3 WHERE "id" = $4`;
    const pasteImg = path.join(imageBaseDir, 'users', id, `${id}.jpg`);
    try{
        password == undefined ? await pool.query(editQue, [name, username, id]) : await pool.query(editQuePass, [name, username, password, id]);
        if(ifImage){
            const image = Buffer.from(bodyimage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            await sharp(image)
            .toFormat('jpeg')
            .jpeg({ quality: 90 }) // quality, optional
            .toFile(path.join(pasteImg));
        }
        res.status(201).send('Ok');
    }catch(error){
        console.log('err 25', error);
        res.status(500).send("Internal Server Error");
    }   
}

async function signUpUser(req, res, next) {
    const data = req.body;
    try{
        const queryUser = `
            SELECT * FROM "Users" 
            WHERE "username" = $1 OR "name" = $2
        `;
        const result = await pool.query(queryUser, [data.username, data.name]);

        if (result.rows.length > 0) {
            // Check specific condition: username or name
            const existingUser = result.rows[0];
            if (existingUser.username === data.username) {
                return res.status(409).send("Username Already Exists!");
            } else if (existingUser.name === data.name) {
                return res.status(409).send("Name Already Exists!");
            }
        }

        try {
            const query = `INSERT INTO "Users" ("name", "username", "password") VALUES ($1, $2, $3) RETURNING id;`;
            const insertUser = await pool.query(query, [data.name, data.username, data.password]);
            const pgId = insertUser.rows[0].id;
            if(!fs.existsSync(path.join(imageBaseDir,'users', pgId))){
                fs.mkdirSync(path.join(imageBaseDir, 'users', pgId), { recursive: true });
                return res.status(201).send({ message: 'Product added successfully'});
            }
            const error = new Error("User already exists");
            error.code = "23505";
            throw error;
        } catch (error) {
            throw error;
        }
        return res.status(201).send("User Added Successfully!");
    }catch(error){
        console.log('err 99', error);
        if(error.code === '23505'){
            return res.status(409).send("User Already Exists!");
        }
        return res.status(500).send("Internal Server Error");
    }
}

export { getAllUsers, getUserById, deleteUser, editUser, signUpUser}