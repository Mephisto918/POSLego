import express from 'express';
import {getAllUsers, deleteUser, editUser, getUserById} from '../controller/users.js';

const route = express.Router();


route.get('/all', getAllUsers);
route.get('/:id', getUserById);
route.put('/edit/:id', editUser);
route.delete('/delete/:id', deleteUser);

route.patch('/patch', (req, res)=>{
    res.send("user patch");
});

export default route;