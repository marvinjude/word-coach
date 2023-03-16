import { createApp } from "vue";
import App from "./App.vue";
import WordCoach from "word-coach-vue";
import './assets/index.css'

const app = createApp(App);

app.component("word-coach", WordCoach);

app.mount("#app");
