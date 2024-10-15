// @ts-ignore

import { writable } from "svelte/store";

export let isLoggedIn = writable(false);

export function checkAuth() {
  const token = localStorage.getItem("token");
  isLoggedIn.set(!!token);
}
