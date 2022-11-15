import { Module, MutationTree } from 'vuex'
import { makeSharedActions, SharedActions, SharedModuleState } from '@/store/actions'

export interface CommentState extends SharedModuleState<TG.CommentEntity> {
  list: TG.CommentEntity[]
}

type ModuleState = Omit<CommentState, ''>

export const state = (): ModuleState => ({
  list: []
})

export const mutations: MutationTree<ModuleState> = {
  ...makeSharedActions<TG.CommentEntity>()
}

export const comment: Module<ModuleState, {}> = {
  namespaced: true,
  state,
  mutations
}

export type CommentModuleActions = (
  StoreActionPath<SharedActions<TG.CommentEntity>, 'comments'>
)
