import { defineStore } from "pinia";
import { reactive } from "vue";

export const userStore = defineStore('userStore', () => {
    const user = reactive({
        id: '',
        name: '',
        username: '',
        password: ''
    });
    const setUserInfo = (data)=>{
        user.id = data.id || '';
        user.name = data.name || '';
        user.username = data.username || '';
        user.password = data.password || '';
    }
    const id = ()=>{
        return user.id;
    }
    const name = ()=>{
        return user.name;
    }
    const username = ()=>{
        return user.username;
    }

    return {user, setUserInfo, id, name, username};
})