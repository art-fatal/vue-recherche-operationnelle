import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';

import './style.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'

import Button from "primevue/button"
import Panel from "primevue/panel"
import FloatLabel from "primevue/floatlabel"
import InputNumber from "primevue/inputnumber"
import InputGroup from "primevue/inputgroup"
import InputGroupAddon from "primevue/inputgroupaddon"
import Dropdown from "primevue/dropdown"
import router from './router'
import {createPinia} from "pinia";

const pinia = createPinia()

const app = createApp(App)
app.use(PrimeVue);
app.use(pinia)
app.use(router)
app.component('Button', Button);
app.component('Panel', Panel);
app.component('FloatLabel', FloatLabel);
app.component('InputNumber', InputNumber);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('Dropdown', Dropdown);

app.mount('#app')