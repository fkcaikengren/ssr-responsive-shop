
import axios from 'axios'
import apiConfig,{baseUrl} from '../config/api'


//create an instance of axios
const service = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {'X-Custom-Header': 'caikengren'},
})

service.interceptors.request.use((config)=>{
    return config
},(err)=> Promise.reject(err))

service.interceptors.response.use((response)=>{
    const {data, status, statusText}  = response
    if(status < 300 && status >= 200){
        return data
    }else{
        return Promise.reject(new Error(statusText))
    }
},err=>{
    return Promise.reject(err)
})



export function request(apiName){
    return service(apiConfig[apiName])
}


export default service



