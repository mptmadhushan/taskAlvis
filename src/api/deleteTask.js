import {postRequest} from './utils';

export const updateUser = data => postRequest('/task/delete', data);
