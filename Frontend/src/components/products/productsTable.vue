<script setup>
import axios from 'axios';
import { onMounted, ref, watch} from 'vue';
import { apiStore} from '@/stores/api';
import decisionModal from '../decisionModal.vue';
import { modalLib} from '@/stores/modalLogics';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import addProduct from './addProduct.vue';
import editProduct from './editProduct.vue';

const toast = useToast();
let products = ref([]);
let modalAddProductToggle = ref(false);
let modalEditProductToggle = ref(false);
const searchQuery = ref('');
const useModalLib = modalLib();
const selectedProductId = ref(null);
const selectedProductType = ref(null);


const fetchData = async () => {
    try{
        const response = await axios.get(apiStore().api+'products/all', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        products.value = response.data;
    }catch(error){
        console.log('error daw', error);
    }
}


async function SearchProduct() {
    try{
        if(searchQuery.value == ''){return fetchData()};
        const response = await axios.post(apiStore().api+'products/search', { "search" : searchQuery.value});
        products.value = response.data;
    }catch(error){
        console.log('error daw'+error);
    }
}


function showModalAddProductForm(){
    !modalAddProductToggle.value ? modalAddProductToggle.value = true : modalAddProductToggle.value = false;
}
function showEditModal(product){
    selectedProductId.value = product.id;
    selectedProductType.value = product.type;
    !modalEditProductToggle.value ? modalEditProductToggle.value = true : modalEditProductToggle.value = false;
}

function handleDecision(decision){
    modalLib().userDecision(decision);
}
async function deleteProduct(product){
    useModalLib.modalMessage.sign = 'pi pi-exclamation-triangle' // look for icon in primeicon website
    useModalLib.modalMessage.message = `Delete Product ${product.id}?`
    useModalLib.modalMessage.action = "Delete"
    useModalLib.modalMessage.action1 = "Cancel" //false
    useModalLib.modalMessage.action2 = "Confirm" //true
    const deleteDecision = await useModalLib.showDecisionModal();
    if(deleteDecision){
        try{
            const response = await axios.delete(apiStore().api+`products/delete/${product.type}/${product.id}`);
            fetchData();
            toast.success(`${product.id} Successfully Deleted`, {
                duration: 3000,
                close: true,
                position: "top-right",
            });
        }catch(error){
            toast.error(`Failed to Delete Products ${product.id}`, {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            console.log('error daw 112', error);
        }
    }
}

onMounted(() => {
    fetchData();
});

</script>

<template>
    <section>
        <editProduct v-if="modalEditProductToggle" v-model="modalEditProductToggle" @closeModal="fetchData" :id="selectedProductId" :type="selectedProductType"></editProduct> 
        <addProduct v-if="modalAddProductToggle" v-model="modalAddProductToggle" @closeModal="fetchData" ></addProduct>
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
            <div>
                <form @submit.prevent="SearchProduct">
                    <!-- <select name="attributeType" v-model="formSearchData.attributeType" required>
                        <option value="productId">ID</option>
                        <option value="productName">Name</option>
                        <option value="productDescription">Description</option>
                        <option value="productPrice">Price</option>
                        <option value="productQuantity">Quantity</option>
                    </select> -->
                    <input type="text" name="searchQuery" id="searchQuery" placeholder="Search a product" v-model="searchQuery">
                    <button value="submit">Search</button>
                </form>
                <button @click="showModalAddProductForm"><i class="pi pi-plus"></i><span>Add Product</span></button>
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Price</th>
                        <!-- <th>Quantity</th> -->
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    <tr v-for="product in products" :key="product.productId" v-if="(products.length > 0)">
                        <td :title="product.id">{{ product.id }}</td>
                        <td :title="product.type">{{ product.type }}</td>
                        <td :title="product.name">{{ product.name }}</td>
                        <td :title="product.price">${{ product.price }}</td>
                        <!-- <td :title="product.quantity">x{{ product.quantity }}</td> -->
                        <td><button @click="showEditModal(product)"><i class="pi pi-pencil"></i></button></td>
                        <td><button @click="deleteProduct(product)"><i class="pi pi-trash" ></i></button></td>
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
        >tr:nth-child(1){
            position: sticky;
            top: 1px;
            right: 0;
            background-color: var(--glass-bg-hard);
        }
        >tr:not(:nth-child(1)){
            >td:nth-last-child(2), >td:last-child{
                text-align: center;
                &>*{
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
            >td:nth-child(1),>td:nth-child(3),>td:nth-child(4),>td:nth-child(5){
                /* background-color: var(--debug-green); */
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 11rem;
                white-space: nowrap;
                /* text-align: center; */
            }
        }
        >tr:not(:nth-child(1)):nth-child(odd){
            background-color: color-mix(in srgb, var(--glass-bg-hard-trans) 100%, white 10%);   
        }
        >tr>td{
            cursor: pointer;
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