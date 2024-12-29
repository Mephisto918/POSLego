<script setup>
import { RouterView, useRoute } from 'vue-router';
// import { auth } from '@/stores/auth';
import router from '@/router';

import decisionModal from '../components/decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
const useModalLib = modalLib();

defineProps({
    viewName: {
        type: String,
        default: 'Dashboard',
    }
})

function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}


async function logOut(){
    //to pass message to the modal use this
    useModalLib.modalMessage.sign = "pi pi-power-off" // look for icon in primeicon website
    useModalLib.modalMessage.message = "Are you sure you want to Logout?"
    useModalLib.modalMessage.action = "Logout?"
    useModalLib.modalMessage.action1 = "Cancel" //false
    useModalLib.modalMessage.action2 = "Continue" //true

    const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
    if(boolDecision){
        // do something
        // auth().logOut();
        router.push({name: 'login'});
    }else{
        // do nothing
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
    <section>
        <div>
            <h1>{{ viewName }}</h1>
            <a>Settings</a>
            <a>Messages</a>
            <a id="logout" @click="logOut">Logout</a>
            <a><i class="pi pi-bars"></i></a>
        </div>
        <RouterView></RouterView>
    </section>
</template>

<style scoped>
/* navbar.vue css */
section{
    border: 1px solid var(--glass-bg-mild-soft-trans);
   
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    flex-grow: 2;
    height: 100%;

    >div:nth-child(1){
        background-color: var(--glass-bg-soft-trans);
        
        width: 100%;
        height: 5rem;

        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 1rem;

        padding: 0rem 1.5rem;
        >:nth-child(1){
            &:nth-child(1)::first-letter{
                text-transform: uppercase;
            }
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
        >:nth-child(2){
            margin-left: auto;
        }
        >a{
            padding: 0.2rem 0.6rem;
            font-weight: 600;
            color: inherit;
            font-family: var(--text-fam);

            &:hover{
                background-color: var(--glass-bg-soft);
                border-radius: 4px;
                color: var(--glass-bg-hard);
                cursor: pointer;
            }
        }
    }
}
</style>