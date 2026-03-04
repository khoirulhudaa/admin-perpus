import { createStore } from "jotai";
import dictionaries from "./dicts/default.json";
import { LanguageKeyType } from "./types";
import { replaceString } from "./utils";
import { storage } from "@itokun99/secure-storage";

// console.log(`storage.get("lang")`, storage.get("lang"));

const langAtom: LanguageKeyType = "id";
const langStore = createStore();
const getActiveLang = () => storage.get("lang") || langAtom;
const setActiveLang = (key: LanguageKeyType) => storage.save("lang", key);

const text = (
  key: keyof typeof dictionaries,
  replacements?: Record<string, string>,
) => {
  const selectedWord = dictionaries[key];
  const activeLang = getActiveLang();
  let result = selectedWord[activeLang as keyof typeof selectedWord] || key;

  if (replacements && Object.keys(replacements)?.length > 0) {
    result = replaceString(result, replacements);
  }

  return result;
};

export const lang = {
  atom: langAtom,
  store: langStore,
  text,
  getActiveLang,
  setActiveLang,
};
