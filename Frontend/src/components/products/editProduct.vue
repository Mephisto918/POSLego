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
    type: {
        type: String
    }
})
const toast = useToast();
const dataReady = ref(false);
const productFromDb = ref({});
const product = ref();
const oldStateProduct = ref();
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
            emit('update:modelValue', false);
        }
    }else{
        emit('closeModal');
        emit('update:modelValue', false);
    }
}

function hasChanges(){
    if((lodash.isEqual(product.value, oldStateProduct.value)) && (lodash.isEqual(image.value, oldStateImage.value))){
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

const editProduct = async ()=>{
    try{
        hasChanges();
        useModalLib.modalMessage.sign = "pi pi-save"
        useModalLib.modalMessage.message = "Are you sure you about the changes?"
        useModalLib.modalMessage.action = "Alert!"
        useModalLib.modalMessage.action1 = "Cancel" 
        useModalLib.modalMessage.action2 = "Confirm"
        const editDecision =  await useModalLib.showDecisionModal();
        if(editDecision){
            const currentImage = oldStateImage.value != image.value ? image.value : oldStateImage.value;
            image.value = currentImage;
            const response = await axios.put(apiStore().api+`products/edit/${props.id}`,{ product: product.value, image: image.value});
            toast.success('Product Successfully Edited', {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            emit('closeModal');
            return emit('update:modelValue', false); 
        }        
    }catch(error){
        console.log('91 - ', error);
        toast.error('Error Saving Changes', {
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
        const response = await axios.get(apiStore().api+`products/${props.id}/${props.type}`);
        if(response.status == '200'){
            Object.assign(productFromDb.value, response.data);
            product.value = productFromDb.value.product;
            oldStateProduct.value = lodash.cloneDeep(productFromDb.value.product);
            image.value = productFromDb.value.image;
            oldStateImage.value = lodash.cloneDeep(productFromDb.value.image);

            
            if ((product.value && image.value)) {
                return dataReady.value = true; // Set dataReady only after successful fetch
            }
        }
    }catch(error){
        if(error.response.status){
            const response = error.response // nigga what?
            Object.assign(productFromDb.value, response.data);
            product.value = productFromDb.value.product;
            oldStateProduct.value = lodash.cloneDeep(productFromDb.value.product);
            image.value = productFromDb.value.image;
            oldStateImage.value = lodash.cloneDeep(productFromDb.value.image);

            
            if ((product.value)) {
                return dataReady.value = true; // Set dataReady only after successful fetch
            }
        }
        console.log('135 - ', error);
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
                <div v-if="(props.type == 'brick')">
                    <div><button @click="closeModal"><i class="pi pi-times-circle"></i></button></div>
                    <main>
                        <div>
                        <h1>Edit Product</h1>
                        </div>
                        <form @submit.prevent="editProduct">
                            <div>
                                <label for="">ID:</label>
                                <input type="text" name="productId" id="productId" maxlength="50" required v-model="product.brickId">
                            </div> 
                            <div>
                                <label for="">Name:</label>
                                <input type="text" name="" id="" maxlength="50" required v-model="product.brickName">
                            </div>
                            <div>
                                <label for="">Item Price:</label>
                                <input type="number" name="" id="" step="0.01" max="99999999.99" required v-model="product.brickPrice">
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Misc</legend>
                                    <div>
                                        <label for="">Design:</label>
                                        <input type="number" name="" inputmode="numeric" max="15" v-model="product.design">
                                    </div>
                                    <div>
                                        <label for="">Category:</label>
                                        <input type="text" name="" id="" maxlength="250" v-model="product.category">
                                    </div>
                                    <div>
                                        <label for="">Type:</label>
                                        <input type="text" name="" id="" readonly v-model="product.type">
                                    </div>
                                </fieldset>
                            </div>
                            <div class="image">
                                <div>
                                    <label for="imageUpload">Image </label>
                                 <input type="file" id="imageUpload" @change="handleImageUpload">
                                </div>
                                <img :src="image? image : 'No Image'" v-if="image" alt="Product Image">
                                <img v-else alt="No Image">
                            </div>
                            <div>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </main>
                </div>
                <div v-else>
                    <div><button @click="closeModal"><i class="pi pi-times-circle"></i></button></div>
                    <main>
                        <div>
                        <h1>Edit Product</h1>
                        </div>
                        <form @submit.prevent="editProduct">
                            <div>
                                <label for="">ID:</label>
                                <input type="text" name="productId"  maxlength="50" id="productId" required v-model="product.setId">
                            </div> 
                            <div>
                                <label for="">Name:</label>
                                <input type="text" name="" id="" maxlength="50" required v-model="product.setName">
                            </div>
                            <div>
                                <label for="">Item Price:</label>
                                <input type="number" min="0" max="99999999.99" step="0.01" required v-model="product.setPrice">
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Misc</legend>
                                    <div>
                                        <label for="">Theme:</label>
                                        <input type="text" name="" id="" maxlength="50" v-model="product.theme">
                                    </div>
                                    <div>
                                        <label for="">Pieces:</label>
                                        <input type="number" inputmode="numeric" max="99999999.99" name="" id="" v-model="product.pieces">
                                    </div>
                                    <div>
                                        <label for="">Year Release:</label>
                                        <input type="number" inputmode="numeric" max="99999999.99" name="" id="" v-model="product.yr_release">
                                    </div>
                                    <div>
                                        <label for="">Type:</label>
                                        <input type="text" name="" id="" readonly v-model="product.type">
                                    </div>
                                </fieldset>
                            </div>
                            <div class="image">
                                <div>
                                    <label for="imageUpload">Image </label>
                                 <input type="file" id="imageUpload" @change="handleImageUpload">
                                </div>
                                <img :src="image? image : 'No Image'" v-if="image" alt="Product Image">
                                <img v-else alt="No Image">
                            </div>
                            <div class="desc">
                                <label for="">Description: </label>
                                <textarea name="" rows="4" cols="5" id="" maxlength="255" required v-model="product.setDescription"></textarea>
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
/* editProduct.vue */

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
                gap: 1rem;
                >div:nth-child(1){
                    grid-row-start: 1; /* 1 */
                    grid-row-end: 1; /* 1 */
                    grid-column-start: 1; /* 1 */
                    grid-column-end: 4; /* 1 */
                }
                >div:nth-child(2){
                    grid-row-start: 2; /* 0 */
                    grid-row-end: 2; /* 0 */
                    grid-column-start: 1; /* 1 */
                    grid-column-end: 4; /* 1 */
                }
                >div:nth-child(3){
                    grid-row-start: 3; /* 0 */
                    grid-row-end: 3; /* 0 */
                    grid-column-start: 1; /* 1 */
                    grid-column-end: 4; /* 1 */
                }
                >div:nth-child(4){
                    grid-row-start: 4; /* 4 */
                    grid-row-end: 7; /* 4 */
                    grid-column-start: 1; /* 1 */
                    grid-column-end: 4; /* 2 */
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
                    grid-row-start: 1; /* 1 */
                    grid-row-end: 4; /* 3 */
                    grid-column-start: 4; /* 2 */
                    grid-column-end: 8; /* 2 */
                    
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
                >.desc{
                    grid-row-start: 4; /* 1 */
                    grid-row-end: 7; /* 3 */
                    grid-column-start: 4; /* 2 */
                    grid-column-end: 8; /* 2 */
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
                    grid-row-start: 7; /* 4 */
                    grid-row-end: 7; /* 5 */
                    grid-column-start: 6; /* 2 */
                    grid-column-end: 8; /* 2 */

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