import { defineStore } from "pinia";
import { ref } from "vue";

export const apiStore = defineStore("api", () => {
    const api = ref('http://localhost:8000/');
    // const api = ref('http://192.168.254.144:8000/'); //for local hosting on a network
    const customApi = (url) =>{
        api.value = url;
    }
    return { api, customApi };
})