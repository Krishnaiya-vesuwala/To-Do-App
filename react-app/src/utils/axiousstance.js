import axios from "axios";
import {base_url} from "./constants"

const axiosInstance=axios.create({
    baseURL:base_url,
    timeout:10000,
    headers:{
        "Content-Type":"application/json"
    },
});

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem("token");

        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

export default axiosInstance;