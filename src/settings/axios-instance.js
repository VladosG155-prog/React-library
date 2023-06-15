import axios from 'axios';
import { baseApiUrl } from './api';

const instance = axios.create();

instance.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwt')}`;

// eslint-disable-next-line
export default instance;
