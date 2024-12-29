<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { apiStore } from '@/stores/api';
import { utilLib } from '@/stores/utils';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const toast = useToast();
import editStocksModal from './editStock.vue';
import addStocksModal from './addStock.vue';
import decisionModal from '../decisionModal.vue';

const utils = utilLib();
let products = ref([]);
let modalAddStocksToggle = ref(false);
let modalEditStocksToggle = ref(false);
const searchQuery = ref('');
const decisionModalToggle = ref(false);
const selectedProduct = ref(null);
const selectedProductName = ref(null);



async function SearchProduct() {
    try{
        if(searchQuery.value == ''){
            return fetchData();
        };
        const response = await axios.post(apiStore().api+'products/search', { "search" : searchQuery.value});
        products.value = response.data;



    }catch(error){
        console.log('35 - '+error);
    }
}

function showModalAddStocksForm(){
    !modalAddStocksToggle.value ? modalAddStocksToggle.value = true : modalAddStocksToggle.value = false;
}
function showEditModal(product){
    selectedProduct.value = product;
    const { setName, brickName } = product;
    selectedProductName.value = product.name;
    !modalEditStocksToggle.value ? modalEditStocksToggle.value = true : modalEditStocksToggle.value = false;
}
let userDecisionResolve;
function userDecision (decision){
    decisionModalToggle.value = false;
    userDecisionResolve(decision);
}
function showDecisionModal(){
    decisionModalToggle.value = true;
    
    return new Promise((resolve)=>{
        userDecisionResolve = resolve;
    })
}
async function deleteProduct(product){
    const deleteDecision = await showDecisionModal();
    if(deleteDecision){
        try{
            const response = await axios.delete(apiStore().api+'stocks/delete/'+product);
            fetchData();
            toast.error(`Stock Successfully Deleted`, {
                duration: 3000,
                close: true,
                position: "top-right",
            });
            }catch(error){
            console.log('72 - ', error);
        }
    }
}


const fetchData = async () => {
    try{
        const response = await axios.get(apiStore().api+'stocks/all');
        products.value = response.data;
    }catch(error){
        console.log('83 - ', error);
    }
}
onMounted(() => {
    fetchData();
});

</script>

<template>
    <section>
        <addStocksModal v-if="modalAddStocksToggle" v-model="modalAddStocksToggle" @closeModal="fetchData" ></addStocksModal>
        <editStocksModal v-if="modalEditStocksToggle" v-model="modalEditStocksToggle" @closeModal="fetchData" :product="selectedProduct" :name="selectedProductName"></editStocksModal> 
        <decisionModal v-if="decisionModalToggle" sign="pi pi-exclamation-triangle" message="Are you sure you want to delete this product?"  action="Delete" action1="Cancel" action2="Confirm" @decision="userDecision"></decisionModal>
        <div id="inner">
            <div>
                <form @submit.prevent="SearchProduct">
                    <!-- <select name="attributeType" v-model="formSearchData.attributeType" required>
                        <option value="productDate">Date Added</option>
                        <option value="productName">Name</option>
                        <option value="productQuanity">Quantity</option>
                        <option value="productPrice">Expiry</option>
                    </select> -->
                    <input type="text" name="searchQuery" id="searchQuery" placeholder="Search a product" v-model="searchQuery">
                    <button value="submit">Search</button>
                </form>
                <button @click="showModalAddStocksForm"><i class="pi pi-plus"></i><span>Add Stock</span></button>
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Date Added</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Expiry</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    <tr v-for="product in products" :key="product.productId" v-if="(products.length > 0)">
                        <td :title="product.dateAdded">
                            <h4>{{ product.addedDateFormated.date }}</h4>
                            <h5>{{ utils.convertTo12HourFormat(product.addedDateFormated.time) }}</h5>
                        </td>
                        <td :title="product.name">
                            <h3>{{ product.id }}</h3>
                            <p>{{ product.name }}</p>
                        </td>
                        <td :title="product.quantity">x{{ product.quantity }}</td>
                        <td :title="product.expiryDate">
                            <h4>{{ product.expiryDateFormated.date }}</h4>
                            <h5>{{ utils.convertTo12HourFormat(product.expiryDateFormated.time) }}</h5>
                        </td>
                        <td><button @click="showEditModal(product)"><i class="pi pi-pencil"></i></button></td>
                        <td><button @click="deleteProduct(product.stockId)"><i class="pi pi-trash" ></i></button></td>
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
            &:nth-child(even){
                background-color: color-mix(in srgb, var(--glass-bg-hard) 40%, white 0.01%);
                /* background-color: var(--debug-yellow); */
            }
            >td:nth-child(5), >td:nth-child(6){
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
            >td:nth-child(1){
                width: min-content;
                text-align: center;
            }
            >td:nth-child(2){
                text-align: center;
                display: grid;
                place-items: center;
                >p{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 15rem;
                    white-space: nowrap;
                    text-align: center;
                    /* background-color: var(--debug-blue); */
                    font-size: 9pt;
                    font-weight: 400;
                }
                >h3{
                    /* background-color: blue; */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 15rem;
                    white-space: nowrap;
                    text-align: center;

                }
            }
            >td:nth-child(3),>td:nth-child(4),>td:nth-child(5){
                /* background-color: var(--debug-green); */
                text-align: center;
            }
        }
        >tr>td,>tr>td{
            >*{
                cursor: pointer;
            }
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