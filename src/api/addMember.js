import {postRequest} from './utils';

export const detailsApi = data => postRequest('/user/addTask', data);
