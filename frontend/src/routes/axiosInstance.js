import axios from 'axios';
import { store, persistor } from '../redux/store';
import { setAuthUser, setSelectedUser, setAllOthersUser } from '../redux/userSlice';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('token');
            try {
                store.dispatch(setAuthUser(null));
                store.dispatch(setSelectedUser([]));
                store.dispatch(setAllOthersUser([]));
                persistor.purge();
            } catch (err) {
                console.error("Purge session error:", err);
            }
        }
        return Promise.reject(error);
    }
);