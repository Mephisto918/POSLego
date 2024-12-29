<script setup>
import { apiStore } from '@/stores/api';
import axios from 'axios';
import { onMounted, ref} from 'vue'
import decisionModal from '@/components/decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
const useModalLib = modalLib();
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const toast = useToast();

const emit = defineEmits(['closeModal']);

function closeModal(){
    emit('closeModal');
}

function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}

const user = ref({});
const image = ref(null);

async function formSubmit() {
    const { id, name, username, password} = user.value;
    try {

        useModalLib.modalMessage.sign = "pi pi-exclamation-triangle" // look for icon in primeicon website
        useModalLib.modalMessage.message = "Are you sure about the edit?"
        useModalLib.modalMessage.action = "Edit"
        useModalLib.modalMessage.action1 = "Cancel" //false
        useModalLib.modalMessage.action2 = "Confirm" //true

        const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
        if(boolDecision){
            const response = axios.put(apiStore().api+'users/edit/'+id, { user: user.value, image: image.value});
            toast.success('Edit Successful', {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            emit('closeModal');
            setTimeout(()=>{
                location.reload();
            }, 3000)
        }else{
            
        }

    } catch (error) { 
        toast.error('Something Went Wrong', {
            duration: 3000,
            close: true,
            position: "top-right",
        }); 
        console.log('57 - ', error);
    }
}


onMounted(async()=>{
    const id = localStorage.getItem('userId');
    try{
        const response = await axios.get(apiStore().api+'users/'+id);
        user.value = response.data.user;
        image.value = response.data.image;
    }catch(err){
        console.log('69 - ', err);
    }
});
</script>

<template>     
    <section id="con">
        <div id="close">
            <div  @click="closeModal">
                <div class="pi pi-times"></div>
            </div>
        </div>
        <main>
            <div @click="profileSettings" id="prof" >
                <div id="profile">
                    <img :src="image" alt="">
                </div>
                <div id="profile-deatails">
                    <h3 :title="name">{{ user.name }}</h3>
                    <h4 :title="username">{{ user.username }}</h4>
                </div>
            </div>
            <form @submit.prevent="formSubmit">
                <div>
                    <label for="">Name: {{ user.name }}</label>
                    <input type="text" name="" id="" v-model="user.name">
                </div>
                <div>
                    <label for="">Name: {{ user.username }}</label>
                    <input type="text" name="" id="" v-model="user.username">
                </div>
                <div>
                    <label for="">Name: {{ user.password }}</label>
                    <input type="text" name="" id="" v-model="user.password">
                </div>
                <div>
                    <button type="submit">Edit</button>
                </div>
            </form>
            <div>
                <!-- <img :src="image" alt=""> -->
            </div>
        </main>
        <decisionModal 
            v-if="useModalLib.decisionModalToggle" 
                :sign="useModalLib.modalMessage.sign" 
                :message="useModalLib.modalMessage.message"  
                :action="useModalLib.modalMessage.action" 
                :action1="useModalLib.modalMessage.action1" 
                :action2="useModalLib.modalMessage.action2"
                @decision="handleDecision">
        </decisionModal>
    </section>
</template>

<style scoped>
form{
    display: flex;
    flex-direction: column;

    >div{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.3rem;

        >label{
            width: 100%;
        }
        >input{
            width: 100%;
            height: 1.7rem;
            font-size: 11pt;
            background-color: var(--glass-bg-soft);
            border-radius: 2px;
            padding: 0 0.3rem;
            border: none;
            outline: none;
        }
    }
    >div:last-child{
        margin-top: 1rem;
        margin-left: auto;
        >button{
            background-color: var(--glass-bg-soft);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            padding: 0.2rem 0.6rem;
            color: var(--glass-bg-hard);
            font-family: var(--text-fam);
            text-align: center;
            &:focus{
                outline: none;
                border: 1px solid rgba(255, 255, 255, 0.6)
            }
            &:hover{
                background-color: var(--glass-bg-hard);
                color: var(--glass-bg-soft);
                cursor: pointer;
            }
            &:active{
                background-color: var(--glass-bg-);
                color: var(--glass-bg-soft);
            }
        }
    }
}


#close{
    position: relative;
    background-color: rgba(255, 255, 255, 0.268);
    z-index: 200;
    >div{
        position: absolute;
        border: 3px solid rgb(54, 47, 47);
        border-radius: 50%;
        /* background-color: rgba(255, 255, 255, 0.268); */
        
        
        top: 0;
        right: 0;
        
        height: 2rem;
        aspect-ratio: 1/1;

        display: grid;
        place-content: center;
        >div{
            font-size: 13pt;
        }
        
        &:hover{
            cursor: pointer;
            /* background-color: rgba(255, 255, 255, 0.034); */
            background-color: white;
            color: black;
            &:active{
                background-color: rgba(255, 255, 255, 0.719);
                color: black
            }
        }
    }
}
#profile-deatails{
    overflow: hidden;
    white-space: nowrap;
    >h3,>h4{
        width: fit-content;
        text-overflow: clip;
    }
    >h3:hover,>h4:hover{
        cursor: pointer;
    }
    >h3{
        font-family: var(--big-text-fam);
        font-weight: calc(var(--normal-font-weight) * 1.5);
    }
    >h4{
        font-family: var(--text-fam);
        font-weight: var(--normal-font-weight);
    }
}
#prof{
    position: relative;
    background-color: rgba(255,255,255, 0);
    z-index: 1;
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    
    >#profile{
        --prof-width: 4rem;
        aspect-ratio: 1/1;

        margin-top: auto;
        margin-bottom: auto;
        margin-left: 0;
        margin-right: 0;

        >img{   
            background-position: center;
            background-size: cover;
            width: var(--prof-width);
            object-fit: cover;
            border-radius: 50%;
            aspect-ratio: 1/1;
        }
    }

}

#con{
    position: absolute;
    /* border: 1ps solid black; */

    height: 110dvh;
    width: 20rem;

    top: -1%;
    left: -1%;
    z-index: 100;
}

</style>