import { createApp } from "vue";
import App from "./views/App.vue"; // Ensure this is the correct path to App.vue
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";

createApp(App).use(router).mount("#app"); // Make sure the mount point matches your public/index.html
