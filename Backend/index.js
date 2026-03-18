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
        res.json({
            message:' เข้าสู่ระบบสำเร็จ',
            data:result[0]
        })
    }catch (error){
        console.error('Error :',error);
        res.status(500).json({
            message:error.message
        })
    }
})


app.listen(port,async()=>{
    await initDBConnection();
    console.log(`Server is running on port ${port}`)
})