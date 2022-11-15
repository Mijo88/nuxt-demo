import { Module, MutationTree } from 'vuex'
import type { CommentState, CommentModuleActions } from './comments'
import { makeSharedActions, SharedActions, SharedModuleState } from '@/store/actions'

export interface PostState extends SharedModuleState<TG.PostEntity> {
  list: TG.PostEntity[]
  comments: CommentState
}

type ModuleState = Omit<PostState, 'comments'>

export type PostModuleActions = (
  StoreActionPath<SharedActions<TG.PostEntity>, 'posts'> &
  StoreActionPath<CommentModuleActions, 'posts'>
)

declare global {
  namespace TG {
    interface StoreActions extends PostModuleActions {}

    interface StoreState {
      posts: PostState
    }
  }
}

export const state = (): ModuleState => ({
  list: []
})

export const mutations: MutationTree<ModuleState> = {
  ...makeSharedActions<TG.PostEntity>()
}

export const todo: Module<ModuleState, {}> = {
  namespaced: true,
  state,
  mutations
}
