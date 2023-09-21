import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {CustomRouter} from "./router.ts";
import {createPinia} from "pinia";
// @ts-ignore
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

let app = createApp(App);
app.use(CustomRouter);
app.use(createPinia())

app.component('PulseLoader', PulseLoader)
// How can I use the PulseLoader from the vue-spinner library, but this has no typescript support?
//
// import PulseLoader from "vue-spinner/src/PulseLoader.vue";

app.mount('#app')
