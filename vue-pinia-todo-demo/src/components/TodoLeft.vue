<script setup>
import { useTodoStore } from "@/stores/todos";
const todoStore = useTodoStore(); //把Pinia公共区域的数据拿出来
// const countLeft = todoStore.countLeft;
// const isPlura = todoStore.isPlura;
//以上两行代码实际上是把todoStore里面的值读取出来， 赋值给左边的countLeft和isPlura
//因此导致countLeft / isPlura不会动态更新；
</script>

<template>
  <span>{{ todoStore.countLeft }} item{{ todoStore.isPlura }} left.</span>
</template>
