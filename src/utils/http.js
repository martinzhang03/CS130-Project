
import axios from "axios"

const http = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 60 * 1000,
    // headers: {'Content-Type': "application/json"}
})

http.interceptors.request.use((config) => {
    console.log(config)
    return config
},(error) => {
    return Promise.reject(error)
})

http.interceptors.response.use((response) => {
    console.log(response)
    return response
},(error)=> {
    return Promise.reject(error)
})

export default http

