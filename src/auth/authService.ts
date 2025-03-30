import axios from 'axios';
import { API_URL } from '../config/index';

export const register = async (email: string, password: string, device: string = "") => {
  try {
    const response = await axios.post(`${API_URL}/registerhykfdsfafdfd`, { email, password, device });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('token', response.data.token); // Store JWT in localStorage
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const encrypt = async (access: string) => {
    try {
        const response = await axios.get(`${API_URL}/encrypt?access=${access}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const logout = () => {
  localStorage.removeItem('token'); // Remove token on logout
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    return decoded;
  } catch (error) {
    return null;
  }
};


export interface Item {
    id: string;
    date: string;
    time: string;
    site: string;
    device: string;
    log?: string;
    update_date?: string;
    username?: string;
    password?: string;
}
  
 export interface ScreenshotItem {
    id: string;
    screenshot: string;
    date: string;
    site: string;
}