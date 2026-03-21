require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');
const cor = require('cors')

const jwt = require('jsonwebtoken');
const port = process.env.PORT;
const SECRET = process.env.JWT_SECRET;

app.use(bodyParser.json());
app.use(cor());

let conn = null;

const initDBConnection = async ()=>{
    conn = await mysql.createConnection({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        port:process.env.DB_PORT
    })
}

//ตรวจสอบข้อมูลขาเข้า
const validationData = (userData) =>{
    let error = [];
    if(!userData.firstname){error.push('กรุณากรอกชื่อ')}
    if(!userData.lastname){error.push('กรุณากรอกนามสกุล')}
    if(!userData.phone){
        error.push('กรุณากรอกเบอร์โทร');
    } else if(!/^\d+$/.test(userData.phone)){
        error.push('เบอร์โทรต้องเป็นตัวเลขเท่านั้น');
    } else if(userData.phone.length !== 10){
        error.push('เบอร์โทรต้องมี 10 หลัก');
    }
    if(!userData.date){error.push('กรุณากรอกวันที่')}
    if(!userData.starttime){error.push('กรุณากรอกช่วงเวลา')}
    if(!userData.endtime){error.push('กรุณากรอกช่วงเวลา')}
    if(!userData.nog){error.push('กรุณากรอกจำนวนคนที่มา')}
    return error;
}


