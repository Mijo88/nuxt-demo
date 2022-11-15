export {}

type ConvertActionKey<Action extends string, ModuleName extends string> = `${ModuleName}/${Action}`
declare global {
  type ExtractModule<T extends `${string}/`> =
    T extends `${infer _Prefix}/${infer Module}/`
    ? ExtractModule<`${Module}/`>
    : T extends `${infer Module}/`
    ? Module
    : never

  type ChildStoreModule = 'comments'

  type StateWithoutChildModule<State> = Omit<State, ChildStoreModule>

  type StringKeys<Obj> = Extract<keyof Obj, string>

  type StoreActionPath<Obj, ModuleName extends string> = {
    [Action in StringKeys<Obj> as ConvertActionKey<Action, ModuleName>]: Obj[Action]
  }

  namespace TG {
    interface StoreActions {}

    interface StoreState {}

    interface Store {
      _modulesNamespaceMap: {
        'posts/': unknown
        'posts/comments/': unknown
        'todos/': unknown
      }
      _mutations: TG.StoreActions
      state: TG.StoreState
      commit (path: string, payload: unknown): void
    }
  }
}
