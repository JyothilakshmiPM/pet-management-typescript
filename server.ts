import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import db_url from "./config/config";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { petRoute } from './routes/routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req: Request,res: Response) => {
    res.send('Typescript with express');
});

mongoose.connect(db_url, (err: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Database Connected Successfully!");
    }
});

app.use('/api', petRoute());

app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

export {app};