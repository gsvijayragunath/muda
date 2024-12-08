// @ts-nocheck
import axios from 'axios'

import {goto} from '$app/navigation';
import {base} from '$app/paths';
import BaseUrl from '../baseurl.json'

const BaseURL = BaseUrl.url

function CreateProfileCard(formData){
    let Url = BaseURL + `/gravatardata`
    return axios({
      method:"POST",
      url:Url,
      data:JSON.stringify(formData)
   })
}
 
const SignIn = (email,password) => {
    let cred = {email:email,password:pass}
    let data = JSON.stringify(cred)
    let url = BaseURL + "/signin"
    return axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const SignOut = () => {
    localStorage.clear()
    goto("/signin")
}

export default {
    CreateProfileCard,
    SignIn,
    SignOut,
}