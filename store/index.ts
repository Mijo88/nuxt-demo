import type { OrderModule } from './order'

interface RootModule {
  state: {};
  getters: {};
  mutations: {};
}

export interface StoreModules {
  root: RootModule;
  order: OrderModule;
}
