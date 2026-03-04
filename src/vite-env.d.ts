/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_STORAGE_KEY: string;
  readonly VITE_STORAGE_HASH_KEY: string;
  readonly VITE_STORAGE_DISABLED_KEYS: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BASE_NAME: string;
  readonly VITE_STATIC_BASE_URL: string;
  readonly VITE_DEFAULT_THEME: string;
  readonly VITE_THEME_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
