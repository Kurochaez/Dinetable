function showSuccessToast(message, seconds) {
    const container = document.getElementById('toast-container');
    
    // สร้าง HTML ของกล่อง Toast
    const toast = document.createElement('div');
    toast.className = 'toast-alert';
    toast.innerHTML = `
        <span>${message}</span>
        <span class="toast-countdown">${seconds}</span>
    `;
    
    container.appendChild(toast);
    
    const countdownElement = toast.querySelector('.toast-countdown');
    let timeLeft = seconds;
    
    // ตั้งเวลานับถอยหลังทุกๆ 1 วินาที
    const timer = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        // เมื่อเวลาหมด ให้ซ่อนและลบออก
        if (timeLeft <= 0) {
            clearInterval(timer);
            toast.classList.add('hide'); // เล่นแอนิเมชันสไลด์ออก
            
            // รอให้แอนิเมชันเล่นจบ (0.4 วิ) แล้วค่อยลบออกจาก HTML
            setTimeout(() => {
                toast.remove();
            }, 400); 
        }
    }, 1000);
}