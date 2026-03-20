const BASE_URL = 'http://localhost:8000'

const showModal = (type, message, errors = []) => {
    const overlay   = document.getElementById('modal-overlay')
    const modalImg  = document.getElementById('modal-img')
    const title     = document.getElementById('modal-title')
    const errorBox  = document.getElementById('modal-errors')
    const btn       = document.getElementById('modal-btn')

    if (type === 'success') {
        // ✅ GIF ติ๊กถูก
        modalImg.src = '/frontend/asset/img/verified.gif'
        title.textContent = message
        title.style.color = '#2ecc71'
        errorBox.innerHTML = ''
        btn.className = 'success'
    } else {
        // ❌ GIF กากบาท
        modalImg.src = '/frontend/asset/img/letter-x.gif'
        title.textContent = message
        title.style.color = '#e74c3c'
        // แสดงเหตุผล
        errorBox.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('')
        btn.className = 'error'
    }

    overlay.classList.add('show')
}

const closeModal = () => {
    document.getElementById('modal-overlay').classList.remove('show')
}

const login = async () => {
    const usernameDOM = document.querySelector('input[name="username"]').value
    const passwordDOM = document.querySelector('input[name="password"]').value
    const errMessageDOM = document.getElementById('error-message')

    if (!usernameDOM || !passwordDOM) {
        errMessageDOM.style.display = 'block'
        errMessageDOM.innerText = 'กรุณากรอกให้ครบถ้วน'
        return
    }

    try {
        const response = await axios.post(`${BASE_URL}/login`, { usernameDOM, passwordDOM })
        sessionStorage.setItem('admin', JSON.stringify(response.data.data))

        showModal('success', 'ยินดีต้อนรับ! 👋')

        document.getElementById('modal-btn').addEventListener('click', () => {
            window.location.href = '/frontend/pages/admin/assignment.html';
        }, { once: true })

    } catch (err) {
        errMessageDOM.style.display = 'block'
        errMessageDOM.innerText = 'Admin Username or Password invalid'
    }
}