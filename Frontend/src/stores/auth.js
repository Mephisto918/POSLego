import { defineStore } from "pinia";
import { computed, ref } from "vue";

let state = ref({
    toek: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || ''
})

function login(token, userId){
    state.token = token;
    state.userId = userId;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
}

function logout(){
    state.token = '';
    state.userId = '';

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
}

const isAuth = computed(()=>{ !!state.token });

function auth() {  
    // console.log('yawaw oroy');
}

export { state, login, logout, isAuth, auth}