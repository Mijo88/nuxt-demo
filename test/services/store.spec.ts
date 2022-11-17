import { useStore } from '@/services/store'

describe('Store service', () => {
  let store: ReturnType<typeof useStore>

  beforeEach(() => {
    store = useStore()
  })

  test('shows an example', () => {
    console.log(store)
    expect(1).toBe(1)
  })
})
