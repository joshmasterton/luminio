import express from 'express';
import dotenv from 'dotenv';
dotenv.config({path: './src/.env'});

const app = express();

app.listen(9001, () => {
	console.log('Listening to server');
});
