<script setup lang="ts">
import {reactive, Ref, ref, toRaw, watch} from "vue";
import uniqid from "uniqid";
import IconCheckboxBlankOutline from "~icons/mdi/checkbox-blank-outline"
import IconCheckboxMarked from "~icons/mdi/checkbox-marked"
import IconTrashCan from "~icons/mdi/trash-can"
import IconFileEdit from "~icons/mdi/file-edit"
import draggable from 'vuedraggable'

interface Column {
  name: string;
  list: {
    id: string,
    description: string,
    state: "new" | "done",
    editing?: boolean
  }[];
}

const defaultData = {
  columns: [
    {
      name: "now",
      list: []
    },
    {
      name: "next",
      list: []
    },
    {
      name: "later",
      list: []
    }
  ],
} as { columns: Column[] };
const dragging = ref(false)
const data = reactive(defaultData)

if (chrome?.storage) {
  chrome.storage.sync.get(["toodaloo-app-data"]).then((result) => {
    const storedData= result["toodaloo-app-data"]
    if(storedData) {
      data.columns = storedData.columns
    }
  });
} else {
  const localStorageString = localStorage.getItem("toodaloo-app-data")
  if (localStorageString) {
    data.columns = JSON.parse(localStorageString).columns
  }
}

watch(data, (newData) => {
  if(chrome?.storage) {
    chrome.storage.sync.set({ ["toodaloo-app-data"]: toRaw(data) }).then(() => {
      console.log("Value is set to ", toRaw(data));
    });
  } else {
    localStorage.setItem("toodaloo-app-data", JSON.stringify(newData))
  }
})
const addItem = (event: Event, column: Column) => {
  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  const description: string = formData.get("description") as string
  column.list.push({
    id: uniqid(),
    description,
    state: "new"
  })
  form.reset()
}

const deleteItem = (column: Column, index: number) => {
  column.list.splice(index, 1)
}

const editItem = (event: Event, column: Column, index: number) => {
  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  const description = formData.get("description") as string;
  column.list[index].description = description
  column.list[index].editing = false
}

</script>

<template>
  <div class="flex flex justify-center space-x-6 pt-10">
    <div v-for="column of data.columns" :key="column.name"
         class="rounded-md shadow-md bg-slate-100 py-4 px-4 w-1/4">
      <div class="mb-3">{{ column.name }}</div>
      <draggable
          v-model="column.list"
          group="items"
          ghost-class="ghost"
          item-key="id"
          class="space-y-4"
          :class="{
              'min-h-[40px] rounded-md bg-slate-200': dragging
          }"
          }
          @start="dragging=true"
          @end="dragging=false"
      >
        <template #item="{element: item, index}">
          <div class="group bg-slate-50 rounded-md py-2 px-3 shadow-md flex flex-row space-x-2 items-start relative">
            <template v-if="item.editing">
              <form @submit.prevent="editItem($event, column, index)" class="flex flex-col items-end w-full">
                <input :value="item.description" type="text" name="description" class="w-full px-3 py-2 rounded-md mb-2"
                       autocomplete="off"/>
                <div class="flex justify-between flex-row">
                  <button @click="item.editing = false">Cancle</button>
                  <button>Edit</button>
                </div>
              </form>
            </template>
            <template v-else>
              <div
                  class="absolute hidden opacity-90 bottom-0 right-0 p-3 bg-slate-50 max-h-full space-x-3  flex-row group-hover:flex">
                <button @click="item.editing = true">
                  <IconFileEdit/>
                </button>
                <button @click="deleteItem(column, index)">
                  <IconTrashCan class="text-red-700"/>
                </button>
              </div>
              <button class="mt-[2px]" @click="item.state = item.state === 'done' ? 'new' : 'done'">
                <IconCheckboxBlankOutline v-if="item.state === 'new'"/>
                <IconCheckboxMarked v-else/>
              </button>
              <span class="inline-block break-words min-w-0" :class="{'line-through': item.state === 'done'}">
                {{ item.description }}
              </span>
            </template>
          </div>
        </template>
      </draggable>
      <div class="pt-4">
        <form @submit.prevent="addItem($event, column)" class="flex flex-col items-end">
          <input type="text" name="description" class="w-full px-3 py-2 rounded-md mb-2" autocomplete="off"/>
          <button>Add</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ghost {
  @apply bg-slate-400 opacity-30;
}
</style>
