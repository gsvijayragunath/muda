// @ts-nocheck
import axios from 'axios'

import {
    goto
} from '$app/navigation';
import {
    base
} from '$app/paths';
import BaseUrl from '../baseurl.json'

export const ssr = false
const BaseURL = BaseUrl.url
const WSURL = BaseUrl.ws

const GetDataSet = (dataset, parameters, company = 0) => {
    const payload = {
        "DataSetID": dataset,
        "Variables": parameters
    }
    const url = `/api/query/dataset/${company}`
    return PostData(url, payload)
}

const Getdata = (url) => {
    // url = url.replace("{company}", localStorage.getItem("company"))
    url = encodeURI(url)
    return axios({
        method: 'get',
        url: BaseURL + url,
        headers: {
            'token': localStorage.getItem("token")
        }
    })
}
//Get Records from Tables, with company pagesize and pageno
const FindAllRecords = (table, company, pagesize, pageno) => {
    const url = `/api/messages/${table}/${company}/${pagesize}/${pageno}`
    return Getdata(url)
}
const GetRecordCount = (table, company) => {
    const url = `/api/messagescount/${table}/${company}`
    return Getdata(url)
}

const GetRecord = (table, company, id) => {
    const url = `/api/messages/${table}/0/0/0`
    return Getdata(url)
}

const GetRecordByFilter = (table,payload)=>{
    return axios({
        method: 'post',
        data:payload,
        url: BaseURL +  `/api/messages/${table}/0/0/0`,
        headers: {
            'token': localStorage.getItem("token")
        }
    })
}

const SetFilter = (field, condition, value) => {
    return ({
        Field: field,
        Condition: condition,
        Value: value
    })
}

//Get Records from Tables, with company pagesize and pageno with Filters
const FindRecordsWithFilter = (table, company, pagesize, pageno, filters) => {
    let payload = []
    if (filters && filters.length < 0) {
        payload.push(filters)
    } else {
        payload = filters
    }
    const url = `/api/messages/${table}/${company}/${pagesize}/${pageno}`
    return PostData(url, payload)
}

//Get Single record by ID
const FindOne = (table, company, id) => {
    const url = `/api/messages/${table}/${company}/${id}`
    return Getdata(url)
}


const CheckandRestrictURL = (path) => {
    const isSignInPath = window.location.pathname.startsWith(base + "/signin");
        if (!isSignInPath && !IsUserLoggedIn()) {
            goto(base + "/signin");
        } 
        if (window.location.pathname !== '/signin/forgetpassword/otp') {
            localStorage.removeItem('email');
        }
};

const Insert = async (table, payload) => {
    payload = removeNullValues(payload)
    let url = `${BaseURL}/api/message/${table}/0`
    url = encodeURI(url)
    try {
        let result = await axios({
            method: 'post',
            url: url,
            data: payload,
            headers: {
                'token': localStorage.getItem("token")
            }
        })
        return result.data
    } catch (error) {
        // Handle error
        console.error('Error inserting record:', error);
        throw error;
    }
}
const Update = async (table, payload) => {
    payload = removeNullValues(payload)
    let url = `${BaseURL}/api/message/${table}/${localStorage.getItem("company")}`
    url = encodeURI(url)
    try {
        let result = await axios({
            method: 'put',
            url: url,
            data: payload,
            headers: {
                'token': localStorage.getItem("token")
            }
        })
        return result.data
    } catch (error) {
        // Handle error
        console.error('Error updating record:', error);
        throw error;
    }
}

