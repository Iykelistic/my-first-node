import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import router from './routes';
import './cloudinary';
import { hostname } from 'os';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1', router);

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome to my first Node.js application!',
        success: true
    });
});

app.all('*', (req, res) => {
    res.status(404).json({
        message: 'This route does not exist',
        success: false
    })
});

app.listen(port, hostname, () => {
    console.log(`Server running at ${hostname} on port ${port}`);
});

// const http = require('http');

// const hostname = '127.0.0.1';
// const port = process.env.PORT || 3000;

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello JavaScript\n');
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}`);
// });