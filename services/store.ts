/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Context } from '@nuxt/types'
// import type { StoreModules } from '@/store'

type KeysOf<ObjType extends object> = (keyof ObjType)[]

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

    // Object.keys(modules).forEach((mod) => {
    //   modules[mod].actions = actions[mod] || {}
    // })

    return modules
  }

  private getType = <T>(value: T): string => (
    Object.prototype.toString.call(value).slice(8, -1)
  )

  private getValueFromPath = <
    O extends Record<string, any>,
    P extends string,
    D extends string = '.'
  > (obj: O, path: P): DeepSearch<O, P, D> => {
    const pathSections = path.split('.')

    if (pathSections.length === 1) {
      return obj[pathSections[0]]
    }

    const [key, ...rest] = pathSections

    return this.getValueFromPath(obj[key as keyof typeof obj], rest.join('.'))
  }

  private generateStates = () => {
    const namespaceMap = this.store._modulesNamespaceMap
    const paths = Object.keys(namespaceMap)
      .map(key => key.slice(0, -1).replace(/\//g, '.')) as (
        Trim<Replace<KeysOf<typeof namespaceMap>[number], '/', '.'>, '.'>
      )[]

    const moduleStates = paths.reduce((acc, path) => {
      const pathModules = path.split('.')
      const moduleName = pathModules[pathModules.length - 1]
      acc[moduleName as keyof typeof acc] = this.getValueFromPath(this.store.state, path)
      return acc
    }, {} as any) as ModuleStates<typeof this.store.state, typeof namespaceMap>

    return moduleStates
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
