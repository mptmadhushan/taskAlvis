import {postRequest} from './utils';

export const updateUser = data => postRequest('/user/update', data);
