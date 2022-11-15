<template>
  <div class="row" />
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
