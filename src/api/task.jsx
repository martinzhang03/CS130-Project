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
  return http.post(`/tasks/task_edit/${data.task_id}`, data);
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

export const fetchChangeProgress = (data) => {
  return http.post(`/tasks/task_progress/${data.task_id}`, data);
};
