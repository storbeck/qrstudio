import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { VColorInput } from "vuetify/labs/VColorInput";
import 'vuetify/styles'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VColorInput,
    },
  });

  app.vueApp.use(vuetify)
})
