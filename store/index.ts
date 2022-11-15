export {}

type ConvertActionKey<Action extends string, ModuleName extends string> = `${ModuleName}/${Action}`

declare global {
  type StringKeys<Obj> = Extract<keyof Obj, string>

  type StoreActionPath<Obj, ModuleName extends string> = {
    [Action in StringKeys<Obj> as ConvertActionKey<Action, ModuleName>]: Obj[Action]
  }
  namespace TG {
    interface StoreActions {}

    interface StoreState {}

    interface Store {
      _modulesNamespaceMap: { [path: string]: unknown }
      _mutations: TG.StoreActions
      state: TG.StoreState
      commit (path: string, payload: unknown): void
    }
  }
}