const Upsert = async (table, payload) => {
    payload = removeNullValues(payload)
    let url = `${BaseURL}/api/message/${table}/${localStorage.getItem("company")}`
    url = encodeURI(url)
    try {
        let result = await axios({
            method: 'patch',
            url: url,
            data: payload,
            headers: {
                'token': localStorage.getItem("token")
            }
        })
        return result.data
    } catch (error) {
        // Handle error
        console.error('Error upserting record:', error);
        throw error;
    }
}
const Delete = async (table, record_id) => {
    // payload = removeNullValues(payload)
    ///messagedel/{topic}/{company}
    let url = `${BaseURL}/api/message/${table}/0/${record_id}`
    url = encodeURI(url)
    try {
        let result = await axios({
            method: 'delete',
            url: url,
            headers: {
                'token': localStorage.getItem("token")
            }
        })
        // console.log('delete', result)
        return result.data
    } catch (error) {
        // Handle error
        console.error('Error upserting record:', error);
        throw error;
    }
}
const DeleteById = async (table, record_id) => {
    ///messagedel/{topic}/{company}
    let url = `${BaseURL}/api/message/${table}/${localStorage.getItem("company")}/${record_id}`
    url = encodeURI(url)
    try {
        let result = await axios({
            method: 'delete',
            url: url,
            data: payload,
            headers: {
                'token': localStorage.getItem("token")
            }
        })
        return result.data
    } catch (error) {
        // Handle error
        console.error('Error upserting record:', error);
        throw error;
    }
}

const GetTopicDef = async (topic) => {
    let url = BaseURL + `/api/topic/${topic}`
    url = encodeURI(url)
    const token = localStorage.getItem("token")
    let returnval = {}
    try {
        let result = await axios({
            method: 'get',
            url: url,
            headers: {
                'token': token
            }
        })
        return result

    } catch (error) {
        // Handle error
        console.error('Error Getting topic:', error);
        throw error;
    }
    return returnval
}

function getListValues(listid) {
    return Getdata('/api/lists/' + listid)
}

const Topic2Header = async (topic, hidenew = [], hideupdate = [], newReadonly = [],
    editReadonly = [], hideGrid = [], customDecimal = {}, link = [], inline = [], hideSearchHeader = [], disableSort = [], centerAlign = [], rightAlign = []) => {
    let headers = []
    let fields = topic.FieldDefs
    if (fields == undefined) {
        return []
    }
    let localLists = JSON.parse(localStorage.getItem("lists"))
    if (localLists == null) {
        localLists = {}
    }
    const buildHdr = async () => {
        fields.forEach(
            (fld) => {
                const decimalPlace = fld.DataType.toLowerCase() == "float" ? (
                    customDecimal[fld.FieldName] > 0 ? customDecimal[fld.FieldName] : 2) : 0

                headers.push({
                    key: fld.FieldName,
                    label: fld.Description,
                    datatype: fld.DataType.toLowerCase(),
                    grid: hideGrid.includes(fld.FieldName) ? false : true,
                    insert: hidenew.includes(fld.FieldName) ? false : true,
                    edit: hideupdate.includes(fld.FieldName) ? false : true,
                    hideSearchHeader: hideSearchHeader.includes(fld.FieldName) ? false : true,
                    sortable: disableSort.includes(fld.FieldName) ? false : true,
                    editReadonly: fld.IsKey || editReadonly.includes(fld.FieldName) ? true : false,
                    insertReadonly: newReadonly.includes(fld.FieldName) ? true : false,
                    RefersTo: fld.Props.RefersTo,
                    ReferenceField: fld.Props.ReferenceField,
                    list: fld.Props.List,
                    listid: fld.Props.ListID,
                    options: fld.options,
                    length: fld.Length,
                    isKey: fld.IsKey,
                    compType: link.includes(fld.FieldName) ? 'link' : determineComp(fld),
                    decimalPlaces: decimalPlace,
                    inline: inline.includes(fld.FieldName) ? true : false,
                    Mandatory: fld.Mandatory,
                    Align: centerAlign.includes(fld.FieldName) ? 'center' : (rightAlign.includes(fld.FieldName) ? 'right' : 'left')
                })

            })

        headers.forEach(async (field) => {
            if (field.list) {
                if (localLists[field.listid] == undefined || localLists[field.listid].length <= 0) {
                    await Getdata('/api/lists/' + field.listid).then((response) => {
                        try {
                            field.options = response.data.Items.Items
                            localLists[field.listid] = field.options
                            localStorage.setItem("lists", JSON.stringify(localLists))
                        } catch (e) { }
                    })
                } else {
                    field.options = localLists[field.listid]
                }

            }
        })
    }
    await buildHdr()
    return headers
}

