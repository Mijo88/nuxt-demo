export type SharedModuleState<T> = {
  list: T[]
}

export type SharedActions<ModuleEntity> = {
  setList (state: SharedModuleState<ModuleEntity>, payload: ModuleEntity[]): void
}

export const makeSharedActions = <ModuleEntity>(): SharedActions<ModuleEntity> => {
  return {
    setList (state: SharedModuleState<ModuleEntity>, payload: ModuleEntity[]) {
      state.list = payload
    }
  }
}
