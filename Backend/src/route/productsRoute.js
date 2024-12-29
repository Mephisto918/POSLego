import express from 'express';
import {getProducts, 
        getProductById, 
        getImg, 
        searchProduct,
        addProduct,
        deleteProduct,
        editProduct} from '../controller/products.js';
import { ifProductExist } from '../middlewares/productsValidation.js';

const route = express.Router();

route.get('/all', getProducts );
route.get('/:id/:type', getProductById, getImg);
route.post('/search', searchProduct);
route.post('/add/', ifProductExist, addProduct);
route.put('/edit/:id', editProduct);
// route.put('/edit/:old/:new', editProduct);



route.patch('/patch', (req, res)=>{
    res.send("Products patch");
});
route.delete('/delete/:type/:id', deleteProduct);

export default route;
