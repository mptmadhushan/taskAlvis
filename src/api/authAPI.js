import {postRequest} from './utils';

export const login = data => postRequest('/auth/signin', data);