function determineComp(fld) {

    if (fld.Props.List) {
        return "list"
    }
    if (fld.Props.RefersTo && fld.Props.RefersTo.length > 0) {
        return "zoom"
    }
    const datatype = fld.DataType.toLowerCase()
    if (datatype.includes("date")) {
        return "date"
    }
    if (datatype.includes("number")) {
        return "number"
    }
    if (datatype.includes("float")) {
        return "number"
    }
    if (datatype.includes("bool")) {
        return "checkbox"
    }
    return "text"
}

function SortData(filteredItems, col) {
    let sortables = []
    sortables.push({
        key: col.key,
        direction: col.descending ? 'dsc' : 'asc'
    })
    return sortArray(filteredItems, sortables)
}

function sortArray(array, sorting) {
    // Clone the array to avoid mutating the original array
    const sortedArray = [...array];

    sortedArray.sort((a, b) => {
        for (let i = 0; i < sorting.length; i++) {
            const {
                key,
                direction
            } = sorting[i];

            let valueA = a[key];
            let valueB = b[key];

            // Handle case-insensitive sorting for string values
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
            }
            if (typeof valueB === 'string') {
                valueB = valueB.toLowerCase();
            }

            if (valueA < valueB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });
}
const PostData = (url, payload) => {
    url = url.replace("{company}", localStorage.getItem("company"))
    url = encodeURI(url)
    return axios({
        method: 'post',
        url: BaseURL + url,
        data: payload,
        headers: {
            'token': localStorage.getItem("token")
        }
    })
}
const CallAPI = (url, method, payload) => {
    url = url.replace("{company}", localStorage.getItem("company"))
    url = encodeURI(url)
    return axios({
        method: method,
        url: BaseURL + url,
        data: payload,
        headers: {
            'token': localStorage.getItem("token")
        }
    })
}
const SignIn = (user, pass) => {
    let cred = new Object();
    cred["username"] = user
    cred["password"] = pass
    let data = JSON.stringify(cred)
    let url = BaseURL + "/api/signin"
    return axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })

}

const multiFactorSignIn = (username, otp) => {
    let url = BaseURL + `/api/verifyotp/${username}/${otp}`
    return axios({
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
        }
    })
}


const forgetPassword = (email) => {
    let url = BaseURL + `/api/forgotpassword/${email}`
    url = encodeURI(url)
    return axios({
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
        }
    })
}

const ChangePassWord = (ChangePass) => {
	let url = BaseURL + '/api/changepassword_self';
	return axios({
		method: 'post',
        maxBodyLength: Infinity,
		url: url,
		data: ChangePass,
		headers: {
			token: localStorage.getItem('token'),
			'Content-Type': 'application/json'
		}
	});
};

const OTP = (email, otp) => {
    let url = BaseURL + `/api/validatereset/${email}/${otp}`
    url = encodeURI(url)

    return axios({
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
        }
    })
}

const resetPassword = (restPassData) => {
    let url = BaseURL + `/api/reset_self`
    url = encodeURI(url)
    return axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        data: restPassData,
        headers: {
            'token': localStorage.getItem("tokenOTP"),
            'Content-Type': 'application/json'
        }
    })
}

const SignOut = () => {
    localStorage.clear()
    deleteCookie("token")
    deleteCookie("userinfo")
    goto("/signin")
}
const IsUserLoggedIn = () => {
    let token = localStorage.getItem('token')
    if (token == "" || token == undefined) {
        token = GetCookie("token")
        if (token === null || token === "") {
            return false
        }
    }

    try {
        let info = parseJwt(token)
        localStorage.setItem("token", token)
        localStorage.setItem("exp", info.Exp)
        localStorage.setItem("userid", info.UserID)
        let now = Date.now() / 1000
        let expd = new Date(info.exp).getTime()
        if (now > expd) {
            return false
        }
    } catch (e) {
        SignOut()
        return false
    }
    return true
}

