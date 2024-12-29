<script setup>
import { ref, watch, computed } from 'vue';
import { apiStore } from '@/stores/api';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { onMounted } from 'vue';
import decisionModal from '../decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
const useModalLib = modalLib();

defineProps({
    modelValue: {
    type: Boolean,
    }
})

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
            emit('update:modelValue', false);
        }else{

        }
    }else{
        emit('closeModal');
        emit('update:modelValue', false);
    }
}
const toast = useToast();
const hasChanges = ref(true);
const setArry = ref([]);
const productType = ref('set');
const product = ref({});
const brick = ref({
    id: '',
    name: '',
    price: '',
    design: '',
    category: '',
    type: computed(()=> productType.value),
});
const set = ref({
    id: '',
    name: '',
    description: '',
    price: '',
    theme: '',
    pieces: '',
    yr_release: '',
    type: computed(()=>productType.value),
});
const image = ref();
const productData = ref({});

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
function handleDecision(decision){   // for the emmiter
    modalLib().userDecision(decision);
}


const addProduct = async ()=>{
    try{
        useModalLib.modalMessage.sign = "pi pi-exclamation-triangle" // look for icon in primeicon website
        useModalLib.modalMessage.message = "Are you sure you want to add this product?"
        useModalLib.modalMessage.action = "Caution!"
        useModalLib.modalMessage.action1 = "Cancel" //false
        useModalLib.modalMessage.action2 = "Confirm" //true

        const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
        if(boolDecision){
            if(productType.value == 'set'){
                product.value = {...set.value};
                productData.value = {...product.value, image: image.value ? image.value : 'none'};
                const response = await axios.post(apiStore().api+'products/add', productData.value);
                if(response.status == 201){
                    toast.success('Product Successfully Added', {
                        duration: 3000,
                        close: true,
                        position: "top-right",
                    });
                }
                emit('closeModal');
                return emit('update:modelValue', false);
            }else if(productType.value == 'brick'){
                product.value = {...brick.value};
                productData.value = {...product.value, image: image.value ? image.value : 'none'};
                const response = await axios.post(apiStore().api+'products/add', productData.value);
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
        }
    }catch(error){
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

onMounted(async()=>{
    try{
        const response = await axios.get(apiStore().api+'products/all');
        const res = response.data;
        setArry.value.push(...res.filter(item => item.type === 'set'));
    }catch(error){
        console.log('error 116', error);
    }
})

watch(set, (newVal, oldVal)=>{
    if(!newVal.id && !newVal.name && !newVal.description && !newVal.price && !newVal.theme && !newVal.pieces && !newVal.yr_release){
        hasChanges.value = true;
    }else{
        hasChanges.value = false;
    }
}, {deep: true})
watch(brick, (newVal, oldVal)=>{
    if(!newVal.id && !newVal.name && !newVal.price && !newVal.design && !newVal.category){
        hasChanges.value = true;
    }else{
        hasChanges.value = false;
    }
}, {deep: true})
</script>
        
<template>
    <Teleport to="body">
        <decisionModal 
            v-if="useModalLib.decisionModalToggle" 
                :sign="useModalLib.modalMessage.sign" 
                :message="useModalLib.modalMessage.message"  
                :action="useModalLib.modalMessage.action" 
                :action1="useModalLib.modalMessage.action1" 
                :action2="useModalLib.modalMessage.action2"
                @decision="handleDecision">
        </decisionModal>
        <div v-auto-animate>
            <div id="con">
                <div>
                    <div><button @click="closeModal"><i class="pi pi-times-circle"></i></button></div>
                    <main>
                        <div>
                            <h1>Add Product</h1>
                        </div>
                        <div>
                            <label for="">Product Type: </label>
                            <select name="" id="" v-model="productType">
                                <option value="set">Set</option>
                                <option value="brick">Brick</option>
                            </select>
                        </div>
                        <form v-if="productType == 'brick'" @submit.prevent="addProduct" class="form">
                            <div>
                                <label for="">ID:</label>
                                <input type="text" name="productId" maxlength="50" id="productId" required v-model="brick.id">
                            </div> 
                            <div>
                                <label for="">Name:</label>
                                <input type="text" name="" id="" maxlength="50" required v-model="brick.name">
                            </div>
                            <div>
                                <label for="">Item Price:</label>
                                <input type="number" name="" id="" step="0.01" max="99999999.99" required v-model="brick.price">
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Misc</legend>
                                    <div>
                                        <label for="">Design:</label>
                                        <input type="number" inputmode="numeric" maxlength="15" id="" v-model="brick.design">
                                    </div>
                                    <div>
                                        <label for="">Category:</label>
                                        <input type="text" name="" id="" maxlength="250" v-model="brick.category">
                                    </div>
                                    <div>
                                        <label for="">Type: </label>
                                        <input type="text" name="" id="" class="no" v-model="brick.type" readonly>
                                    </div>
                                </fieldset>
                            </div>
                            <div class="image">
                                <div>
                                    <label for="imageUpload">Image </label>
                                 <input type="file" id="imageUpload" @change="handleImageUpload">
                                </div>
                                <img :src="image" alt="Product Image">
                            </div>
                            <div class="another">
                                <label for="">Lego Set Model: </label>
                                <select name="" v-model="brick.setModel" required>
                                    <option v-for="set in setArry" :value="set.id" :key="set.id">
                                        {{set.name}}
                                    </option>
                                    <option value="none">None</option>
                                </select>
                                
                            </div>
                            <div>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                        <form v-else-if="productType == 'set'" @submit.prevent="addProduct" class="form">
                            <div>
                                <label for="">ID:</label>
                                <input type="text" name="productId" id="productId" maxlength="50" required v-model="set.id">
                            </div> 
                            <div>
                                <label for="">Name:</label>
                                <input type="text" name="" id="" maxlength="50" required v-model="set.name">
                            </div>
                            <div>
                                <label for="">Item Price:</label>
                                <input type="number" min="0" step="0.01" max="99999999.99" required v-model="set.price">
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Misc</legend>
                                    <div>
                                        <label for="">Theme:</label>
                                        <input type="text" name="" id="" maxlength="50" v-model="set.theme">
                                    </div>
                                    <div>
                                        <label for="">Pieces:</label>
                                        <input type="number" inputmode="numeric" name="" max="99999999.99" id="" v-model="set.pieces">
                                    </div>
                                    <div>
                                        <label for="">Year Release:</label>
                                        <input type="number" inputmode="numeric" name="" max="99999999.99" id="" v-model="set.yr_release">
                                    </div>
                                    <div>
                                        <label for="">Type: </label>
                                        <input type="text" name="" id="" class="no" v-model="set.type" readonly>
                                    </div>
                                </fieldset>
                            </div>
                            <div class="image">
                                <div>
                                    <label for="imageUpload">Image </label>
                                 <input type="file" id="imageUpload" @change="handleImageUpload">
                                </div>
                                <img :src="image" alt="Product Image">
                            </div>
                            <div class="desc">
                                <label for="">Description: </label>
                                <textarea name="" rows="4" cols="5" id="" required v-model="set.description"></textarea>
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
            >div:nth-child(2){
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                padding: 0.4rem 0;
                /* border: 1px solid red; */ /* DEBUG */
            }
        }
    }
}

.form{
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
            object-fit: contain;
            width: 100%;
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
    >.another{
        grid-row-start: 4; /* 1 */
        grid-row-end: 7; /* 3 */
        grid-column-start: 4; /* 2 */
        grid-column-end: 8; /* 2 */
        >select{
            border-radius: 5px;
            padding: 0.3rem 0.5rem;
            >option{
                border-radius: 5px;
                font-size: 11pt;
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

</style>