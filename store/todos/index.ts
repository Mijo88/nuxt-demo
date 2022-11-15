import { Module, MutationTree } from 'vuex'
import { makeSharedActions, SharedActions, SharedModuleState } from '@/store/actions'

export interface TodoState extends SharedModuleState<TG.TodoEntity> {
  list: TG.TodoEntity[]
}

type ModuleState = Omit<TodoState, ''>

export type TodoModuleActions = (
  StoreActionPath<SharedActions<TG.TodoEntity>, 'todos'>
)

declare global {
  namespace TG {
    interface StoreActions extends TodoModuleActions {}

    interface StoreState {
      todos: TodoState
    }
  }
}

export const state = (): ModuleState => ({
  list: []
})

export const mutations: MutationTree<ModuleState> = {
  ...makeSharedActions<TG.TodoEntity>()
}

export const todo: Module<ModuleState, {}> = {
  namespaced: true,
  state,
  mutations
}
