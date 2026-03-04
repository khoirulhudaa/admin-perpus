import { storage } from "@itokun99/secure-storage";

export const saveToken = (token: string) => storage.save("auth.token", token);
export const getToken = () => {
  const t = storage.get<string>("auth.token");
  // console.log(t);
  return t;
};
export const removeToken = () => storage.delete("auth.token");

export * from "./form-schema";
