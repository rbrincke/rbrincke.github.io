import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faHouse);
library.add(faTags);

const app = createApp(App)

app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)
app.mount('#app')
