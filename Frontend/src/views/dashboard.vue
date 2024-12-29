<script setup>
import { useRoute } from 'vue-router';
import { ref,onMounted } from 'vue';
import { apiStore } from '@/stores/api';
import { userStore } from '@/stores/userStore';
import router from '@/router';
import decisionModal from '../components/decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
const useModalLib = modalLib();


import axios from 'axios';

import AppSidebar from '@/components/sidebar.vue';
import Navbar from '@/components/navbar.vue';

const route = useRoute();
const render = ref(false);
const userId = route.params.id;
const store = userStore();
const image = ref();

const pageView = ref('');
const currentPage = (pageName) =>{
    pageView.value = pageName;
}

function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}

async function decisionTime(){
    //to pass message to the modal use this
    useModalLib.modalMessage.sign = "pi icon" // look for icon in primeicon website
    useModalLib.modalMessage.message = "message"
    useModalLib.modalMessage.action = "message"
    useModalLib.modalMessage.action1 = "message" //false
    useModalLib.modalMessage.action2 = "message" //true

    const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
    if(boolDecision){
        // do something
    }else{
        // do nothing
    }
}

async function fetchData(){
    try{

        const response = await axios.get(apiStore().api+'users/'+userId);

        if(response.status == 200){
            const data = response.data;
            image.value = data.image;
            store.setUserInfo(data.user);
            render.value = true;
        };
    }catch(error){
        console.log('60 er ', error);
        if(error.response.status){
            const data = error.response.data;
            image.value = data.image;
            store.setUserInfo(data.user);
            render.value = true;
        };
    }
    pageView.value = route.name;
}

onMounted( async () => {
    fetchData();
})

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
    <div v-if="render">
        <section>
            <div class="con">
                <div>
                    <AppSidebar :name="store.name()" :username="store.username()" @pageName="currentPage" :user-image="image"></AppSidebar>
                    <Navbar :viewName="pageView"></Navbar>
                </div>
            </div>
        </section>
    </div>
</template>


<style scoped>
/* @import url(../master.css); */

button{
    display: block;
}

.con{
    height: 100dvh;

    padding: 0.5rem;
    >div{
        width: 100%;
        height: 100%;
        background-color: var(--glass-bg-hard-soft-trans);
        border: 1px solid var(--glass-bg-soft);
        border-radius: 10px;
        backdrop-filter: blur(6px);

        display: flex;
        flex-direction: row;

        gap: 0.5rem;
        padding: 0.5rem;
    }
}

#modal{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    height: auto;
    font-size: 20pt;
    z-index: 2;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    &:before{
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100dvw;
        height: 100dvh;
        backdrop-filter: blur(60px);
        background-color: rgba(0, 0, 0, 0.2);
        z-index: -1;

    }
    >p{
        background-color: rgba(0, 0, 0, .6);
        border-radius: 10px;
        padding: 1rem;
    }
    >a{
        color: rgb(55, 68, 251);
        background-color: rgba(0, 0, 0, .6);
        border-radius: 10px;
        padding: 0.5rem;

        &:hover{
            background-color: rgba(0, 0, 0, .4);
            color: rgb(50, 50, 251);
            cursor: pointer;
        }
    }
}

.positive-button{
    background-color: blue;
    padding: 0.4rem 0.6rem;
    border-radius: 10px;
    font-size: 15pt;

    &:hover{
        background-color: rgb(68, 68, 242);
        cursor: pointer;
    }
}
</style>