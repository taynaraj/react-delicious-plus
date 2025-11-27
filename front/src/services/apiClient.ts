import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Garante que a URL seja absoluta (comece com http:// ou https://)
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  
  // Se não começar com http:// ou https://, adiciona https://
  if (envURL && !envURL.startsWith('http://') && !envURL.startsWith('https://')) {
    return `https://${envURL}`;
  }
  
  return envURL;
};

const baseURL = getBaseURL().replace(/\/$/, ''); // Remove barra final se houver

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('react-delicious-token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Sanitiza dados para criação de collections: remove campos não permitidos
    if (config.method === 'post' && config.url?.includes('/api/collections') && config.data) {
      const allowedFields = ['name', 'emoji', 'description'];
      const sanitizedData: any = {};
      
      for (const field of allowedFields) {
        if (field in config.data) {
          sanitizedData[field] = config.data[field];
        }
      }
      
      config.data = sanitizedData;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      let errorMessage = 'Erro ao processar requisição';
      
      if (data?.error) {
        errorMessage = data.error;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (error.response.statusText) {
        errorMessage = `${status}: ${error.response.statusText}`;
      }
      
      if (status === 401) {
        localStorage.removeItem('react-delicious-token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      const customError = new Error(errorMessage);
      (customError as any).status = status;
      (customError as any).response = error.response;
      
      return Promise.reject(customError);
    } else if (error.request) {
      return Promise.reject(new Error('Erro de conexão. Verifique sua internet.'));
    } else {
      return Promise.reject(new Error(error.message || 'Erro ao processar requisição'));
    }
  }
);

export default apiClient;
