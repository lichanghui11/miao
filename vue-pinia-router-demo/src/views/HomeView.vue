
<template>
  <div class="grid">
    <div class="justify-self-center text-center">
      <RouterView />
    </div>
  </div>

  <footer class="h-full">
    <div class="wrapper h-[500px] relative">
      <nav class="fixed bottom-[10px] border flex flex-auto space-x-60 justify-items-center ">
        <RouterLink class="border-2" to="/home/chat">聊天</RouterLink>
        <RouterLink class="border-2" to="/home/contact">联系人</RouterLink>
        <RouterLink class="border-2" to="/home/discover">发现</RouterLink>
        <RouterLink class="border-2" to="/home/mine">我的</RouterLink>
      </nav>
    </div>
  </footer>

</template>