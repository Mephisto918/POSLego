<script setup>
import { computed, defineProps, onMounted, ref, watch } from 'vue';
import { apiStore } from '@/stores/api';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import axios from 'axios';
import decisionModal from '../decisionModal.vue';
import { modalLib } from '@/stores/modalLogics';
const useModalLib = modalLib();
import { utilLib } from '@/stores/utils';
const utils = utilLib();

function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}

defineProps({
    modelValue: {
    type: Boolean,
    }
})

const emit = defineEmits(['closeModal', 'update:modelValue']);

const toast = useToast();
const hasChanges = ref(true);
const selectedProduct = ref("");
const selectedProductType = ref(false);
const product = ref({});
let image;
async function getProduct(){
    const id = selectedProduct.value.id;
    const type = selectedProduct.value.type;
    selectedProductType.value = type == 'set'? true : false;
    try {
        const response = await axios.get(apiStore().api+`products/${id}/${type}`);
        product.value = response.data.product;
        image = response.data.image;
    } catch (error) {
        product.value = error.response.data.product;
        image = error.response.data.image
        console.log('50 -', error);
    }
}

const productsNameList = ref([]);

async function getProductsList(){
    try{
        const response = await axios.get(apiStore().api+'products/all');
        productsNameList.value = response.data.filter((product) => product.quantity <= 0);
    }catch(error){
        console.log('54 -', error);
    }
}

const isSetId = computed(() => {
    return product.value.brickId || product.value.setId || '';
})
const isSetName = computed(() => {
    return product.value.brickName || product.value.setName || '';
})

const closeModal = async()=>{
    if(!hasChanges.value){
        useModalLib.modalMessage.sign = "pi pi-exclamation-triangle" // look for icon in primeicon website
        useModalLib.modalMessage.message = "Are you sure you want to exit? Form data wont be saved!"
        useModalLib.modalMessage.action = "Caution!"
        useModalLib.modalMessage.action1 = "Cancel" //false
        useModalLib.modalMessage.action2 = "Confirm" //true

        const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
        if(boolDecision){
            emit('closeModal');
            return emit('update:modelValue', false);
        }else{

        }
    }else{
        emit('closeModal');
        return emit('update:modelValue', false);
    }
}

const addProductStock = async ()=>{
    try{
        const { quantity, expiryDate, type } = product.value;
        const id = isSetId.value
        const name = isSetName.value
        const dateAdded = utils.currentDate();
        const payload = {id, type, name, quantity, expiryDate, dateAdded};

        //to pass message to the modal use this
        useModalLib.modalMessage.sign = "pi pi-question-circle" // look for icon in primeicon website
        useModalLib.modalMessage.message = "Are you sure you want to add this stock?"
        useModalLib.modalMessage.action = "Add Stock"
        useModalLib.modalMessage.action1 = "No" //false
        useModalLib.modalMessage.action2 = "Yes" //true

        const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
        if(boolDecision){
            const response = await axios.post(apiStore().api+'stocks/add', payload);
            if(response.status == 201){
                    toast.success('Product Successfully Added', {
                        duration: 3000,
                        close: true,
                        position: "top-right",
                    });
            }
            emit('closeModal');
            return emit('update:modelValue', false);
        }
    }catch(error){
        console.log('105 - ', error);
        if(axios.isAxiosError(error)){
            const { response, request, message, config, status } = error;

            if(status == '409'){
                return toast.error('Product already exist!', {
                    duration: 3000,
                    close: true,
                    position: "top-right",
                }); 
            }else if(status >= 500){
                return toast.error('Unexpected Error!', {
                    duration: 3000,
                    close: true,
                    position: "top-right",
                }); 
            }

            // Optionally log or handle config
            // console.log('Request Config:', config);
        }else {
            // Handle non-Axios errors
            console.error('Unexpected Error:', error);
            toast.error('Unexpected Error', {
                    duration: 3000,
                    close: true,
                    position: "top-right",
            }); 
        }
    }
}

onMounted(()=>{
    getProductsList();
})

