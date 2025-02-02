<script setup>
import { useTodoStore } from "@/stores/todos";

let todoStore = useTodoStore();
// const clearCompleted = todoStore.clearCompleted;
//把值赋给一个变量将失去动态性
</script>

<template>
  <button @click="todoStore.clearCompleted">Clear</button>
</template>
