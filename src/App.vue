<template>
  <div>
    <TopBar v-if="isLoggedIn"></TopBar>
    <RouterView />
    <v-overlay
      :model-value="isLoading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from "vuex";

import TopBar from './components/TopBar.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLoggedIn = ref(false);

const isLoading = computed(() => store.getters.isLoading);

watch(
  route, (value) => {
    value.meta.loginRequired ? isLoggedIn.value = true : isLoggedIn.value = false;
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
