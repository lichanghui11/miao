<script setup>
import TodoItem from "./TodoItem.vue";
import { useTodoStore } from "@/stores/todos";

const todoStore = useTodoStore();
</script>
<template>
  <div :class="'visible-' + todoStore.isVisible">
    <TodoItem v-for="(todo, i) of todoStore.tasks" :todo="todo" :key="i" />
  </div>
</template>

<style>
.visible-all > * {
  display: block;
}

.visible-active > .active {
  display: block;
}
.visible-active > .completed {
  display: none;
}

.visible-completed > .active {
  display: none;
}
</style>
