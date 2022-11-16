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

  type GetLastOfDelimiter<S extends string, D extends string> =
    S extends `${infer _X}${D}${infer Y}`
    ? Y
    : S

  type ModuleStates<S extends Record<string, any>, O> = {
    [P in StringKeys<O> as GetLastOfDelimiter<
      Trim<Replace<P, '/', '.'>, '.'>, '.'
    >]: DeepSearch<S, Trim<Replace<P, '/', '.'>, '.'>, '.'>
  }

  type Z = GetLastOfDelimiter<'posts.comments.', '.'>

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

const fakeState = {
  todos: {
    list: []
  },
  posts: {
    list: [],
    comments: {
      list: []
    }
  }
}

const paths = ['todos', 'posts', 'posts.comments']
