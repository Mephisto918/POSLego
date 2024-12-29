import express from 'express';
import {getProducts, 
        getProductById, 
        getImg, 
        addProduct,
        deleteProduct} from '../controller/products.js';
import { ifProductExist } from '../middlewares/productsValidation.js';
import { getAllStocks, getStockById, searchStocks, addStock, deleteStock, editStock } from '../controller/stocks.js';

const route = express.Router();

route.get('/all', getAllStocks);
route.get('/:id', getStockById);
route.post('/search', searchStocks);
route.post('/add/', addStock);
route.put('/edit/:id', editStock);
route.delete('/delete/:id', deleteStock);

export default route;