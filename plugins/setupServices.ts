import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { setupStore } from '@/services/store'
import { setupHttp } from '@/services/http'

export default defineNuxtPlugin((nuxtApp) => {
  if (process && process.client) {
    console.log('STORE:', nuxtApp.store as unknown as TG.Store)
  }
  setupStore(nuxtApp.store)
  setupHttp(nuxtApp.$axios)

  // const storePaths = getStorePaths()
  // const store = useStore()
})
