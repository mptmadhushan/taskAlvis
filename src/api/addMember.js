import {postRequest} from './utils';

export const detailsApi = data => postRequest('/v1.0/user/', data);
