export default class Todos {
  public store: TG.StoreService

  constructor (store: TG.StoreService) {
    this.store = store
    // store.resources.todos.set()
  }
}
