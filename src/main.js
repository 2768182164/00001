import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue';
import i18n from './i18n';

const app = createApp(App);
app.use(createPinia());
app.use(vant);
app.use(i18n);
app.mount('#app');
