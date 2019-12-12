import axios from 'axios'

const httpSvc = axios.create({
    baseURL: process.env.VUE_APP_NSESVC_BASE_URL,
    crossDomain: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

 export default httpSvc
