import axios from 'axios';

export const authToken = localStorage.getItem('authToken') || '';

export const serverAxios = axios.create({
  baseURL: 'http://localhost:8080',
});
