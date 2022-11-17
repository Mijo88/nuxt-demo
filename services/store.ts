/* eslint-disable @typescript-eslint/no-unused-vars */
import { getKeys } from '@/util'

type KeysOf<ObjType extends object> = (keyof ObjType)[]

type ModuleActionTuple<S extends string> =
  S extends `${infer _}/${infer M}/${infer A}`
  ? ModuleActionTuple<`${M}/${A}`>
  : S extends `${infer M}/${infer A}`
  ? [M, A]
  : never

type FilteredActionKey<S extends string, M extends string> =
  S extends `${M}/${ModuleActionTuple<S>[1]}`
  ? S
  : S extends `${infer _}/${M}/${infer R}`
  ? FilteredActionKey<`${M}/${R}`, M> extends `${M}/${ModuleActionTuple<S>[1]}`
    ? S
    : never
  : never

type FilteredActionKeys<S extends string[], M extends string> = FilteredActionKey<S[number], M>[]

type NamespaceKeys<S extends Record<string, any>> =
  Extract<keyof S['_modulesNamespaceMap'], string>

type ExtractModuleName<P extends string> =
  GetLastOfDelimiter<Transform.ResourceToPath<P>>

type ModuleActions<S extends Record<string, any>, M extends string> = {
  [A in FilteredActionKey<Cast<keyof S['_mutations'], string>, M> as ModuleActionTuple<A>[1]]: (
    payload: Parameters<S['_mutations'][A]>[1]
  ) => void
}

type StoreModule<S extends Record<string, any>, P extends string, M extends string> = {
  state: DeepExtract<S, P>
  actions: ModuleActions<S, M>
}

type StoreModules<
  S extends Record<string, any>,
> = {
  [P in NamespaceKeys<S> as ExtractModuleName<P>]: StoreModule<
    S, Transform.ResourceToPath<`state.${P}`>, ExtractModuleName<P>
  >
}

type PartialStore = {
  state: Partial<TG.Store['state']>
  _mutations: Partial<TG.Store['_mutations']>
  _modulesNamespaceMap: Partial<TG.Store['_modulesNamespaceMap']>
  commit: TG.Store['commit']
}

export class Store<S extends PartialStore = TG.Store> {
  private _store: S | null = null
  private _modules: StoreModules<S> | null = null

  public setup = (store: S) => {
    this._store = store
    this._modules = this.generateModules()
  }

  private get store (): S {
    return this._store!
  }

  public get modules (): StoreModules<S> {
    return this._modules!
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
  > (actions: O, moduleName: M): ModuleActions<S, M> => {
    const filteredActions = Object.keys(actions).filter(
      action => action.split('/').slice(-2).pop() === moduleName
    ) as FilteredActionKeys<Cast<keyof O, string[]>, M>

    return filteredActions.reduce((acc, key) => {
      const actionName = key.split('/').pop()!
      acc[actionName] = (payload: Parameters<typeof actions[typeof key]>[1]): void => {
        this.store.commit(key, payload)
      }

      return acc
    }, {} as any) // @todo: replace any
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

      const state = this.getValueFromPath(this.store.state, path)
      const actions = this.getModuleActions(this.store._mutations, moduleName)
      acc[moduleName] = {
        state,
        actions
      } as never

      return acc
    }, {} as any) as StoreModules<S> // @todo: replace any

    return modules as StoreModules<S>
  }
}

export const store = new Store()

export const useStore = () => store.modules

export const setupStore = (nuxtStore: any) => store.setup(nuxtStore)
