import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  android: 'http://172.17.25.166:8000/api',
  ios: 'http://localhost:8000',
});

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
