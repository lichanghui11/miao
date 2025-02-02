<script setup>
import { useTodoStore } from "@/stores/todos";
import { ref } from "vue";
const todoStore = useTodoStore(); //把Pinia公共区域的数据拿出来

const inputText = ref("");
const addTodoSub = (e) => {
  if (!inputText) return;
  console.log(inputText);
  let todo = {
    id: Date(),
    text: inputText.value,
    completed: false,
  };
  todoStore.addTodo(todo);
  console.log(todo);

  inputText.value = "";
};

const toggleAll = todoStore.toggleAll;
const isAllDone = todoStore.isAllDone;
</script>

<template>
  <div>
    <input
      type="checkbox"
      v-model="todoStore.isAllDone"
      @click="toggleAll"
    />
    <input
      v-model.trim="inputText"
      class="outline-none border border-2"
      @keydown.enter="addTodoSub"
      type="text"
      placeholder="Who do you want to kill?"
    />
  </div>
</template>
