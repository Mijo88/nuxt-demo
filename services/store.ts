/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Context } from '@nuxt/types'
// import type { StoreModules } from '@/store'

class Store {
  private _store: TG.Store | null = null
  private _modules: TG.Store | null = null

  public setup = (store: TG.Store) => {
    this._store = store
    this._modules = this.generateModules()
  }

  private get store (): TG.Store {
    return this._store!
  }

  public get modules (): TG.Store {
    return this._modules!
  }

  public get paths (): string[] {
    return Object.keys(this.store._modulesNamespaceMap).map(path => (
      path.split('/').slice(0, -1).join('/')
    ))
  }

  private generateModules = () => {
    const modules = this.generateStates()
    const actions = this.generateActions()

    Object.keys(modules).forEach((mod) => {
      modules[mod].actions = actions[mod] || {}
    })

    return modules
  }

  private generateStates = () => {
    const root = this.store._modules.root
    const modules: any = {
      root: {
        state: root.state
      }
    }

    Object.keys(this.store._modulesNamespaceMap).forEach((path) => {
      const namespaces = path.split('/').filter(s => !!s)
      const mod = namespaces.pop() as string

      modules[mod] = {
        state: namespaces.reduce((acc, namespace) => acc[namespace], this.store.state)[mod]
      }
    })

    return modules
  }

  private generateActions = () => {
    const paths = Object.keys(this.store._mutations)
    return paths.reduce((acc, path) => {
      const [namespace, action] = path.split('/').slice(-2)
      if (acc[namespace] === undefined) {
        acc[namespace] = {}
      }

      acc[namespace][action] = (payload: any) => this.store.commit(path, payload)

      return acc
    }, {} as any)
  }
}

export const store = new Store()

export const useStore = () => store.modules

export const getStorePaths = () => store.paths

export const setupStore = (nuxtStore: any) => store.setup(nuxtStore)
