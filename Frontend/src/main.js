import './assets/master.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';

const app = createApp(App)
const piniaLamiPalitNamo = createPinia();

app.use(Toast, {
    position: "top-right",
    duration: 3000,
    closeOnClick: true
})

app.use(piniaLamiPalitNamo);
app.use(router);

app.mount('#app');
