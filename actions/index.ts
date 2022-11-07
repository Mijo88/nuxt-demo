import type { StoreModules } from '@/store'
import type { OrderMutations } from '@/store/order'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

type SetupConfig = {
  store: StoreModules;
  storePaths: string[];
  api: any
}

function getModuleFromPath (path: string) {
  return path.split('/').pop() as keyof StoreModules
}

const actions = {

} as any

export const setupActions = (config: SetupConfig) => {
  const { store, storePaths, api } = config

  const makeFetchList = (path: string) => {
    const module = getModuleFromPath(path)

    return async (storeFetchedData = true) => {
      try {
        const url = `${BASE_URL}/users`
        console.log(`Mocking request for "/api/v1/${path}"`)
        const { data } = await api.get(url)

        if (storeFetchedData) {
          console.log('Storing data in:', module);
          (store[module].mutations as OrderMutations).listSet(data)
        }

        return data
      } catch (err) {
        console.log('Something went wrong!')
      }
    }
  }

  storePaths.forEach((path) => {
    const module = getModuleFromPath(path)
    actions[module] = {
      fetchList: makeFetchList(path)
    }
  })
}

export const useActions = () => actions
