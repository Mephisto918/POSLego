<script setup>
import { apiStore } from '@/stores/api';
import { login } from '@/stores/auth';

import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const toast = useToast();

import route from '@/router';

import axios from '@/axiosConfig';
import { onMounted, ref } from 'vue';

let errorDia = ref(null);
let messageErrorDia = ref('');
let erCount = ref(3);
const timedout = ref(false);
let timetime = 5;
let time = ref(timetime);
let intervalId = null;


const form = ref({
    username: '',
    password: '' 
});
let status = ref('');

const loginHandling = async () => {
    if(timedout.value) return Message(1);
    try{
        const response = await axios.post(apiStore().api+'login/',form.value);
        const { token, id } = response.data;
        login(token, id); 
        if(response.status === 200){
            setTimeout(() => {
                route.push({name: 'Dashboard', params: {id: response.data.id}});
            }, 1500);
            Message(response.status);
            return;
        }
    }catch(error){
        Message(error.response.status);
    } 
}

const redirect = ()=>{
    route.push('/cart');
}

function Message(status){
    if(status == '1'){
        errorDia.value.style.backgroundColor = `rgba(255, 0, 0, 0.355)`;
        messageErrorDia.value = 'Currently Timed Out!';
    }else if(status >= '200' && status <= '299'){
        errorDia.value.style.backgroundColor = `rgba(0, 255, 0, 0.355)`;
        messageErrorDia.value = 'Login Success, Redirecting...';
    }else if(status >= '400' && status <= '499'){
        errorDia.value.style.backgroundColor = `rgba(255, 0, 0, 0.355)`;
        messageErrorDia.value = 'Wrong password or username!';
    
        if(erCount.value <=1){
            toast.error(`Login Timedout!`, {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            intervalId = setInterval(()=>{
                time.value--;
                if(time.value === 0){
                    timedout.value = false;
                    time.value = timetime;
                    erCount.value = 3;
                    errorDia.value.style.backgroundColor = `rgba(0, 0, 0, 0)`;
                    messageErrorDia.value = ``;
                    return clearInterval(intervalId);
                }
                errorDia.value.style.backgroundColor = `rgba(255, 0, 0, 0.355)`;
                messageErrorDia.value = `Currently Timed Out! ${time.value}s`;
            }, 1000)
            timedout.value = true;
            return;
        }
        erCount.value--;
        toast.error(`Attempts Left: ${erCount.value}`, {
            duration: 3000,
            close: true,
            position: "top-right",
        });
    }else if(status < '500'){
        errorDia.value.style.backgroundColor = `rgba(255, 0, 0, 0.355)`;
        messageErrorDia.value = 'Cannot Connect to Server!';
    }
}

</script>

<template>
    <div id="cart" @click="redirect" >
        <div class="pi pi-shopping-cart"></div>
    </div>
    <section>
        <div>
            <form @submit.prevent="loginHandling">
                <div>
                    <label for="username">USERNAME</label>
                    <input type="text" name="username" id="username" required v-model="form.username">
                </div>
                <div>
                    <label for="password">PASSWORD</label>
                    <input type="password" name="password" id="password" required v-model="form.password">
                </div>
                <!-- <div id="error"></div> -->
                <div ref="errorDia" id="error"> {{ messageErrorDia }}</div>
                <div>
                    <button>LOGIN</button>
                    <a @click="route.push({name: 'signup'})">New User? SIGN UP!</a>
                </div>
            </form>
        </div>
    </section>
</template>

<style scoped>

section{

    display: flex;
    justify-content: center;
    align-items: center;

    height: 100dvh;

    /* background-color: var(--svg-bg-color); */
    background-image: var(--svg-bg);

    --cascading-gap: 1rem;
    --font-color: rgb(209, 205, 205);

    >div{
        >form{
            color: var(--font-color);
            background-color: rgba(50, 50, 50, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 8px;
            backdrop-filter: blur(6px);
            box-shadow: rgba(186, 186, 189, 0.25) 0px 30px 60px -12px inset, rgba(249, 248, 248, 0.3) 0px 18px 36px -18px inset;
            
            padding: 2rem;
            font-family: var(--big-text-fam);
            font-weight: var(--large-font-weight);

            display: flex;
            flex-direction: column;
            gap: calc(var(--cascading-gap) * 0.5);
    
            >div:nth-child(1), >div:nth-child(2){
                display: flex;
                flex-direction: column;
                gap: calc(var(--cascading-gap) * 0.3);
                margin-bottom: 1rem;
                text-shadow: 0px 0px 5px #638253;
                
                &>label{
                    font-size: 1.5rem;
                }
                &>input{
                    background-color: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 5px;
                    padding: 0.2rem 0.6rem;
                    color: inherit;
                    font-family: var(--text-fam);
                    max-width: 10rem;
                    min-width: 15rem;
                    
                    &:focus{
                        outline: none;
                        border: 1px solid rgba(255, 255, 255, 0.6)
                    }
                }
                &:nth-child(1){
                    &:invalid{
                        color: red;
                    }
                }
                &:nth-child(2){
                    &:invalid{
                        color: red;
                    }
                    
                    /* margin-bottom: 2rem; */
                }
            }
            
            >#error{
                display: flex;
                justify-content: center;
                align-items: center;
                
                /* background-color: rgba(255, 0, 0, 0.355); */

                /* border: 1px solid white; */
                height: 2rem;
                transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
                color: color-mix(in srgb, var(--font-color) 80%, BLACK 10%);
                border-radius: 3px;
                
                padding: 0.3rem;
                text-align: center;
            }

            >div{
                display: flex;
                flex-direction: column;
                gap: calc(var(--cascading-gap) * 0.1);
                text-shadow: 0px 0px 5px #638253;
                >button{
                    padding: 0.2rem 0.6rem;
                    background-color: rgba(0, 0, 0, 0.4);
    
                    text-align: center;
                    border-radius: 5px;
                    padding: 0.4rem 0.7rem;
                    text-shadow: 0px 0px 5px #638253;
                    
                    &:hover{
                        cursor: pointer;
                        background-color: rgba(255, 255, 255, 0.2);
                        box-shadow: rgba(186, 186, 189, 0.25) 0px 30px 60px -12px, rgba(249, 248, 248, 0.3) 0px 18px 36px -18px ;
    
                    }
                    &:focus{
                        outline: none;
                        border: 1px solid rgba(255, 255, 255, 0.6)
                    }
                }
                a{
                    font-size: 0.8rem;
                    color: color-mix(in srgb, var(--font-color) 100%, blue 50%);
                    width: fit-content;
                    &:hover{
                        color: color-mix(in srgb, var(--font-color) 100%, blue 20%);
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
#cart{
    height: 3rem;
    aspect-ratio: 1/1;
    background-color: var(--glass-bg-hard);
    border: 1ps solid blue;
    border-radius: 10px;
    
    position: absolute;
    top: 10px;
    left: 10px;

    font-size: 20pt;
    text-align: center;
    display: grid;
    place-content: center;
    
    &:hover{
        cursor: pointer;
        background-color: var(--glass-bg-soft);
        color: var(--glass-bg-mild-soft-trans);
        
        &:active{
            color: var(--glass-bg-light);
            background-color: var(--glass-bg-hard-trans);
        }
    }
}
</style>