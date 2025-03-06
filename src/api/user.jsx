import http from "../utils/http";

/**
 * @description Login
 * @param {*} data
 * @returns
 */
export const fetchLogin = (data) => {
  return http.post(`/user/login`, data);
};

/**
 * @description Register
 * @param {*} data
 * @returns
 */
export const fetchRegister = (data) => {
  return http.post(`/user/register`, data);
};

/**
 * @description Get Users
 * @param {*} data
 * @returns
 */
export const fetchUsers = (data) => {
  return http.post(`/user/lists`, data);
};