watch(selectedProduct, (newValue, oldValue) => {
    if(!(newValue != oldValue)){
        hasChanges.value = true;
    }else{
        hasChanges.value = false;
    }
});
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
            <div id="con">
                <div>
                    <div><button @click="closeModal"><i class="pi pi-times-circle"></i></button></div>
                    <main>
                        <div>
                            <h1>Add Stock</h1>
                        </div>
                        <form @submit.prevent="addProductStock">
                            <div>
                                <label for="">Product Name:</label>
                                <select name="selectedItem" v-model="selectedProduct" @change="getProduct">
                                    <option :value="product" v-for="(product, index) in productsNameList" :key="index">
                                        {{ product.type }} - {{ product.name }}
                                    </option>
                                </select>
                            </div> 
                            <div>
                                <label for="">Expiry Date:</label>
                                <input type="date" required v-model="product.expiryDate">
                            </div>
                            <div>
                                <label for="">Quantity:</label>
                                <input type="number" required max="999" min="0" placeholder="0" step="1" v-model="product.quantity">
                            </div>
                            <div>
                                <label for="">Name:</label>
                                <input type="text" name="" id="" maxlength="50" required readonly v-model="isSetName">
                            </div>
                            <div v-if="selectedProductType">
                                <fieldset>
                                    <legend>Info: </legend>
                                    <div>
                                        <label for="">ID:</label>
                                        <input readonly  v-model="isSetId">
                                    </div>
                                    <div>
                                        <label for="">Theme:</label>
                                        <input type="text" name="" id="" readonly v-model="product.theme">
                                    </div>
                                    <div>
                                        <label for="">Pieces:</label>
                                        <input type="text" name="" id="" readonly v-model="product.pieces">
                                    </div>
                                    <div>
                                        <label for="">Type:</label>
                                        <input type="text" name="" id="" readonly v-model="product.type">
                                    </div>
                                </fieldset>
                            </div>
                            <div v-else>
                                <fieldset>
                                    <legend>Info:</legend>
                                    <div>
                                        <label for="">ID:</label>
                                        <input readonly v-model="isSetId">
                                    </div>
                                    <div>
                                        <label for="">Design:</label>
                                        <input type="text" name="" id="" readonly v-model="product.design">
                                    </div>
                                    <div>
                                        <label for="">Category:</label>
                                        <input type="text" name="" id="" readonly v-model="product.category">
                                    </div>
                                    <div>
                                        <label for="">Type:</label>
                                        <input type="text" name="" id="" readonly v-model="product.type">
                                    </div>
                                </fieldset>
                            </div>
                            <div class="image">
                                <img v-if="image" :src="image" alt="Product Image">
                                <img v-else alt="No Image">
                            </div>
                            <div class="desc" v-if="selectedProductType">
                                <label for="">Description: </label>
                                <textarea name="" rows="4" cols="5" readonly v-model="product.setDescription"></textarea>
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
/* addProduct.vue */

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
                    "a a a f f f f"
                    "b b . f f f f"
                    "c c . f f f f"
                    "e e e d d d d"
                    "e e e g g g g"
                    "e e e g g g g"
                    "e e e . . h h"
                ;
                gap: 1rem;

                >div:nth-child(1){
                    grid-area: a;
                }
                >div:nth-child(2){
                    grid-area: b;
                }
                >div:nth-child(3){
                    grid-area: c;
                }
                >div:nth-child(4){
                    grid-area: d;
                }
                >div:nth-child(5){
                    grid-area: e;
                    >fieldset{
                        height: 100%;
                        justify-content: stretch;
                        display: flex;
                        flex-direction: column;
                        border: none;

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
                    }
                }
                >.image{
                    /* border: 1px solid white; */
                    border-radius: 10px;
                    grid-area: f; 
                    
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
                        margin-right: auto;
                    }
                }
                >.desc{
                    grid-area: g;
                    >textarea{
                        background-color: var(--glass-bg-soft);
                        height: 100%;
                        outline: none;
                        padding: 0.3rem;
                        &:focus{
                            outline: none;
                            border: 1px solid rgba(255, 255, 255, 0.6)
                        }  
                    }
                }
                >div:last-child{
                    grid-area: h;

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