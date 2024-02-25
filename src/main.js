import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import { router } from './helpers';
import 'primevue/resources/themes/aura-light-green/theme.css'
// setup fake backend
//import { fakeBackend } from './helpers';
//fakeBackend();

const app = createApp(App);
app.use(PrimeVue);
app.use(createPinia());
app.use(router);

app.mount('#app');
