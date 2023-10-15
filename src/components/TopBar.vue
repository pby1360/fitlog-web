<template>
  <div class="topbar">
    <div class="logo">fitlog</div>
    <div class="buttons">
      <button><router-link to="/">logout</router-link></button>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  margin: 1rem;
  
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