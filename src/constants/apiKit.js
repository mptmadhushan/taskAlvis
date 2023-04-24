import axios from 'axios';

let APIKit = axios.create({
  baseURL: 'https://lcoalhost:3002/',
  timeout: 10000,
});

export default APIKit;
