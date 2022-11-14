import type { NuxtAxiosInstance } from '@nuxtjs/axios'

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

type Query = string | { [param: string]: string } | [string, string | string[]]

type RequestOptions = {
  query?: Query
}

class Http {
  private http: NuxtAxiosInstance | null = null

  public setup = (http: NuxtAxiosInstance) => {
    this.http = http
  }

  public get = async (url: string, options: RequestOptions) => {
    const { controller, request } = this.makeRequest(url, 'get', options)
  }

  private makeRequest = (
    url: string,
    method: RequestMethod,
    options: RequestOptions,
    data?: any
  ) => {
    const controller = new AbortController()
    switch (method) {
      case 'get': return { controller, request: this.http!.$get(url, options) }
      case 'post': return { controller, request: this.http!.$post(url, data, options) }
      case 'put': return { controller, request: this.http!.$put(url, data, options) }
      case 'patch': return { controller, request: this.http!.$patch(url, data, options) }
      case 'delete': return { controller, request: this.http!.$delete(url, options) }
    }
  }
}

export const http = new Http()
