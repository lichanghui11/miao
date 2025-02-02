<script setup>
import TodoHeader from "./components/TodoHeader.vue";
import TodoLists from "./components/TodoLists.vue";
import TodoInput from "./components/TodoInput.vue";
import TodoLeft from "./components/TodoLeft.vue";
import TodoClear from "./components/TodoClear.vue";
import TodoStatus from "./components/TodoStatus.vue";
</script>

<template>
  <header>
    <TodoHeader />
  </header>
  <br>

  <div>
    <TodoInput />
    <TodoLists class="border border-4" />
    <TodoLeft />
  </div>
  <footer class="my-[10px]">
    <TodoClear class="border w-[50px] bg-slate-400" />
    <TodoStatus class="border outline" />
  </footer>
</template>
