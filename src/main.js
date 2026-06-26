import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import sentry library to use DNS
import * as Sentry from "@sentry/vue";

const app = createApp(App)

Sentry.init({
  app,
  dsn: "https://e21ebed524081bffd83b6b68c56af9c9@o4511604637761536.ingest.us.sentry.io/4511604698316800",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
  },
  integrations: [
    Sentry.replayIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),

  ],
  // Session Replay

  // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: 1.0,
  // Logs
  enableLogs: true,
});

app.use(router)
app.mount('#app')