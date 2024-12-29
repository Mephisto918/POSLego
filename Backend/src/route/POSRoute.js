import express from 'express';

import { getProducts, doTransaction} from '../controller/POS.js';

const route = express.Router();

route.get('/all', getProducts );
// route.get('/:id/:type', getProductById, getImg);

route.post('/transact', doTransaction);

export default route;