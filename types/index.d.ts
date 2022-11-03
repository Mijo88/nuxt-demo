import type StoreServiceClass from '@/logic/StoreService'

declare global {
  namespace TG {
    type StoreService = StoreServiceClass
  }
}
