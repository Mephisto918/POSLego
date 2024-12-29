<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { apiStore } from '@/stores/api';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import axios from 'axios';
import decisionModal from '../decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
const useModalLib = modalLib();

function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}
const props = defineProps({
    modelValue: {
        type: Boolean,
    },
    product: {
        type: Object
    },
    name:{
        type: String
    }
})

const toast = useToast();
const hasChanges = ref(true);
const product = ref({});
let image;
const render = ref(false);

const passedProduct = ref(props.product);

const emit = defineEmits(['closeModal', 'update:modelValue']);
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

const isSetId = computed(() => {
    return product.value.brickId || product.value.setId || '';
})
const isSetName = computed(() => {
    return product.value.brickName || product.value.setName || '';
})

const editProductStocks = async ()=>{
    try{
        const { stockId, quantity, name, type, addedDateFormated:{ date: aDate, time: aTime}, expiryDateFormated:{ date: eDate, time: eTime} } = product.value;
        const id = isSetId.value
        const newAddedDate = `${aDate}T${aTime}Z`;
        const newExpiryDate = `${eDate}T${eTime}Z`;
        const payload = {stockId, id, type, name, quantity, newAddedDate, newExpiryDate};

        //to pass message to the modal use this
        useModalLib.modalMessage.sign = "pi pi-question-circle" // look for icon in primeicon website
        useModalLib.modalMessage.message = "Are you sure about this changes?"
        useModalLib.modalMessage.action = "Save Changes"
        useModalLib.modalMessage.action1 = "No" //false
        useModalLib.modalMessage.action2 = "Yes" //true

        const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
        if(boolDecision){
            const response = await axios.put(apiStore().api+`stocks/edit/${stockId}`, payload);
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

onMounted(async () => {
    let firstResponseData = null;
    try{
        const response = await axios.get(apiStore().api+`stocks/${props.product.stockId}`);
        product.value = response.data[0];
        firstResponseData = response.data[0];
        const { id, type } = product.value;
        const getImage = await axios.get(apiStore().api+`products/${id}/${type}`);
        image = getImage.data.image;
        if(image && product.value){
            render.value = true;
        }
    }catch(error){
        console.log('122 - ', error);
        product.value = firstResponseData;
        image = null;
        if(product.value){
            render.value = true;
        }
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
            <div id="con">
                <div>
                    <div><button @click="closeModal"><i class="pi pi-times-circle"></i></button></div>
                    <main v-if="render">
                        <div>
                            <h1>Edit Stock</h1>
                        </div>
                        <form @submit.prevent="editProductStocks">
                            <div>
                                <label for="">Date Added</label>
                                <div>
                                    <label for="">Date:</label>
                                    <input type="date" required v-model="product.addedDateFormated.date">
                                </div>
                                <div>
                                    <label for="">Time:</label>
                                    <input type="time" required v-model="product.addedDateFormated.time">
                                </div>
                            </div> 
                            <div>
                                <label for="">Expiry Date</label>
                                <div>
                                    <label for="">Date:</label>
                                    <input type="date" required v-model="product.expiryDateFormated.date">
                                </div>
                                <div>
                                    <label for="">Date:</label>
                                    <input type="time" required v-model="product.expiryDateFormated.time">
                                </div>
                            </div>
                            <div>
                                <label for="">Quantity:</label>
                                <input type="number" required max="999" min="0" placeholder="0" step="1" v-model="product.quantity">
                            </div>
                            <div>
                                <label for="">Name:</label>
                                <input type="text" name="" id="" maxlength="50" readonly v-model="props.name">
                            </div>
                            <div>
                                <label for="">ID:</label>
                                <input type="text" name="" id="" maxlength="50" readonly v-model="product.id">
                            </div>
                            <!-- <div>
                                <h1>free space</h1>
                            </div> -->
                            <div class="image">
                                <img v-if="image" :src="image" alt="Product Image">
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
                grid-template-rows: repeat(6, var(--rows-size));
                grid-template-areas: 
                    "a a a f f f f"
                    "a a a f f f f"
                    "b b b f f f f"
                    "b b b d d d d"
                    "c c c e e e e"
                    ". . . . . h h"
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
                >div:nth-child(1),
                div:nth-child(2){
                    gap: 0.2rem;
                    >div{
                        padding: 0 0 0 1rem;
                        /* background-color: var(--debug-red); */
                        display: flex;
                        flex-direction: column;
                    }
                }

            }
        }
    }
}
</style>