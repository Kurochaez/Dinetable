const formLogin = document.querySelector(".form-login");


formLogin.addEventListener('submit', async function(e) {

    e.preventDefault();

    const formData = new FormData(this);

    const data = {
        usernameDOM : formData.get('username'),
        passwordDOM : formData.get('password')
    }

    try {
        // ส่ง api ไปที่เส้น login
        const response = await api.admin.login(data);

        console.log("response", response);

        if (response.status == 200) {
            console.log('Login Success:', response.data.message);
            
            localStorage.setItem('adminToken', response.data.token);
            
            // เปลี่ยนหน้าไป assignment
            window.location.href = '/frontend/pages/admin/assignment.html'; 
        } else {
            const invalidMessage = document.getElementsByClassName("error-message");
            invalidMessage[0].innerHTML = 'Admin Username or Password invalid'
            invalidMessage[0].style.display = block;

            alert('เกิดข้อผิดพลาด: ' + response.data.message);
            invalidMessage.inner
        }

    } catch (error) {
        console.error('API Connection Error:', error);
        alert('ไม่สามารถเชื่อมต่อระบบได้ในขณะนี้');
    }
});