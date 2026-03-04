import { storage } from "@itokun99/secure-storage";
import { createJSONStorage } from "jotai/utils";

export const atomStorage = createJSONStorage(() => ({
  setItem: (key: string, value: string) => {
    storage.save(key, value);
    return Promise.resolve();
  },
  getItem: (key: string) => {
    return Promise.resolve(storage.get(key));
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
}));