// Get วัน, เวลา, id เอามาแสดงหน้า dashboard
app.post('/dashboard',async (req,res)=>{
    try {
        let {phone , date} = req.body;

        phone = phone || "";

        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() );
        const fixDate = newDate.toISOString().split('T')[0];
        const results = await conn.query(`
            SELECT 
                u.User_id, 
                -- เปลี่ยนจาก DATE() เป็น DATE_FORMAT()
                DATE_FORMAT(CONVERT_TZ(r.Reserve_date, '+00:00', '+07:00'), '%Y-%m-%d') AS Reserve_date, 
                r.Start_time, 
                r.End_time, 
                t.Table_Number 
            FROM User u
            INNER JOIN Reservations r ON r.User_id = u.User_id
            INNER JOIN \`Table Detail\` t ON t.Table_ID = r.Table_id
            WHERE r.Status = 'จองสำเร็จ' 
            AND (u.Phone_number LIKE ? AND DATE(CONVERT_TZ(r.Reserve_date, '+00:00', '+07:00')) = ?)
            ORDER BY Reserve_date, r.Start_time, r.End_time ASC
        `, [`%${phone}%`, fixDate])
        res.status(200).json({
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// view assignment
app.post('/get-assignment',async (req,res)=>{
    try {
        let {phone , status} = req.body;

        phone = phone || "";

        const results = await conn.query(`
            SELECT u.User_id , r.Reserve_date , r.Start_time , r.End_time , t.Table_Number , u.First_name , u.Last_name , u.Phone_number , r.Customer_come , t.Table_Number
            FROM User u
            INNER JOIN Reservations r ON r.User_id = u.User_id
            INNER JOIN \`Table Detail\` t ON t.Table_ID = r.Table_id
            WHERE r.Status = ? AND u.Phone_number LIKE ? 
            ORDER BY r.Reserve_date , r.Start_time , r.End_time ASC
        `, [status , `%${phone}%`])
        res.status(200).json({
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Get all User data
app.get('/users',async (req,res)=>{
    try {
        const [rows] = await conn.query('SELECT * FROM User')
        res.status(200).json({
            data: rows
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
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
                r.Start_time,
                r.End_time,
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


//เส้น GET หน้า Reservation
app.get('/reservations',async (req,res) => {
    try{
        const [result] = await conn.query(`
            SELECT
            r.Reservation_id,
            u.First_name,
            u.Last_name,
            u.Phone_number,
            DATE_FORMAT(r.Reserve_date, '%Y-%m-%d') AS Reserve_date,
            r.Start_time,
            r.End_time,
            r.Customer_come,
            r.Status,
            td.Table_Number
            FROM Reservations r
            JOIN User u ON r.User_id = u.User_id
            LEFT JOIN \`Table Detail\` td ON r.Table_id = td.Table_ID
            ORDER BY r.Reservation_id DESC`);
            res.json(result);
    }catch (error){
        res.status(500).json({
            message:error.message
        });
    }
})

//เส้นดูโต๊ะที่จองแล้ว
app.get('/tables/reserved', async (req, res) => {
    try {
        const [result] = await conn.query(
            `SELECT td.Table_Number 
             FROM Reservations r
             JOIN \`Table Detail\` td ON r.Table_id = td.Table_ID
             WHERE r.Status = 'จองสำเร็จ'`
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});  



//เส้นส่งข้อมูลการจองของลูกค้า
app.post('/reservation',async (req,res)=>{
    let userData = req.body;
    try{
        const error = validationData(userData);
        if(error.length > 0){
            return res.status(400).json({
                message:'กรอกข้อมูลไม่ครบถ้วน',
                error:error
            });
        }
        const {firstname,lastname,phone,date,starttime,endtime,nog} = userData;
        const [userResult] = await conn.query(`INSERT INTO User (First_name,Last_name,Phone_number) VALUES (?,?,?)`,[firstname,lastname,phone]);

        const newUserId = userResult.insertId;

        const [reservationResult] = await conn.query(`INSERT INTO Reservations (User_id,Reserve_date,Start_time,End_time,Customer_come,Status) VALUES (?,?,?,?,?,'รอดำเนินการ')`,[newUserId,date,starttime,endtime,nog])

        res.status(200).json({
            message:'จองสำเร็จ',
            reservationId:reservationResult.insertId
        })
    }catch (error){
        res.status(500).json({
            message:error.message || 'Internal Server error'
        })
    }
})

// เส้น login ระบบ Admin post
 
app.post('/login',async(req,res)=>{
    try{ 
        const {usernameDOM,passwordDOM} = req.body;

        const [result] = await conn.query('SELECT * FROM Admin WHERE Admin_user = ? AND Admin_password = ?',[usernameDOM,passwordDOM]);
        if(result.length === 0){
            return res.status(401).json({message:' ชื่อผู้ใช้ไม่ถูกต้อง '});
        }
        const token = jwt.sign(
            { Admin_id: result[0].Admin_id },
            SECRET,
            { expiresIn: '1d' }
        );
        res.json({
            message:' เข้าสู่ระบบสำเร็จ',
            token
        })
    }catch (error){
        console.error('Error :',error);
        res.status(500).json({
            message:error.message
        })
    }
})




//เส้น Patch เปลี่ยนสถานะการจองของลูกค้า
app.patch('/reservations/:id/status', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);
        const currentAdminId = decoded.Admin_id;

        const { id } = req.params;
        const { Status, Table_number } = req.body;

        let tableId = null;
        
        // หา tableId เฉพาะตอนที่มี Table_number
        if (Table_number) {
            const [Table] = await conn.query(
                'SELECT Table_ID FROM `Table Detail` WHERE Table_Number = ?',
                [Table_number]
            );
            tableId = Table[0]?.Table_ID || null;

            // UPDATE Table Detail เป็นไม่ว่าง
            await conn.query(
                'UPDATE `Table Detail` SET Current_Status = ? WHERE Table_ID = ?',
                ['ไม่ว่าง', tableId]
            );
            // INSERT Table_Status
            await conn.query(
                'INSERT INTO Table_Status (Table_id, Admin_id, Start_time, End_time, Status) VALUES (?, ?, NOW(), NOW(), ?)',
                [tableId, currentAdminId, 'โต๊ะไม่ว่าง']
            );
        } else {
            //  ยกเลิกการจอง + คืนค่าโต๊ะให้ว่าง
            const [reservation] = await conn.query(
                'SELECT Table_id FROM Reservations WHERE Reservation_id = ?', [id]
            );
            const oldTableId = reservation[0]?.Table_id;

            if (oldTableId) {
                await conn.query(
                    'UPDATE `Table Detail` SET Current_Status = ? WHERE Table_ID = ?',
                    ['ว่าง', oldTableId]
                );
            }
        }

        // UPDATE Reservations
        await conn.query(
            'UPDATE Reservations SET Status = ?, Table_id = ?, Admin_id = ? WHERE Reservation_id = ?',
            [Status, tableId, currentAdminId, id]
        );

        res.json({ message: 'อัปเดตสำเร็จ' });

    } catch (err) {
        console.error('Error detail:', err.message);
        res.status(500).json({ message: err.message });
    }
});

app.listen(port,async()=>{
    await initDBConnection();
    console.log(`Server is running on port ${port}`)
})