import { createApp } from "vue";
import Oruga from "@oruga-ui/oruga-next";

// import Datatable Plugin
import Datatable from "./components/datatable";

//  import App Component
import App from "./App.vue";

// import css styles
import "@/assets/styles/style.scss";

createApp(App)
  .use(Oruga, {
    // component specific global config
    table: {
      mobileCards: false,
    },
  })
  .use(Datatable)
  .mount("#app");
