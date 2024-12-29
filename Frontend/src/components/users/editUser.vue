<script setup>
import { onMounted, ref, watch, toRaw } from 'vue';
import { apiStore } from '@/stores/api';
import axios from 'axios';
import decisionModal from '../decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import lodash from 'lodash';
const useModalLib = modalLib();


const props = defineProps({
    modelValue: {
        type: Boolean,
    },
    id: {
        type: String
    },
})
const toast = useToast();
const dataReady = ref(false);
const userFromDb = ref({});
const user = ref();
const oldStateUser = ref();
const image = ref();
const oldStateImage = ref();


const hasProgress = ref(false);

const emit = defineEmits(['closeModal', 'update:modelValue']);
const closeModal = async()=>{
    hasChanges();
    if(!hasProgress.value){
        useModalLib.modalMessage.sign = "pi pi-exclamation-circle"
        useModalLib.modalMessage.message = "Are you sure you want exit? Changes cant be saved!"
        useModalLib.modalMessage.action = "Caution!"
        useModalLib.modalMessage.action1 = "Cancel" 
        useModalLib.modalMessage.action2 = "Confirm"
        const boolDecision = await useModalLib.showDecisionModal();
        if(boolDecision){
            emit('closeModal');
            return emit('update:modelValue', false);
        }
    }else{
        emit('closeModal');
        return emit('update:modelValue', false);
    }
}

function hasChanges(){
    if((lodash.isEqual(user.value, oldStateUser.value)) && (lodash.isEqual(image.value, oldStateImage.value))){
        hasProgress.value = true;
        return true;
    }else{
        hasProgress.value = false;
        return false;
    }
}

function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}

