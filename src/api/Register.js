import {postRequest} from './utils';

export const register = data => postRequest('/auth/signup', data);
