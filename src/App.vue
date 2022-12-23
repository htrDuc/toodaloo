<script setup lang="ts">
import {ref} from "vue";
const newDescription = ref('')
const data = ref({
  columns: [
    {
      name: "now",
      list: [{
        description: "This is an item",
        state: "new",
      }, {
        description: "This is another item",
        state: "done",
      }
      ]
    },
    {
      name: "next",
      list: [{
        description: "This is an item",
        state: "new",
      }, {
        description: "This is another item",
        state: "done",
      }
      ]
    },
    {
      name: "later",
      list: [{
        description: "This is an item",
        state: "new",
      }, {
        description: "This is another item",
        state: "done",
      }
      ]
    }
  ]
})
</script>

<template>
  <div class="flex flex justify-center space-x-6 pt-10">
    <div v-for="column of data.columns" :key="column.name" class="rounded-md shadow-md bg-slate-100 py-4 px-4 w-1/4 space-y-4">
      <div>{{column.name}}</div>
      <div v-for="item of column.list"  class="bg-slate-50 rounded-md py-2 px-3 shadow-md">{{item.description}}</div>
      <div class="flex flex-col items-end">
        <input type="text" name="description" v-model="newDescription" class="w-full px-3 py-2 rounded-md mb-2"/>
        {{newDescription}}
        <button>Add</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
