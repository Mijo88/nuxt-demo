import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { initializeStore, getStorePaths, useStore } from '@/services/StoreService'
import { setupActions } from '@/actions'

export default defineNuxtPlugin((nuxtApp) => {
  initializeStore(nuxtApp.store)

  const storePaths = getStorePaths()
  const store = useStore()

  setupActions({
    store,
    storePaths,
    api: nuxtApp.$axios
  })
})
