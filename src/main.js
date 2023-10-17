import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify';
import store from '@/store/store.js';

import { loadFonts } from './plugins/webfontloader'
loadFonts();

const app = createApp(App);

app.config.globalProperties.store = store;

app.use(router);
app.use(vuetify);
app.use(store);

app.mount('#app');
