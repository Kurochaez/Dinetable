const startSelect = document.getElementById('starttime');
const endSelect = document.getElementById('endtime');

endSelect.disabled = true;

// กำหนดเวลา 10:00 ถึง 22:00 ให้ start / end
for (let i = 10; i <= 22; i++) {
    let hour = i.toString().padStart(2, '0');
    let timeValue = `${hour}:00`;
    
    let startOpt = new Option(timeValue, timeValue);
    if (i === 22) startOpt.disabled = true;
    startSelect.add(startOpt);

    let endOpt = new Option(timeValue, timeValue);
    if (i === 10) endOpt.disabled = true;
    endSelect.add(endOpt);
}

// เพิ่ม Event Listener จับเมื่อผู้ใช้เปลี่ยนเวลา Start Time
startSelect.addEventListener('change', function() {

    endSelect.disabled = false;
    const selectedStartHour = parseInt(this.value.split(':')[0]);

    for (let i = 1; i < endSelect.options.length; i++) {
        const optionHour = parseInt(endSelect.options[i].value.split(':')[0]);

        if (optionHour === 10 || optionHour <= selectedStartHour || optionHour > selectedStartHour + 2) {
            endSelect.options[i].disabled = true; 
            // ห้ามกดเลือก
        } else {
            endSelect.options[i].disabled = false;  
            // ให้กดเลือกได้ปกติ
        }
    }

    if (endSelect.value !== "") {
        const currentEndHour = parseInt(endSelect.value.split(':')[0]);
        if (currentEndHour <= selectedStartHour || currentEndHour > selectedStartHour + 2) {
            endSelect.value = ""; 
        }
    }
});

// Get all  data Reserve

// ดักจับตอนกด Submit ฟอร์มแล้วส่งข้อมูลผ่าน api
const formReserve = document.querySelector('.form-reserve');

formReserve.addEventListener('submit', async function(e) {
    e.preventDefault(); 
    // ไม่ให้รีตอนกดปุ่ม

    const formData = new FormData(this);

    const reserveData = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        starttime: formData.get('starttime'),
        endtime: formData.get('endtime'),
        nog: parseInt(formData.get('nog')) 
    };


    console.log("data", reserveData)

    // เรียกใช้ api ->  Backend
    try {
        const response = await api.reserve.create(reserveData);
        
        if (response.status == 200) {
            showSuccessToast('จองโต๊ะสำเร็จเรียบร้อยแล้ว!', 5);
            this.reset(); 
            endSelect.disabled = true;
        }
    } catch (error) {
        console.error('Error reserving table:', error);
        
       
        if (error.response && error.response.data.message) {
            alert(`ข้อผิดพลาด: ${error.response.data.message}`);
        } else {
            alert('เกิดข้อผิดพลาดในการจองโต๊ะ กรุณาลองใหม่อีกครั้ง');
        }
    }
});