<template>
  <div class="topbar">
    <div class="logo">fitlog</div>
    <div class="buttons">
      <button @click="logout">logout</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';


const router = useRouter();

const logout = () => {
  localStorage.removeItem('auth');
  router.replace('/');
}

</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  // margin: 1rem;
  padding: 0.25rem 1rem;
  
  .logo {
    flex: 1;

    font-size: xx-large;
    font-weight: bold;
  }
  .buttons {
    flex: 1;

    display: flex;
    justify-content: flex-end;
    
    button {
      margin: auto 0;
      height: 2rem;
    }
  }
}

</style>