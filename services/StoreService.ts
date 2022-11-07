/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Context } from '@nuxt/types'
import type { StoreModules } from '@/store'

const store = new class StoreService {
  private _store: any = null
  private _modules: StoreModules | null = null

  public init = (store: any) => {
    this._store = store
    this._modules = this.generateModules()
  }

  public get modules (): StoreModules {
    return this._modules!
  }

  public get paths (): string[] {
    return Object.keys(this._store._modulesNamespaceMap).map(path => (
      path.split('/').slice(0, -1).join('/')
    ))
  }

  private generateModules = () => {
    const modules = this.generateStates()
    const mutations = this.generateMutations()
    const getters = this.generateGetters()

    Object.keys(modules).forEach((mod) => {
      modules[mod].mutations = mutations[mod] || {}
      modules[mod].getters = getters[mod] || {}
    })

    return modules
  }

  private generateStates = () => {
    const root = this._store._modules.root
    const modules: any = {
      root: {
        state: root.state
      }
    }

    Object.keys(this._store._modulesNamespaceMap).forEach((path) => {
      const namespaces = path.split('/').filter(s => !!s)
      const mod = namespaces.pop() as string

      modules[mod] = {
        state: namespaces.reduce((acc, namespace) => acc[namespace], this._store.state)[mod]
      }
    })

    return modules
  }

  private generateMutations = () => {
    const paths = Object.keys(this._store._mutations)
    return paths.reduce((acc, path) => {
      const [namespace, mutation] = path.split('/').slice(-2)
      if (acc[namespace] === undefined) {
        acc[namespace] = {}
      }

      acc[namespace][mutation] = (payload: any) => this._store.commit(path, payload)

      return acc
    }, {} as any)
  }

  private generateGetters = () => {
    const paths = Object.keys(this._store._wrappedGetters)
    return paths.reduce((acc, path) => {
      const [namespace, getter] = path.split('/').slice(-2)
      if (acc[namespace] === undefined) {
        acc[namespace] = {}
      }

      acc[namespace][getter] = this._store.getters[path]

      return acc
    }, {} as any)
  }
}()

export const useStore = () => store.modules

export const getStorePaths = () => store.paths

export const initializeStore = (nuxtStore: any) => store.init(nuxtStore)
