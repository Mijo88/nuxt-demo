<template>
  <div class="row">
    <div class="col">
      <div class="form flex-col">
        <input
          type="text"
          placeholder="Description"
          :value="productInput.description"
          @input="onChangeDescription"
        >
        <input
          type="number"
          placeholder="Price"
          :value="productInput.price"
          @input="onChangePrice"
        >

        <button @click="addProduct">
          Add product
        </button>
        <button @click="commitOrder">
          Commit order
        </button>
      </div>
      <div
        v-for="{ description, price } in products"
        :key="`${price}-${description}`"
        class="input-orders"
      >
        {{ `&euro;${price} - ${description}` }}
      </div>
    </div>

    <div class="col">
      <div v-for="order in list" :key="order.uuid" class="card">
        <p v-for="{ description, price, uuid } in order.products" :key="uuid">
          <span>{{ price }}</span><span>{{ description }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '@nuxtjs/composition-api'
import { useStore } from '@/services/StoreService'
import { useActions } from '@/actions'

type Product = {
  description: string;
  price: string | number;
}

const { order: orderStore } = useStore()
const actions = useActions()

const products = ref<Product[]>([])
const productInput = ref<Product>({ description: '', price: 0 })

const list = computed(() => orderStore.state.list)

function onChangePrice (event: Event) {
  const price = (event.target as HTMLInputElement).value
  productInput.value.price = parseInt(price)
}

function onChangeDescription (event: Event) {
  const desc = (event.target as HTMLInputElement).value
  productInput.value.description = desc
}

function addProduct () {
  products.value.push({ ...productInput.value })
  productInput.value.description = ''
  productInput.value.price = 0
}

function commitOrder () {
  const p = products.value.map(product => addIds(product))
  const order = addIds({
    products: p
  })

  orderStore.mutations.listAppend(order)
  products.value = []
}

function addIds (input: any) {
  const id = Math.floor(Math.random() * 10000)
  return {
    '@id': `/api/v1/${id}`,
    uuid: id,
    ...input
  }
}

onMounted(() => {
  actions.order.fetchList()
  actions.ModuleA.fetchList(false)
  actions.ModuleB.fetchList()
})
</script>

<style>
*, *:after, *:before {
  margin: 0;
  box-sizing: border-box;
  padding: 0;
  font-size: inherit;
}

.row {
  width: 100%;
  display: flex;
}

.col {
  height: 100vh;
  width: 50%;
  background: #fff;
}

.col:nth-child(2) {
  background-color: #eee;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.form {
  width: 500px;
  margin: auto;
}
</style>
