import express from 'express';
import path from 'path'
import bodyParser from 'body-parser';
import cors from 'cors';
import { URL } from 'url';
import { authenticateToken, userVerify  } from './src/middlewares/authUtils.js';
import { signUpUser } from './src/controller/users.js';
import { loggers } from './src/middlewares/logger.js';

import products from './src/route/productsRoute.js';
import users from './src/route/usersRoute.js';
import stocks from './src/route/stocksRoute.js';
import POS from './src/route/POSRoute.js';
import sales from './src/route/salesRoute.js';

const app = express();


app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limited: '50mb', extended: true }));

const __dirname = new URL('.', import.meta.url).pathname;
app.use('assets', express.static(path.join(__dirname, 'src', 'assets')));

app.post('/login/', userVerify);
app.post('/signup/', signUpUser);
app.use('/POS', POS);

app.use(loggers);
// app.use(authenticateToken);

app.use('/users', users);
app.use('/products', products);
app.use('/stocks', stocks);
app.use('/sales', sales);

app.listen(8000,()=>{
    console.log("8000 up!");
});
// app.listen(8000, '0.0.0.0',()=>{ //for local hosting under network
//     console.log("8000 up!");
// });
