<template>
  <v-layout>
    <v-app-bar
      density="compact"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="isShowMenu = !isShowMenu"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title><div class="logo">fitlog</div></v-app-bar-title>
        <template v-slot:append>
          <v-btn variant="tonal"  color="indigo" @click="logout">logout</v-btn>
        </template>
      </v-app-bar>
      <v-main>
        <v-navigation-drawer
          v-model="isShowMenu"
          location="top"
          temporary
        >
          <template v-for="item in items" :key="item.title">
            <v-list-item @click="selectItem(item.value)">{{ item.title }}</v-list-item>
          </template>
        </v-navigation-drawer>
      </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isShowMenu = ref(false);

const items = [
  {
    title: 'Programs',
    value: '/workout-program',
  },
  {
    title: 'Space',
    value: '/workout-space',
  }
];

const logout = () => {
  localStorage.removeItem('auth');
  router.replace('/');
}

const selectItem = (value) => {
  router.push(value);
}

</script>

<style lang="scss" scoped>
.logo {
    font-size: 1.5rem;
    height: 2rem;
    font-weight: bold;
  }
.topbar {
  // display: flex;
  // margin: 1rem;
  // padding: 0.25rem 1rem;
  
  
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