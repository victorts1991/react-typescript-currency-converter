import axios from 'axios';

const API_KEY = import.meta.env.VITE_CURRENCYAPI_KEY;
const BASE_URL = import.meta.env.VITE_CURRENCYAPI_BASE_URL;

if (!API_KEY) {
  console.error("key is not defined");
}

const currencyApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'apikey': API_KEY, 
    'Content-Type': 'application/json',
  },
});

export default currencyApi;