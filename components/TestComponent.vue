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
import { useStore } from '@/services/store'

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
      return this.store.order.state.list
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
