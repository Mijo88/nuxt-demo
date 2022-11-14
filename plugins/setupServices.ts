import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { setupStore, getStorePaths, useStore } from '@/services/store'
import { setupActions } from '@/actions'

export default defineNuxtPlugin((nuxtApp) => {
  setupStore(nuxtApp.store)

  const storePaths = getStorePaths()
  const store = useStore()

  setupActions({
    store,
    storePaths,
    api: nuxtApp.$axios
  })
})
