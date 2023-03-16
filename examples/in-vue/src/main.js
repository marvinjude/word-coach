import { createApp } from "vue";
import App from "./App.vue";
import WordCoach from "word-coach-vue";

const app = createApp(App);

app.component("word-coach", WordCoach);

app.mount("#app");
