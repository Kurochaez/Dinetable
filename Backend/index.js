const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');
const cor = require('cors')
const port = 8000;

app.use(bodyParser.json());
app.use(cor());

let conn = null;

const initDBConnection = async ()=>{
    conn = await mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'root',
        database:'StoreDB',
        port:8820
    })
}

