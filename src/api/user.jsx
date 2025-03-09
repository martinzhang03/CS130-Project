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

/**
 * @description Get user info
 * @param {*} userId
 * @returns
 */
export const fetchUserInfo = (userId) => {
  return http.get(`/user/user_id/${userId}`);
};

/**
 * @description send reset code
 * @param {*} data
 * @returns
 */
export const fetchSendCode = (data) => {
  return http.post(`/user/reset/code`, data);
};

/**
 * @description reset pwd
 * @param {*} data
 * @returns
 */
export const fetchResetPwd = (data) => {
  return http.post(`/user/reset/confirm`, data);
};

export const fetchUpdateUserInfo = (data) => {
  return http.post(`/user/update`, data);
};
