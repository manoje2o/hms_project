// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://e2otech-001-site1.ltempurl.com/api',
});

export default instance;
