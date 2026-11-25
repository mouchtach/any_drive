import axios from 'axios'
import { API_URL } from '@/constants/config'
import { setupInterceptors } from './interceptors'

/** The only Axios instance of the app. Pages never call axios directly. */
const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

setupInterceptors(axiosClient)

export default axiosClient
