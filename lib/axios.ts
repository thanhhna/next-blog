import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : `http://192.168.0.174:8080`
});

export default instance;