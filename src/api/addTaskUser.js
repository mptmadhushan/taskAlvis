import {postRequest} from './utils';

export const addUserTask = data => postRequest('/user/addTask', data);
