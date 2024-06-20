import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import './style.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import Button from "primevue/button"
import Panel from "primevue/panel"
import router from './router'

const app = createApp(App)
app.use(PrimeVue);
app.use(router)
app.component('Button', Button);
app.component('Panel', Panel);

app.mount('#app')