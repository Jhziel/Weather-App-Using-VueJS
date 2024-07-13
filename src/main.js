import "./assets/main.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSun,
  faInfoCircle,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

library.add(faSun, faInfoCircle, faPlus, faTrashCan);
const app = createApp(App);

app.use(router);
app.use(VueSweetalert2);
app.use(Toast);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
