import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import  userRoute from './src/route/usersRoute.js';
import { URL } from 'url';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limited: '50mb', extended: true }));

app.post('/login/')
// app.post('/signup/')

app.use('/users', userRoute);

app.listen(8000, ()=>{
  console.log('Server is running on port 8000');
});