const editUser = async ()=>{
    try{
        hasChanges();
        useModalLib.modalMessage.sign = "pi pi-save"
        useModalLib.modalMessage.message = "Are you sure you about the changes?"
        useModalLib.modalMessage.action = "Alert!"
        useModalLib.modalMessage.action1 = "Cancel" 
        useModalLib.modalMessage.action2 = "Confirm"
        const editDecision =  await useModalLib.showDecisionModal();
        if(editDecision){
            const response = await axios.put(apiStore().api+`users/edit/${props.id}`, {user: user.value, image: image.value});
            toast.success('Edit Saved', {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            emit('closeModal');
            emit('update:modelValue', false);
            return;
        }        
    }catch(error){
        console.log('87 - ', error);
        toast.error('Something Went Wrong!', {
            duration: 3000,
            close: true,
            position: "top-right",
        });
    }
}

async function handleImageUpload(e){
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = (e) =>{
            image.value = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

onMounted(async ()=>{
    try{
        const response = await axios.get(apiStore().api+`users/${props.id}`);
        if(response.status == '200'){
            Object.assign(userFromDb.value, response.data);
            user.value = userFromDb.value.user;
            oldStateUser.value = lodash.cloneDeep(userFromDb.value.user);
            image.value = userFromDb.value.image;
            oldStateImage.value = lodash.cloneDeep(userFromDb.value.image);
            
            if ((user.value && image.value)) {
                dataReady.value = true; // Set dataReady only after successful fetch
            }
        }
    }catch(error){
        if(error.response.status){
            const response = error.response
            Object.assign(userFromDb.value, response.data);
            user.value = userFromDb.value.user;
            oldStateUser.value = lodash.cloneDeep(userFromDb.value.user);
            image.value = userFromDb.value.image;
            oldStateImage.value = lodash.cloneDeep(userFromDb.value.image);
            
            if ((user.value)) {
                dataReady.value = true; // Set dataReady only after successful fetch
            }
        }
        console.log('error 132', error);
    }
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
    <Teleport to="body">
        <div>
            <div id="con" v-if="dataReady">
                <div>
                    <div><button @click="closeModal"><i class="pi pi-times-circle"></i></button></div>
                    <main>
                        <div>
                        <h1>Edit User</h1>
                        </div>
                        <form @submit.prevent="editUser">
                            <div>
                                <label for="">ID:</label>
                                <input type="text" readonly required v-model="user.id">
                            </div> 
                            <div>
                                <label for="">Name:</label>
                                <input type="text" name="" id="" required v-model="user.name">
                            </div>
                            <div>
                                <label for="">Username:</label>
                                <input type="text" name="" id="" required v-model="user.username">
                            </div>
                            <div class="image">
                                <div>
                                    <label for="imageUpload">Image </label>
                                 <input type="file" id="imageUpload" @change="handleImageUpload">
                                </div>
                                <img :src="image? image : 'No Image'" v-if="image" alt="User Image">
                                <img v-else alt="No Image">
                            </div>
                            <div>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
/* editUser.vue */

#con{
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 100%;
    height: 100%;
    z-index: 99;
    color: white;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >div{
        background-color: rgba(255, 255, 255, 0.2);
        max-width: 75dvw;
        min-width: 25rem;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        position: relative;

        overflow: hidden;
        border-radius: 10px 10px 0 0;
        >div{
            >button{
                position: absolute;
                top: 10px;
                right: 10px;

                --width: 1.5rem;
                width: var(--width);
                aspect-ratio: 1/1;

                border-radius: 50%;

                overflow: hidden;

                display: flex;
                justify-content: center;
                align-items: center;
                >i{
                    background-color: var(--glass-bg-hard);
                    font-size: calc(var(--width) * 0.9);
                    aspect-ratio: 1/1;
                }
                &:hover{
                    cursor: pointer;
                }
                &:active{
                    >i{
                        background-color: var(--glass-bg-soft);
                        color: var(--glass-bg-hard);
                        font-size: calc(var(--width) * 0.9);
                        aspect-ratio: 1/1;
                    }
                }
            }
        }

        >main{
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;

            background-color: var(--glass-bg-hard);
            width: 100%;
            height: fit-content;

            >div{
                width: 100%;
                text-align: center;
                background-color: var(--glass-bg-soft-trans);
            }
            >form{
                background-color: var(--glass-bg-hard-soft);
                z-index: 100;
                padding: 1rem;

                width: 100%;
                height: fit-content;

                --rows-size: 3.2rem;
                display: grid;
                grid-template-columns: repeat(7, 5rem);
                grid-template-rows: repeat(7, var(--rows-size));
                grid-template-areas: 
                    ". a a a a a ." /*1*/
                    "b b d d d d d" /*2*/
                    "c c d d d d d" /*3*/
                    ". . d d d d d" /*4*/
                    ". . . . . . ." /*5*/
                    ". . . . . . ." /*6*/
                    ". . . . . e e" /*7*/
                ;
                gap: 1rem;
                /* grid-area: row-start / column-start / row-end / column-end; */
                >div:nth-child(1){
                    grid-area: a;
                    >input{
                        cursor: not-allowed;
                        text-align: center;
                    }
                }
                >div:nth-child(2){
                    grid-area: b;
                }
                >div:nth-child(3){
                    grid-area: c;
                }
                >.image{
                    grid-area: d;
                    display: flex;
                    flex-direction: row;
                    >div{
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        width: 100px;
                    }
                    >img{
                        margin-left: auto;
                        border-radius: 10px;
                    }
                }
                >div:last-child{
                    grid-area: e;

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
                >div{
                    display: flex;
                    flex-direction: column;
                    /* padding: 0.5rem 1rem; */
                    >input{
                        background-color: var(--glass-bg-soft);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 5px;
                        padding: 0.2rem 0.6rem;
                        color: var(--glass-bg-hard);
                        font-family: var(--text-fam);
                        height: 100%;
                        &:focus{
                            outline: none;
                            border: 1px solid rgba(255, 255, 255, 0.6)
                        }   
                        &:invalid{
                            color: red;
                        }
                    }
                }
            }
        }
    }
}

</style>