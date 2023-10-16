<template>
  <div>
    <TopBar v-if="isLoggedIn"></TopBar>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import TopBar from './components/TopBar.vue';
import { onMounted, ref, watch } from 'vue';

const route = useRoute();
const router = useRouter();
const isLoggedIn = ref(false);
watch(
  route, (value) => {
    value.meta.isLoggedIn ? isLoggedIn.value = true : isLoggedIn.value = false;
  },
  { immediate: true }
);

onMounted(() => {
  checkToken();
});

const checkToken = () => {
  const authStr = localStorage.getItem('auth');
  if (authStr) {
    const auth = JSON.parse(authStr);
    if (auth.expiredAt < new Date().getTime()) {
      if (route.name !== 'home' || route.name !== 'about' || route.name !== 'signIn') {
        localStorage.removeItem('auth');
        alert('토큰 만료');
        router.replace('/');
      }
    } else if (isIndexPage(route.name)) {
      router.replace('/main');
    }
  } else if (!isIndexPage(route.name)) {
    router.replace('/');
  }
}

const isIndexPage = (name) => {
  return name !== 'home' || route.name !== 'about' || route.name !== 'signIn';
}
</script>

<style scoped>
</style>
