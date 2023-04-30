import {postRequest} from './utils';

export const addTask = data => postRequest('/task/add', data);
