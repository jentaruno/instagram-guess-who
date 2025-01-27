/*global __dirname */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from "path";

const root = resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popup: resolve(root, "popup/popup.html"),
      },
    },
  },
});
