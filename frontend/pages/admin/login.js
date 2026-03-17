const BASE_URL = 'http://localhost:8000'

const login = async () =>{
    const usernameDOM = document.querySelector('input[name="username"]').value;
    const passwordDOM = document.querySelector('input[name="password"]').value;
    const errMessageDOM = document.getElementById('error-message');

    if(!usernameDOM || !passwordDOM){
        errMessageDOM.style.display = 'block';
        errMessageDOM.innerText='กรุณากรอกให้ครบถ้วน';
        return;
    }
    try{
        const response = await axios.post(`${BASE_URL}/login`,{usernameDOM,passwordDOM});
        sessionStorage.setItem('admin', JSON.stringify(response.data.data));

         window.location.href = '/frontend/components/dashboard/dashboard.html';

    }catch (err){
        errMessageDOM.style.display='block';
        errMessageDOM.innerText='Admin Username or Password invalid';

    }
}