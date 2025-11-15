import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons/faAddressCard';

library.add(faHouse);
library.add(faTags);
library.add(faCalendarAlt);
library.add(faCopy);
library.add(faCheck);
library.add(faMinus);
library.add(faAddressCard)

const app = createApp(App)

app.use(router)
app.use(hljsVuePlugin)
app.component("font-awesome-icon", FontAwesomeIcon)
app.mount('#app')
