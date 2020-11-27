import { KEY } from '@/store/storage';
import axios from 'axios';

export const REQUEST_OPTIONS = {
    timeout: 15000,
    // baseURL: 'http://localhost:3050/',
    // baseURL: process.env.BASE_URL || 'http://localhost:3050/',
    baseURL: '/',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Access-Control-Allow-Origin': "*",
        // 'Access-Control-Allow-Credentials': true,
    }
}

class BaseAPI {

    constructor() { }

    public API = (requestConfig: any) => {
        const defaultConfig = REQUEST_OPTIONS;
        const handleTokenExpired = async (error: any) => {
            //...
        }
        const instance = axios.create(defaultConfig);

        instance.interceptors.request.use(function (config) {
            config.headers.Authorization =  `Bearer ${window.localStorage.getItem(KEY.ACCESS_TOKEN)}`;
        
            return config;
        });

        return instance(requestConfig).catch(handleTokenExpired)
    }
}

export default new BaseAPI();