const BASE_URL = 'http://localhost:8000'





const validationData = (userData) =>{
    let error = [];
    if(!userData.firstname){error.push('กรุณากรอกชื่อ')}
    if(!userData.lastname){error.push('กรุณากรอกน้ำสกุล')}
    if(!userData.phone){error.push('กรุณากรอกเบอร์โทร')}
    if(!userData.date){error.push('กรุณากรอกวันที่')}
    if(!userData.starttime){error.push('กรุณากรอกช่วงเวลา')}
    if(!userData.endtime){error.push('กรุณากรอกช่วงเวลา')}
    if(!userData.nog){error.push('กรุธากรอจำนวนคนที่มา')}
    return error;
}

const SubmitData = async () =>{
    let firstnameDOM = document.querySelector('input[name="firstname"]');
    let lastNameDOM = document.querySelector('input[name="lastname"]');
    let phoneDOM = document.querySelector('input[name="phone"]');
    let dateDOM = document.querySelector('input[name="date"]');
    let startTimeDOM = document.querySelector('input[name="starttime"]')
    let endTimeDOM = document.querySelector('input[name="endtime"]');
    let nogDOM = document.querySelector('input[name="nog"]')
    try{
        let userData = {
            firstname:firstnameDOM.value,
            lastname:lastNameDOM.value,
            phone:phoneDOM.value,
            date:dateDOM.value,
            starttime:startTimeDOM.value,
            endtime:endTimeDOM.value,
            nog:nogDOM.value

        }
        let error = validationData(userData) || [];
        if(error.length>0){alert('กรอกข้อมูลให้ครบถ้วน')
            return
        }
        const response = await axios.post(`${BASE_URL}/reservation`,userData);
        console.log(response.data)
        
    
    }catch(error){
        alert(error.response?.data?.message || 'เกิดข้อผิดพลาด')
        console.error(error)
    }

        
}

