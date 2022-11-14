import type { Context } from '@nuxt/types'
import type { NuxtAxiosInstance } from '@nuxtjs/axios'

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

type Query = string | { [param: string]: string } | [string, string | string[]]

type AbortContext = {
  namespace: string
  skipAbort: boolean
}

type RequestOptions = {
  params?: Query
  abortContext?: AbortContext
}

type StandardizedResponse<T> = {
  code: number
  status: 'OK' | 'error'
  message: string
  data: T | null
}

type AbortController = {
  namespace: string | null
  token: any
  abort(): void
}

class Http {
  private _http: NuxtAxiosInstance | null = null
  private abortControllers: AbortController[] = []

  public setup = (http: NuxtAxiosInstance) => {
    this._http = http
  }

  private get http () {
    return this._http!
  }

  public get = <T = unknown>(
    url: string,
    options: RequestOptions = {}
  ) => (
    this.prepareRequest<T>(url, 'get', options)
  )

  public delete = <T = unknown>(
    url: string,
    options: RequestOptions = {}
  ) => (
    this.prepareRequest<T>(url, 'delete', options)
  )

  public post = <T = unknown>(
    url: string,
    data: unknown,
    options: RequestOptions = {}
  ) => (
    this.prepareRequest<T>(url, 'post', options, data)
  )

  public put = <T = unknown>(
    url: string,
    data: unknown,
    options: RequestOptions = {}
  ) => (
    this.prepareRequest<T>(url, 'put', options, data)
  )

  public patch = <T = unknown>(
    url: string,
    data: unknown,
    options: RequestOptions = {}
  ) => (
    this.prepareRequest<T>(url, 'patch', options, data)
  )

  private makeAbortController = (namespace: string | null = null): AbortController => {
    const controller = this.http!.CancelToken.source()

    return {
      namespace,
      token: controller.token,
      abort () {
        controller.cancel()
      }
    }
  }

  private standardizeResponse = async <T>(request: Promise<any>): Promise<StandardizedResponse<T>> => {
    try {
      const response = await request

      return {
        code: response.status,
        status: response.status >= 400 ? 'error' : 'OK',
        message: response.statusText,
        data: response.data
      }
    } catch (err: any) {
      const errType = Object.prototype.toString.call(err).slice(8, -1).toLowerCase()
      if (errType.match('error')) {
      // eslint-disable-next-line no-console
        console.error('[REQUEST]', err)
      }

      return {
        code: 500,
        status: 'error',
        message: 'An error occured during the request',
        data: null
      }
    }
  }

  private makeRequest = async <T>(
    request: Promise<any>,
    controller: AbortController
  ): Promise<StandardizedResponse<T>> => {
    const response = await this.standardizeResponse<T>(request)
    this.abortControllers = this.abortControllers.filter(ctrl => ctrl !== controller)

    return response
  }

  private prepareRequest = <T>(
    url: string,
    method: RequestMethod,
    options: RequestOptions = {},
    data?: unknown
  ) => {
    const abortNamespace = options.abortContext ? options.abortContext.namespace : null
    const controller = this.makeAbortController(abortNamespace)

    if (options.abortContext) {
      const { namespace, skipAbort } = options.abortContext
      if (!skipAbort) {
        this.abortControllers.forEach((ctrl) => {
          if (ctrl.namespace === namespace) {
            ctrl.abort()
          }
        })
      }

      this.abortControllers.push(controller)
    }

    const config = { ...options, cancelToken: controller.token }

    switch (method) {
      case 'get': return this.makeRequest<T>(this.http.$get(url, config), controller)
      case 'post': return this.makeRequest<T>(this.http.$post(url, data, config), controller)
      case 'put': return this.makeRequest<T>(this.http.$put(url, data, config), controller)
      case 'patch': return this.makeRequest<T>(this.http.$patch(url, data, config), controller)
      case 'delete': return this.makeRequest<T>(this.http.$delete(url, config), controller)
    }
  }
}

export const http = new Http()

export const useHttp = () => http

export const setupHttp = (httpModule: Context['$axios']) => http.setup(httpModule)
