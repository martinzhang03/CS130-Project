import http from "../utils/http";

/**
 * @description Create Task
 * @param {*} data
 * @returns
 */
export const fetchCreateTask = (data) => {
  return http.post(`/tasks/`, data);
};

export const fetchUpdateTask = (data) => {
  return http.put(`/tasks`, data);
};

/**
 * @description Get Takss
 * @returns
 */
export const fetchTasks = (params) => {
  return http.get(`/tasks`, params);
};

export const fetchTasksByUserId = (id) => {
  return http.get(`/tasks/user_id/${id}`);
};

export const fetchDelTasks = (id) => {
  return http.delete(`/tasks/task_id/${id}`);
};
