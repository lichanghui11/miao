<template>
  <div class="relative mx-auto w-[300px] h-[500px] text-center bg-green-500">
  <RouterLink class="outline absolute left-0" to="/home/chat">return</RouterLink>
  <p class="bg-purple-500">{{ $route.params.id }}</p>
    <p class="pt-[10px]">
      I'm talking with 
    </p>
    <span class="bg-orange-500">{{ $route.params.id }}</span>
  </div>
</template>