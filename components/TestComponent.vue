<template>
  <div class="row">
    <div class="col">
      <div class="form flex-col">
        <input
          type="text"
          placeholder="Description"
          :value="product.description"
          @input="onChangeDescription"
        >
        <input
          type="number"
          placeholder="Price"
          :value="product.price"
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

<script>
import { useStore } from '@/logic/StoreService'

export default {
  name: 'TestComponent',

  data () {
    return {
      product: {
        description: '',
        price: 0
      },
      products: []
    }
  },

  computed: {
    store () {
      return useStore()
    },

    list () {
      return this.store.order.getters
      // return this.$store.getters['order/list']
    }
  },

  methods: {
    onChangePrice (event) {
      this.product.price = parseInt(event.target.value)
    },

    onChangeDescription (event) {
      this.product.description = event.target.value
    },

    addProduct () {
      this.products.push({ ...this.product })
      this.product = {}
    },

    commitOrder () {
      const order = {
        products: this.products.map(product => this.addIds(product))
      }

      this.store.order.mutations.listAppend(order)
      this.products = []
    },

    addIds (input) {
      const id = Math.floor(Math.random() * 10000)
      return {
        '@id': `/api/v1/${id}`,
        uuid: id,
        ...input
      }
    }
  }
}

</script>

<!-- <script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { onMounted, ref, computed } from '@nuxtjs/composition-api'
import { useStore } from '@/logic/StoreService'

const { order: orderStore } = useStore()
const list = computed(() => orderStore.state.list)

type Product = {
  description: string;
  price: string | number;
}

const products = ref<Product[]>([])
const productInput = ref<Product>({ description: '', price: 0 })

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
</script> -->

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
