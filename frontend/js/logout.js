document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logoutMenu') {
        e.preventDefault(); 
        // ป้องกันไม่ให้พาโหลดหน้าใหม่
        
        localStorage.removeItem('adminToken');
        
        // กลับไปที่หน้า Login
        if(!localStorage.getItem('adminToken')) {
             console.log("ลบ Token สำเร็จ เตรียมเด้งกลับ...");
             window.location.href = '/frontend/pages/admin/login.html'; 
        } else {
             alert("เกิดข้อผิดพลาด ลบ Token ไม่สำเร็จ");
        }
    }
});