<template>
  <div class="about"> 
    <h1>聊天页面</h1>
    <h1>This is a chat page</h1>
    <ul class="w-[400px] text-green-700">
      <li class="my-[10px] bg-slate-50" v-for="x of 10"> 
        <RouterLink :to="'/chat/' + 'Stranger: No.' + x">
          Stranger: No.{{ x }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>


