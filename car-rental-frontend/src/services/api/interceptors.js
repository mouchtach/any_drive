import tokenStorage from '@/features/auth/utils/tokenStorage'
import { ENDPOINTS } from './endpoints'

/** Event fired when the backend says our session is no longer valid (401). */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

export function setupInterceptors(client) {
  // 1) attach the JWT to every request
  client.interceptors.request.use((config) => {
    const token = tokenStorage.get()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  // 2) normalize errors + handle expired sessions
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status
      const isLoginCall = error.config?.url === ENDPOINTS.AUTH.LOGIN

      if (status === 401 && !isLoginCall) {
        tokenStorage.clear()
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
      }

      const apiMessage = error.response?.data?.message
      error.userMessage = Array.isArray(apiMessage)
        ? apiMessage.join(' ')
        : apiMessage ||
          (error.code === 'ERR_NETWORK'
            ? 'Cannot reach the server. Please try again.'
            : 'Something went wrong. Please try again.')
      return Promise.reject(error)
    },
  )
}
