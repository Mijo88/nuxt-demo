import { Module, MutationTree, GetterTree } from 'vuex'

export interface OrderState {
  list: TG.OrderEntity[]
}

export interface OrderMutations {
  listAppend (payload: TG.OrderEntity): void;
  listSet (payload: TG.OrderEntity[]): void;
}

export interface OrderModule {
  state: OrderState;
  mutations: OrderMutations;
}

export const state = (): OrderState => ({
  list: []
})

export const mutations: MutationTree<OrderState> = {
  listAppend (state, payload: TG.OrderEntity) {
    state.list = [...state.list, payload]
  },

  listSet (state, payload: TG.OrderEntity[]) {
    state.list = payload
  }
}

export const getters: GetterTree<OrderState, {}> = {
  list (state) {
    return state.list
  }
}

export const order: Module<OrderState, {}> = {
  namespaced: true,
  state,
  mutations
}
