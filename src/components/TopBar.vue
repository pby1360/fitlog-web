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
          <v-btn variant="tonal" color="indigo" @click="logout">logout</v-btn>
        </template>
      </v-app-bar>
      <v-main>
        <v-navigation-drawer
          v-model="isShowMenu"
          location="top"
          temporary
          class="menu-list"
        >
          <template v-for="item in items" :key="item.title">
            <v-list-item @click="selectItem(item.value)" :class="item.value == selectedMenu ? 'selected' : ''">{{ item.title }}</v-list-item>
          </template>
        </v-navigation-drawer>
      </v-main>
  </v-layout>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const isShowMenu = ref(false);
const selectedMenu = computed(() => route.path);

const items = [
  {
    title: 'Main',
    value: '/main',
  },
  {
    title: 'Master',
    value: '/workout-master',
  },
  {
    title: 'Program',
    value: '/workout-program',
  },
  {
    title: 'Space',
    value: '/workout-list',
  }
  // {
  //   title: 'Space',
  //   value: '/workout-space',
  // }
];

const logout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('profile_image');
  // store.commit('setLogin', !isLoggedin);
  store.commit('setUser', {});
  router.replace('/');
}

const selectItem = (value) => {
  router.push(value);
  isShowMenu.value = false;
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

.menu-list {
  .v-list-item.selected {
    background-color: #CCCCFF;
  }
}
</style>