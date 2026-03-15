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

// Get User data
app.get('/users',async (req,res)=>{
    const results = await conn.query('SELECT * FROM User');
    res.json(results[0]);
})

//Get User data by Id user
app.get('/users/:id',async (req,res)=>{
    try{
        let id = req.params.id;
        const [results] = await conn.query(`
            SELECT 
                u.User_id,
                u.First_name,
                u.Last_name,
                u.Phone_number,
                r.Reservation_id,
                DATE_FORMAT(r.Reserve_date, '%Y-%m-%d') AS Reserve_date,
                r.Reserve_time,
                r.Status
            From User u
            LEFT JOIN Reservations r ON u.User_id = r.User_id
            WHERE u.User_id = ?`,[id]
            )
        if(results.length === 0){
            return res.status(404).json({message:'ไม่พบผู้ใช้'})
        }
        res.json({data:results});
    }catch (error){
        console.error('Error detail: ',error);
        res.status(500).json({message:error.message || 'Internal Server error'});
    }
});

    

app.listen(port,async()=>{
    await initDBConnection();
    console.log(`Server is running on port ${port}`)
})