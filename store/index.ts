import type { OrderModule } from './order'

declare global {
  interface NuxtStore {}
}

interface RootModule {
  state: {};
  getters: {};
  mutations: {};
}

export interface StoreModules {
  root: RootModule;
  order: OrderModule;
}
