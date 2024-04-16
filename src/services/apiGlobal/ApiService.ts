import axios from 'axios'

const BASE_URL_DEV = 'https://localhost:44381/'

const axiosInstance = axios.create({
  baseURL: BASE_URL_DEV,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

export async function handleResult(axiosPromise: any) {
  try {
    const response = await axiosPromise

    if (response.data && response.data.status) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject({
        message: 'Invalid response format',
        response: response,
      })
    }
  } catch (error: any) {
    if (error.response) {
      return Promise.reject(error.response.data)
    } else if (error.request) {
      return Promise.reject({
        message: 'No response received',
        request: error.request,
      })
    } else {
      return Promise.reject({
        message: 'Error setting up the request',
        error: error.message,
      })
    }
  }
}

export const ApiClient = {
  get: async (url: string, payload?: any) => await handleResult(axiosInstance.get(url, { params: payload })),
  post: async (url, payload) => await handleResult(axiosInstance.post(url, payload)),
  put: async (url, payload) => await handleResult(axiosInstance.put(url, payload)),
  patch: async (url, payload) => await handleResult(axiosInstance.patch(url, payload)),
  delete: async (url: string, payload?: any) => await handleResult(axiosInstance.delete(url, { data: payload })),
}

export default axiosInstance
