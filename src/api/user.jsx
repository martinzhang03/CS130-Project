import http from "../utils/http"

/**
 * @description Login
 * @param {*} data 
 * @returns 
 */
export const fetchLogin = (data) => {
return http.post(`/api/user/login`,data)
}