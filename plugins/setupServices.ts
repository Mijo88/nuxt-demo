import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { setupStore, getStorePaths, useStore } from '@/services/store'
import { setupHttp } from '@/services/http'
import { setupActions } from '@/actions'

export default defineNuxtPlugin((nuxtApp) => {
  setupStore(nuxtApp.store)
  setupHttp(nuxtApp.$axios)

  const storePaths = getStorePaths()
  const store = useStore()

  setupActions({
    store,
    storePaths,
    api: nuxtApp.$axios
  })
})
