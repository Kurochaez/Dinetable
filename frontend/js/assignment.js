const BASE_URL = 'http://localhost:8000'


let selectedTable = null;
let selectedReservationId = null;

let allReservations = [];

const loadReservations = async () =>{
    try{
        const response = await axios.get(`${BASE_URL}/reservations`);
        allReservations = response.data;
        renderList(response.data);

    }catch( err){
        console.error('Error :',err)
    }
}
const formatTime = (time) => {
    if (!time) return '-';
    return time.slice(0, 5); 
}

//กรองปุ่มหน้า Reserve
const filterByStatus = () => {
    const selectedStatus = document.getElementById('status').value;
    const filtered = allReservations.filter(item => item.Status === selectedStatus);
    renderList(filtered);
}

//ส่วนแสดงข้อมูลหน้าการจอง
const renderList = (data) => {
    const listArea = document.getElementById('list-body');
    listArea.innerHTML = '';

    data.forEach(item => {
        listArea.innerHTML += `
            <div class="list-table-area">
                <div class="list-item">${item.First_name} ${item.Last_name}</div>
                <div class="list-item">${item.Phone_number}</div>
                <div class="list-item">${item.Reserve_date}</div>
                <div class="list-item">${formatTime(item.Start_time)} - ${formatTime(item.End_time)}</div>
                <div class="list-item">${item.Customer_come}</div>
                <div class="list-item">${item.Table_Number || '-'}</div>
                <div class="list-item">
                    <button onclick="openPopup(${item.Reservation_id}, '${item.First_name} ${item.Last_name}', '${item.Start_time} - ${item.End_time}', '${item.Customer_come}')">Assign</button>
                </div>
            </div>
        `;
    });
}

const showMessage = (message, success) => {
    const popMes = document.getElementById('popup-message');
    popMes.innerText = message;
    
    popMes.classList.remove('success', 'error');
    popMes.classList.add(success ? 'success' : 'error');
    popMes.style.display = 'block';

    setTimeout(() => {
        popMes.style.display = 'none';
    }, 2000);
}


const openPopup = async (reservationId, name, time, guests) => {
    selectedReservationId = reservationId;
    selectedTable = null;

    document.getElementById('popup-name').innerText = name;
    document.getElementById('popup-time').innerText = time;
    document.getElementById('popup-guests').innerText = guests;

    document.querySelectorAll('.tables button').forEach(b => {
        b.classList.remove('active', 'reserved');
        b.disabled = false;
    });

    try {
        const response = await axios.get(`${BASE_URL}/tables/reserved`);
        const reservedTables = response.data.map(t => t.Table_Number);

        //ทำให้ปุ่มกดไม่ได้หากจองแล้ว
        document.querySelectorAll('.tables button').forEach(btn => {
            if (reservedTables.includes(btn.innerText)) {
                btn.classList.add('reserved');
                btn.disabled = true;
            }
        });
    } catch (err) {
        console.error('Error:', err);
    }

    document.getElementById('popup').style.display = 'flex';
}

const cancelReservation = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        showMessage('กรุณา Login ก่อน', false);
        return;
    }

    try {
        await axios.patch(
            `${BASE_URL}/reservations/${selectedReservationId}/status`,
            { Status: 'จองไม่สำเร็จ', Table_number: null },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        showMessage('ยกเลิกการจองสำเร็จ', true);
        setTimeout(() => {
            closePopup();
            loadReservations();
        }, 1500);

    } catch (err) {
        showMessage('เกิดข้อผิดพลาด กรุณาลองใหม่', false);
    }
}




const closePopup = () => {
    document.getElementById('popup').style.display = 'none';
    
}


// เลือกโต๊ะใน popup
const selectTable = (btn, tableName) => {
    // ล้าง active ทุกปุ่ม
    document.querySelectorAll('.tables button:not(.reserved)')
        .forEach(b => b.classList.remove('active'));
    
    btn.classList.add('active');
    selectedTable = tableName;
}

const confirmAssign = async () => {
    if (!selectedTable) {
        showMessage('กรุณาเลือกโต๊ะก่อน', false);
        return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
        showMessage('กรุณา Login ก่อน', false);
        return;
    }

    try {
        await axios.patch(
            `${BASE_URL}/reservations/${selectedReservationId}/status`,
            { Status: 'จองสำเร็จ', Table_number: selectedTable },
            { headers: { Authorization: `Bearer ${token}` } } 
        )


        showMessage('Assign สำเร็จ', true); 
        
        setTimeout(() => {
            closePopup();
            loadReservations();
        }, 1500);

    } catch (err) {
        showMessage('เกิดข้อผิดพลาด กรุณาลองใหม่', false); 
    }
}


window.onload = loadReservations;