import http from "../utils/http"

/**
 * @description Login
 * @param {*} data 
 * @returns 
 */
export const fetchLogin = (data) => {
return http.post(`/api/user/login`,data)
}

/**
 * @description Register
 * @param {*} data 
 * @returns 
 */
export const fetchRegister = (data) => {
    return http.post(`/api/user/register`,data)
}