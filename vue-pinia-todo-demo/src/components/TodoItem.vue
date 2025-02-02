<script setup>
import { useTodoStore } from "@/stores/todos";
// import { defineProps } from "vue";

const todoStore = useTodoStore(); //把Pinia公共区域的数据拿出来
const props = defineProps({
  todo: {
    type: Object,
    require: true,
  },
});


</script>
<template>
  <div class="border my-[4px]" :class="{ active: !todo.completed, completed: todo.completed }">
    <input type="checkbox" v-model="todo.completed" />
    <span>{{ todo.text }}</span>
    <button
      class="border w-[40px] bg-orange-300"
      @click="todoStore.deleteTodo(todo)"
    >
      &times;
    </button>
  </div>
</template>

