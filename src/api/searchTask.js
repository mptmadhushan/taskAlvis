import {postRequest} from './utils';

export const login = data => postRequest('/task/search', data);
