<script setup>
import { apiStore } from '@/stores/api';

import axios from 'axios';
import { onMounted, ref} from 'vue';
import { watch, toRefs} from 'vue';
import decisionModal from '../components/decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
const useModalLib = modalLib();

import route from '@/router';
import { computed } from 'vue';
import { toRef } from 'vue';


const form = ref({});
const passMatch = ref(false);

function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}

const singUpHandling = async () => {
    try{
        if(!passMatch.value){
            return Message("Password Do Not Match", 400);
        }
        const response = await axios.post(apiStore().api+'users/signup/',form.value);
        if(response.status == '201'){
            //to pass message to the modal use this
            Message("Sign Up Successful", 200);
            setTimeout(async() => {
                useModalLib.modalMessage.sign = "pi pi-question" // look for icon in primeicon website
                useModalLib.modalMessage.message = "Do you want to Log In Now?"
                useModalLib.modalMessage.action = "Log In"
                useModalLib.modalMessage.action1 = "No" //false
                useModalLib.modalMessage.action2 = "Yes" //true

                const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
                if(boolDecision){
                    setTimeout(() => {
                        route.push({name: 'login'});
                    }, 1000);
                }
            }, 2000)
            return;
        }
    }catch(error){
        console.log('52-',error.response);
    } 
}

watch(()=> [form.value.password, form.value.passConfirm], ([pass, passConfirm]) => {
    if (pass !== passConfirm) {
        passMatch.value = false;
    } else {
        passMatch.value = true;
    }
});

function Message(msg, status){
    const error = document.querySelector('#error');
    if(Number(status) <= 299){
        error.style.backgroundColor = `rgba(0, 255, 0, 0.355)`;
        error.textContent = `${msg}`;
    }else{
        error.style.backgroundColor = `rgba(255, 0, 0, 0.355)`;
        error.textContent = `${msg}`;
    }
}
</script>

<template>
    <decisionModal 
        v-if="useModalLib.decisionModalToggle" 
            :sign="useModalLib.modalMessage.sign" 
            :message="useModalLib.modalMessage.message"  
            :action="useModalLib.modalMessage.action" 
            :action1="useModalLib.modalMessage.action1" 
            :action2="useModalLib.modalMessage.action2"
            @decision="handleDecision">
    </decisionModal>
    <section class="trans">
        <form @submit.prevent="singUpHandling">
            <div>
                <label for="">Preffered Name: </label>
                <input type="text" name="name" id="name" required v-model="form.name">
            </div>
            <div>
                <label for="">Username: </label>
                <input type="text" name="username" id="username" required  v-model="form.username">
            </div>
            <div>
                <div>
                    <label for="">Password: </label>
                    <input type="password" name="password" id="password" required v-model="form.password">
                </div>
                <div>
                    <label for="">Repeat Password: </label>
                    <input type="password" name="passwordVerify" id="passwordVerify" required v-model="form.passConfirm">
                </div>
            </div>
            <div id="error">

            </div>
            <div>
                <button>Submit</button>
                <a @click="route.push({name: 'login'});">Already have an account?</a>
            </div>
        </form>
    </section>
</template>


<style scoped>
@import url(../assets/master.css);

.trans{
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100dvh;

    background-color: rgb(37, 38, 37);
    background-image: var(--svg-bg);

    --cascading-gap: 1rem;
    --font-color: rgb(209, 205, 205);

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
            margin-bottom: 1rem;
            /* background-color: var(--debug-red);   */
        }
        >div{
            display: flex;
            flex-direction: column;
            gap: calc(var(--cascading-gap) * 0.1);
            text-shadow: 0px 0px 5px #638253;

            &>label{
                font-size: 1.5rem;
            }
            >div{
                display: flex;
                flex-direction: column;
                gap: calc(var(--cascading-gap) * 0.1);
                text-shadow: 0px 0px 5px #638253;
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
                    &:nth-child(1){
                        &:invalid{
                            color: red;
                        }
                    }
                    &:nth-child(2){
                        &:invalid{
                            color: red;
                        }
                    }
                    &:nth-child(3){
                        &:invalid{
                            color: red;
                        }
                        background-color: red;
                    }
                }
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
                &:nth-child(1){
                    &:invalid{
                        color: red;
                    }
                }
                &:nth-child(2){
                    &:invalid{
                        color: red;
                    }
                }
                &:nth-child(3){
                    &:invalid{
                        color: red;
                    }
                    background-color: red;
                }
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

</style>