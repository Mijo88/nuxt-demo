/* eslint-disable no-use-before-define */
export {}

declare global {
  type GetLastOfDelimiter<S extends string, D extends string = Delimiter> =
    S extends `${infer _}${D}${infer T}`
    ? GetLastOfDelimiter<Trim<T, D>, D>
    : S

  namespace Transform {
    type ResourceToPath<S extends string> = Trim<Replace<S, '/', '.'>>

    type ModuleActionToResource<A extends string, M extends string> = `${M}/${A}`

    type StoreActionPath<Obj, M extends string> = {
      [A in Extract<keyof Obj, string> as Transform.ModuleActionToResource<A, M>]: Obj[A]
    }
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
