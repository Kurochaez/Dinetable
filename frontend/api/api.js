const BASE_URL = 'http://localhost:8000'

const api = {
    reserve: {
        create : (data) => axios.post(`${BASE_URL}/reservation`, data),
        getAll : () => axios.get(`${BASE_URL}/reservations`),
        dashboard : (data) => axios.post(`${BASE_URL}/dashboard`, data),
    },
    admin:{
        login: (data) => axios.post(`${BASE_URL}/login`, data),
        getAssignment : (data) => axios.post(`${BASE_URL}/get-assignment`, data),
    }
}