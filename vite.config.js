import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      // Precompile message files at build time → drop the runtime message compiler from the bundle
      include: [fileURLToPath(new URL('./src/i18n/locales/**', import.meta.url))],
      // We only need the runtime, not the full build
      runtimeOnly: true,
      compositionOnly: true
    })
  ],
  define: {
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  }
});
