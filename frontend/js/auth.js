function updateMenuVisibility() {
    const token = localStorage.getItem('adminToken'); 
    const assignmentMenu = document.getElementById('assignmentMenu');
    const loginMenu = document.getElementById('loginMenu');
    const logoutMenu = document.getElementById('logoutMenu');

    if (assignmentMenu) {
        if (!token) {
            assignmentMenu.style.display = 'none'; 
            logoutMenu.style.display = 'none'; 
            loginMenu.style.display = 'normal';
        } else {
            assignmentMenu.style.display = 'normal';
            logoutMenu.style.display = 'normal';
            loginMenu.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', updateMenuVisibility);
window.addEventListener('pageshow', updateMenuVisibility);

// ตรวจสอบว่าอยู่หน้า assignment 
const currentPath = window.location.pathname;

// ป้องกันการผ่าน path โดยตรง
if (currentPath.includes('assignment')) {
    const token = localStorage.getItem('adminToken');
    // ถ้าอยู่หน้า assignment แต่ไม่มี Token ให้เด้งกลับไปหน้า login 
    if (!token) {
        alert('กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้านี้');
        window.location.href = '/frontend/pages/admin/login.html'; 
    }
}