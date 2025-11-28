import { auth } from '@/auth'
import { isServerSide } from '@/lib/is-server-side'
import axios, { AxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

function firstItemToObject(
  obj: Record<string, string[]>,
): Record<string, string> {
  const newObj: Record<string, string> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = obj[key][0]
    }
  }
  return newObj
}

export type ResponseErrorType = {
  message: string
  status: number
  errors: {
    [key: string]: string
  }
}

// A classe existe apenas internamente para o interceptor lançar o erro
export class ResponseError extends Error implements ResponseErrorType {
  errors: {
    [key: string]: string
  }

  status: number

  constructor(
    message: string,
    errors: {
      [key: string]: string
    },
    status: number,
  ) {
    super(message)
    this.errors = errors
    this.status = status
  }
}

const baseApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
})

baseApi.interceptors.request.use(async (config) => {
  let token = null
  if (isServerSide()) {
    const session = await auth()
    token = session?.user?.token
  } else {
    const session = await getSession()
    token = session?.user?.token
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

baseApi.interceptors.response.use(
  (response) => response.data,
  async ({ response }) => {
    if (response && response.status === 422) {
      const errors = firstItemToObject(response.data.errors)
      throw new ResponseError(response.data.message, errors, response.status)
    }
    
    // Tratamento seguro caso response seja undefined ou outro erro
    const message = response?.data?.message || 'Ocorreu um erro desconhecido.'
    const status = response?.status || 500
    throw new ResponseError(message, {}, status)
  },
)

export async function api<T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  config?: AxiosRequestConfig,
): Promise<
  | { response: T; error: undefined }
  | { response: undefined; error: ResponseErrorType }
> {
  try {
    const response = await baseApi.request<T>({
      method,
      url,
      ...config,
    })
    return { response: response as T, error: undefined }
  } catch (e) {
    const errorObj = e as ResponseError

    if (
      errorObj.status === 401 ||
      errorObj.status === 403
    ) {
      if (isServerSide()) {
        redirect('/auth/sign-out')
      } else {
        window.location.href = '/auth/sign-out'
      }
    }

    // --- CORREÇÃO CRUCIAL AQUI ---
    // Em vez de retornar 'error: errorObj' (que é uma Classe),
    // criamos um objeto simples (Plain Object) manualmente.
    // Isso resolve o erro "Only plain objects can be passed..."
    return { 
      response: undefined, 
      error: {
        message: errorObj.message || 'Erro de conexão',
        status: errorObj.status || 500,
        errors: errorObj.errors || {}
      } 
    }
  }
}