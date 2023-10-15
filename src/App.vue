<template>
  <div>
    <TopBar v-if="isLoggedIn"></TopBar>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import TopBar from './components/TopBar.vue';
import { ref, watch } from 'vue';

const route = useRoute();
const isLoggedIn = ref(false);
watch(
  route, (value) => {
    value.meta.isLoggedIn ? isLoggedIn.value = true : isLoggedIn.value = false;
  },
  { immediate: true }
);

</script>

<style scoped>
</style>
