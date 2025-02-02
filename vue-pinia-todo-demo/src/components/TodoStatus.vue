<script setup>
import { useTodoStore } from '@/stores/todos';

const todoStore = useTodoStore();


</script>

<template>
  <div class="my-[10px] border">
    <label><input v-model="todoStore.isVisible" value="all" type="radio">All</label>
    <label><input v-model="todoStore.isVisible" value="active" type="radio">Active</label>
    <label><input v-model="todoStore.isVisible" value="completed" type="radio">Completed</label>
  </div>
</template>