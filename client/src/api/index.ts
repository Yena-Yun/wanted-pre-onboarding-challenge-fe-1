import axios from 'axios';

let token = localStorage.getItem('authToken');

export const serverAxios = axios.create({
  baseURL: 'http://localhost:8080',
});
