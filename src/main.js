import '@/assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'

import vuetify from '@/plugins/vuetify';
import store from '@/store/store.js';

import { loadFonts } from '@/plugins/webfontloader'
import axios from '@/components/Instance';

loadFonts();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const app = createApp(App);

app.config.globalProperties.store = store;
app.config.globalProperties.axios = axios;

app.use(router);
app.use(vuetify);
app.use(store);

app.mount('#app');
