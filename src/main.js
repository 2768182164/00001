import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(vant);
app.mount('#app');