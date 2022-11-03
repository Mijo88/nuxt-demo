import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { initializeStore } from '@/logic/StoreService'

export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line no-new
  initializeStore(nuxtApp.store)
})
