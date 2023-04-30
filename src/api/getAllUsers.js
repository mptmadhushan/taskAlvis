import {getRequest} from './utils';

export const getAllUsers = () => getRequest('/user/getAll');
