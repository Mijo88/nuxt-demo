/* eslint-disable @typescript-eslint/no-unused-vars */
import { getKeys } from '@/util'

type KeysOf<ObjType extends object> = (keyof ObjType)[]

type ModuleActionTuple<S extends string> =
  S extends `${infer _}/${infer M}/${infer A}`
  ? ModuleActionTuple<`${M}/${A}`>
  : S extends `${infer M}/${infer A}`
  ? [M, A]
  : never

type FilteredActions<S extends string, M extends string> =
  S extends `${M}/${ModuleActionTuple<S>[1]}`
  ? S
  : S extends `${infer _}/${M}/${infer R}`
  ? FilteredActions<`${M}/${R}`, M> extends `${M}/${ModuleActionTuple<S>[1]}`
    ? S
    : never
  : never

type NamespaceKeys<S extends Record<string, any>> =
  Extract<keyof S['_modulesNamespaceMap'], string>

type ExtractModuleName<P extends string> =
  GetLastOfDelimiter<Transform.ResourceToPath<P>>

type StoreModule<S extends Record<string, any>, P extends string, M extends string> = {
  state: DeepExtract<S, P>
  actions: {
    [P in FilteredActions<Cast<keyof S['_mutations'], string>, M> as ModuleActionTuple<P>[1]]: () => void
  }
}

type StoreModules<
  S extends Record<string, any>,
> = {
  [P in NamespaceKeys<S> as ExtractModuleName<P>]: StoreModule<
    S, Transform.ResourceToPath<`state.${P}`>, ExtractModuleName<P>
  >
}

class Store {
  private _store: TG.Store | null = null
  private _modules: ReturnType<typeof this.generateModules> | null = null

  public setup = (store: TG.Store) => {
    this._store = store
    this._modules = this.generateModules()
  }

  private get store (): TG.Store {
    return this._store!
  }

  public get modules (): ReturnType<typeof this.generateModules> {
    return this._modules!
  }

  public get paths (): string[] {
    return Object.keys(this.store._modulesNamespaceMap).map(path => (
      path.split('/').slice(0, -1).join('/')
    ))
  }

  private getValueFromPath = <
    O extends Record<string, any>,
    P extends string,
    D extends string = '.'
  > (obj: O, path: P): DeepExtract<O, P, D> => {
    const pathSections = path.split('.') as Split<typeof path, '.'>

    if (pathSections.length === 1) {
      return obj[pathSections[0]]
    }

    const [key, ...rest] = pathSections

    return this.getValueFromPath(obj[key as keyof typeof obj], rest.join('.'))
  }

  private getModuleActions = <
    O extends Record<string, any>,
    M extends string
  > (actions: O, moduleName: M) => {

  }

  private generateModules = () => {
    const map = this.store._modulesNamespaceMap
    const paths = Object.keys(map)
      .map(key => key.slice(0, -1).replace(/\//g, '.')) as (Trim<
          Replace<KeysOf<typeof map>[number], '/', '.'>
      >)[]

    const modules = paths.reduce((acc, path) => {
      const pathModules = path.split('.') as Split<typeof path, '.'>
      const moduleName = pathModules[pathModules.length - 1]
      acc[moduleName] = {
        state: this.getValueFromPath(this.store.state, path),
        actions: {}
      } as StoreModules<typeof this.store>[typeof moduleName] as any // @todo: update actions and remove as any
      return acc
    }, {} as Partial<StoreModules<typeof this.store>>)

    return modules as StoreModules<typeof this.store>
  }
}

export const store = new Store()

export const useStore = () => store.modules

export const setupStore = (nuxtStore: any) => store.setup(nuxtStore)