const SetLocalStore = (obj) => {
    localStorage.setItem("usertype", obj.UserType)
    localStorage.setItem("userid", obj.userid)
    localStorage.setItem("token", obj.token)
    localStorage.setItem("email", obj.Email)
    localStorage.setItem("username", obj.UserName)
    localStorage.setItem("expiresAt", obj.expiresAt)
    localStorage.setItem("FullName", obj.FullName)
    if (localStorage.getItem("company") == null || localStorage.getItem("company") == undefined || localStorage.getItem("company") == "") {
        localStorage.setItem("company", 0)
    }
}

const GetLocalStore = (key) => {
    try {

        return localStorage.getItem(key)
    } catch {
        return ''
    }

}

function removeNullValues(obj) {
    let newObj = {}
    if (obj != null) {
        Object.keys(obj).forEach((prop) => {
            if (obj[prop] !== null && obj[prop] !== undefined) {
                newObj[prop] = obj[prop]
            }
        })
        return newObj.__wrapped || obj
    }
    return {}
}

const SetStoreValue = (key, value) => {
    try {
        return localStorage.setItem(key, value)
    } catch {
        return ''
    }
}
async function InvokeBusinessMethod(boID, funcName, payload) {

    payload = removeNullValues(payload)
    let url = `${BaseURL}/api/execbo/${boID}/${funcName}/${localStorage.getItem("company")}`
    url = encodeURI(url)
    try {
        let result = await axios({
            method: 'post',
            url: url,
            data: payload,
            headers: {
                'token': localStorage.getItem("token")
            }
        })
        return result.data
    } catch (error) {
        // Handle error
        console.error('Error inserting record:', error);
        throw error;
    }
}

function UserType() {
    try {
        return localStorage.getItem('usertype')
    } catch {
        return ''
    }
}

function NoficationsConnect(target, key) {
    if (window["WebSocket"]) {
        const url = `${WSURL}/api/wsconnect/${target}/${key}?token=${localStorage.getItem('token')}`
        let conn = new WebSocket(url);
        return conn
    }
    return undefined
}

function ConvertDatatype(datatype) {
    const number = ["int", "float", "number", "decimal", "long", "integer"];
    if (number.includes(datatype)) {
        return "number";
    }
    return "text";
}

function GetCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();

        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null; // Return null if the cookie with the given name is not found
}

function deleteCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const GetRole = (screenid) => {
    const token = localStorage.getItem("token")
    const info = parseJwt(token)
    return Getdata(`/api/getrole/${info.Username}/${screenid}`)
}

const GetUsers = () => {
    return Getdata(`/api/users`)
}

const GetTopics = () => {
    return Getdata(`/api/topics`)
}

function GetAPIBase() {
    return BaseURL
}

function GetCompanies() {
    return Getdata(`/api/company/list`)
}
export default {
    Getdata,
    SignIn,
    multiFactorSignIn,
    forgetPassword,
    ChangePassWord,
    OTP,
    resetPassword,
    PostData,
    Insert,
    Update,
    Upsert,
    Delete,
    DeleteById,
    FindAllRecords,
    GetRecordCount,
    SetLocalStore,
    CallAPI,
    UserType,
    GetLocalStore,
    NoficationsConnect,
    SetStoreValue,
    IsUserLoggedIn,
    SignOut,
    CheckandRestrictURL,
    GetTopicDef,
    Topic2Header,
    SetFilter,
    FindRecordsWithFilter,
    FindOne,
    GetRecord,
    ConvertDatatype,
    getListValues,
    InvokeBusinessMethod,
    GetCookie,
    GetAPIBase,
    BaseURL,
    GetDataSet,
    GetRole,
    GetUsers,
    GetTopics,
    GetCompanies,
    //own
    GetRecordByFilter
}