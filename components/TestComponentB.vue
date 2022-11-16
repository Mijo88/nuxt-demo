<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from '@nuxtjs/composition-api'
import { useStore } from '@/services/store'
import { useHttp } from '@/services/http'

const http = useHttp()

const store: any = useStore()

function fetchTest () {
  http.get('https//invalid')
  http.get('https://jsonplaceholder.typicode.com/todos', { abortContext: { namespace: 'n1', skipAbort: false } })
  http.get('https://jsonplaceholder.typicode.com/todos', { abortContext: { namespace: 'n2', skipAbort: false } })
  http.get('https://jsonplaceholder.typicode.com/todos', { abortContext: { namespace: 'n2', skipAbort: false } })
}

onMounted(() => {
  fetchTest()
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
