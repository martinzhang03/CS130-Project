import http from "../utils/http";

/**
 * @description Create Task
 * @param {*} data
 * @returns
 */
export const fetchCreateTask = (data) => {
  return http.post(`/api/tasks`, data);
};
