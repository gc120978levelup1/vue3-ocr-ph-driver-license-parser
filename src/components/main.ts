import type { App } from 'vue';
import Vue3OcrPhDriverLicenseParser from "@/components";

export default {
  install: (app: App) => {
    app.component('Vue3OcrPhDriverLicenseParser', Vue3OcrPhDriverLicenseParser);
  }
};

export {Vue3OcrPhDriverLicenseParser} ;
