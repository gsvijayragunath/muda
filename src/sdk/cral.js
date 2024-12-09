// @ts-nocheck
import axios from "axios";

import { goto } from "$app/navigation";
import BaseUrl from "../baseurl.json";

const BaseURL = BaseUrl.url;

function CreateProfileCard(formData) {
  let Url = BaseURL + `/gravatardata`;
  return axios({
    method: "POST",
    url: Url,
    data: JSON.stringify(formData),
  });
}

const SignUp = (formData) => {
  let data = JSON.stringify(formData);
  let url = BaseURL + "/signup";
  return axios({
    method: "post",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const SignIn = (email, password) => {
  let credentials = { email: email, password: password };
  let data = JSON.stringify(credentials);
  let url = BaseURL + "/signin";
  return axios({
    method: "post",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const SignOut = () => {
  localStorage.clear();
  goto("/signin");
};

export default {
  CreateProfileCard,
  SignUp,
  SignIn,
  SignOut,
};
