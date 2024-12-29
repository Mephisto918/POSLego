<script setup>
import axios from 'axios';
import { onMounted, ref, watch} from 'vue';
import { apiStore} from '@/stores/api';
import { userStore } from '@/stores/userStore';
import { modalLib} from '@/stores/modalLogics';
const useModalLib = modalLib();
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const toast = useToast();

import decisionModal from '../decisionModal.vue';
import editUser from './editUser.vue';

const selectedUser = ref({})
const useStore = userStore();
const modalEditUserToggle = ref(false);
let users = ref([]);


function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}

function showEditModal(user){
    selectedUser.value = user.id;
    !modalEditUserToggle.value ? modalEditUserToggle.value = true : modalEditUserToggle.value = false;
}
async function decisionTime(){
        //to pass message to the modal use this
    useModalLib.modalMessage.sign = "message" // look for icon in primeicon website
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

async function deleteUser(user) {
        //to pass message to the modal use this
    useModalLib.modalMessage.sign = "pi pi-exclamation-circle" // look for icon in primeicon website
    useModalLib.modalMessage.message = `Do you want to delete User ${user.name}?`
    useModalLib.modalMessage.action = "Caution"
    useModalLib.modalMessage.action1 = "Cancel" //false
    useModalLib.modalMessage.action2 = "Delete" //true

    const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
    if(boolDecision){
        try{
            const id = user.id;
            const response = await axios.delete(apiStore().api+'users/delete/'+id);
            toast.success(`Successfully Deleted User ${user.name}`, {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            fetchData();
        }catch(error){
            // posible error for constraints
            toast.error(`Something Went Wrong!`, {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            console.log('71 - ', error);
        }
    }else{
        // do nothing
    }
}

const fetchData = async () => {
    try{
        const response = await axios.get(apiStore().api+'users/all');
        users.value = response.data.filter(user => user.id != useStore.id());
    }catch(error){
        console.log('84 - ', error);
    }
}

onMounted(() => {
    fetchData();
});

</script>

<template>
    <section>
        <editUser v-if="modalEditUserToggle" v-model="modalEditUserToggle" @closeModal="fetchData" :id="selectedUser"></editUser> 
        <decisionModal 
            v-if="useModalLib.decisionModalToggle" 
            :sign="useModalLib.modalMessage.sign" 
            :message="useModalLib.modalMessage.message"  
            :action="useModalLib.modalMessage.action" 
            :action1="useModalLib.modalMessage.action1" 
            :action2="useModalLib.modalMessage.action2"
            @decision="handleDecision">
        </decisionModal>
        <div id="inner">
            <table>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <!-- <th>Misc</th> -->
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    <tr v-for="user in users" :key="user.id" v-if="(users.length > 0)">
                        <td :title="user.id">{{ user.id }}</td>
                        <td :title="user.name">{{ user.name }}</td>
                        <td :title="user.username">{{ user.username }}</td>
                        <td :title="user.password">{{ user.password }}</td>
                        <td><button @click="showEditModal(user)"><i class="pi pi-pencil"></i></button></td>
                        <td><button @click="deleteUser(user)"><i class="pi pi-trash" ></i></button></td>
                    </tr>
                    <tr v-else>
                        <th colspan="8"><h1>Empty!</h1></th>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>

section{
    width: 100%;
    overflow-y: scroll;
}
table{
    background-color: color-mix(in srgb, var(--glass-bg-hard) 10%, black 70%);
    >tbody{
        width: 100%;
        
        position: relative;
        --id-width: 3rem;
        >tr:nth-child(1){
            position: sticky;
            top: 1px;
            right: 0;
            background-color: var(--glass-bg-hard);
            
            >th:nth-child(1){
                max-width: var(--id-width);
            }
        }

        >tr:not(:nth-child(1)){
            >td:nth-child(5), >td:nth-child(6){
                text-align: center;
                &>*{
                    /* background-color: var(--debug-red); */
                    color: var(--glass-bg-hard);
                    background-color: var(--glass-bg-soft);
                    padding: 0.5rem;
                    aspect-ratio: 1/1;
                    border-radius: 5px;
                    &:hover{
                        background-color: var(--glass-bg-mild-soft-trans);
                        color: var(--glass-bg-soft);
                        cursor: pointer;
                        &:active{
                            background-color: var(--glass-bg-hard);
                            color: var(--glass-bg-soft-trans);
                        }
                    }

                }
            }
            >td:nth-child(1),>td:nth-child(4),>td:nth-child(5){
                text-align: center;
            }
            >td:nth-child(1){
                /* background-color: var(--debug-green);    */
                max-width: var(--id-width);
                min-width: 5rem;
                text-overflow:  clip;
                white-space: nowrap;
                overflow: hidden;
            }
            /* background-color: var(--debug-green);    */
        }
        >tr:not(:nth-child(1)):nth-child(odd){
            /* background-color: var(--debug-green);    */
            background-color: color-mix(in srgb, var(--glass-bg-hard-trans) 100%, white 10%);   
        }
        >div{
            width: 100%;
        }
    }
}
 
#inner{
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    >div{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        width: 100%;

        
        >form{
            background-color: var();
            padding: 1rem;
            margin-right: 10%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            gap: 1rem;


            >label{
                height: auto;
                aspect-ratio: 1/1;
                display: flex;
                justify-content: center;
                font-size: 1.5rem;
            }
            >input{
                padding: 0.3rem;
                flex-grow: 1;
                /* background-color: var(--debug-blue); */
                border: 1px solid transparent;
                &:focus{
                    outline: none;
                    /* background-color: var(--debug-blue); */
                    border: 1px solid none;
                }
            }
            >button{
                background-color: var(--debug-blue);

                background-color: var(--glass-bg-soft-trans);
                margin-left: auto;
                padding: 0.2rem 0.5rem;
                margin-right: 0.5%;
                border-radius: 6px;
                height: 70%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;

                &:hover{
                    background-color: var(--glass-bg-soft);
                    color: var(--glass-bg-hard);
                    cursor: pointer;
                    &:active{
                        background-color: var(--glass-bg-hard);
                        color: var(--glass-bg-soft);
                    }
                }
            }
        }
        >button{
            background-color: var(--glass-bg-soft-trans);
            margin-left: auto;
            padding: 0.2rem 0.5rem;
            margin-right: 0.5%;
            border-radius: 10px;
            height: 70%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            
            >i{
                aspect-ratio: 1/1;
            }
            &:hover{
                background-color: var(--glass-bg-soft);
                color: var(--glass-bg-hard);
                &:active{
                    background-color: var(--glass-bg-hard);
                    color: var(--glass-bg-soft);
                }
            }
        }
    }
}
</style>