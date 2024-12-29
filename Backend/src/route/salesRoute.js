import express from 'express';
import { ifProductExist } from '../middlewares/productsValidation.js';
import { getSales } from '../controller/sales.js';

const route = express.Router();

route.get('/all', getSales );

export default route;