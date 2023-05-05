import {postRequest} from './utils';

export const addTask = data => postRequest('/user/addTask', data);
