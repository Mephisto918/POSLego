<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { apiStore } from '@/stores/api';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const toast = useToast();

import Item from '@/components/POS/Item.vue';
import Tender from '@/components/POS/TenderTaker.vue';

const productsArr = ref([]);
const cartArray = ref([]);
const total = ref(0);
const totalFormatted = ref(0);
const tender = ref(0);
const tenderPayModalRender = ref(false);

const api = apiStore();
const router = useRouter();

function addProduct(product) {
    if(total.value >= 99999.99){
        return toast.error('Total Price Limit 99999.99', {
            duration: 3000,
            close: true,
            position: "top-right",
        });
    }
    const processedData = (item) =>{
        const { id, name, price: price1, type, quantity } = item.info;
        const price = parseFloat(price1);
        return { id, name, price, type};
    }
    cartArray.value.push(processedData(product));
}
function removeItem(index){
    cartArray.value.splice(index, 1);
}

function proceedToPayment(e) {
    if(total.value <= 0){
        return toast.error('Cart is empty!', {
            duration: 3000,
            close: true,
            position: "top-right",
        });
    }
    totalFormatted.value = parseFloat(parseFloat(Math.round(total.value * 100) / 100).toFixed(2));
    !tenderPayModalRender.value ? tenderPayModalRender.value = true : tenderPayModalRender.value = false; 
}

function tenderProcess(tenderAm){
    const value = tenderAm.value;
    const formattedTotal = totalFormatted.value;
    const cartItems = cartArray.value;
    const dataWithTender = { cartItems, tenderAm: value, formattedTotal};
    try {
        localStorage.setItem('cartItems', JSON.stringify(dataWithTender));
        router.push('/reciept');
    } catch (error) {
        console.log('51 - er', error);
    }
}

const closeModalTender = ()=>{ return !tenderPayModalRender.value ? tenderPayModalRender.value = true : tenderPayModalRender.value = false }

const handleBeforeUnload = (event) => {

    event.preventDefault();
    event.returnValue = ''; // Required for some browsers to show a confirmation dialog
};

const transfer = (e)=>{    
    router.push('/login');
}

onMounted(async ()=>{
    try{
        const storedDataCart = localStorage.getItem('cartItems');
        if(storedDataCart) {
            try {
                const parse = JSON.parse(storedDataCart);
                cartArray.value = parse.cartItems || [];
            } catch (error) {
                throw error;
            }
        };
        const response = await axios.get(api.api+'POS/all');
        productsArr.value = response.data.filter((product) => product.info.quantity > 0);
    }catch(error){
        console.log('99 - ', error);
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(()=>{
    window.removeEventListener('beforeunload', handleBeforeUnload);
})

watch(cartArray, (newVal, oldVal)=>{
    total.value = cartArray.value.reduce((acc, item)=>{
        return acc + parseFloat(item.price);
    }, 0);
}, {deep: true, immediate: true});

</script>

<template>
    <div id="main">
        <Tender v-show="tenderPayModalRender" @closeModal="closeModalTender" @tenderAm="tenderProcess" :total="totalFormatted"></Tender>
        <div id="dash" @click="transfer" >
            <div class="pi pi-user"></div>
        </div>
        <h1>POS</h1>
        <section>
            <main>
                <div id="item-con">
                    <Item v-for="(product, index) in productsArr" :key="index" :product="product" @click="addProduct(product)"></Item>
                </div>
            </main>
            <aside>
                <div>
                    <h3>TOTAL: </h3>
                    <h3>${{ total.toFixed(2) }}</h3>
                </div>
                <hr>
                <div>
                    <div v-for="(item, index) in cartArray">
                        <div>
                            <p :tittle="item.id">{{ item.id }}</p>
                            <p :tittle="item.id">{{ item.name }}</p>
                        </div>
                        <p :tittle="item.id">${{ item.price }}</p>
                        <div>
                            <button class="pi pi-times" @click="removeItem(index)"></button>
                        </div>
                    </div>
                </div>
                <div>
                    <button @click="proceedToPayment"><h3>PAYMENT</h3></button>
                </div>
            </aside>
        </section>
    </div>
</template>

<style scoped>
/* cart.vue */

#item-con{
    height: 100%;
    padding: 0.5rem;
    
    display: grid;
    grid-template-columns: repeat(auto-fill, 7.2rem);
    grid-template-rows: repeat(4, 1fr);
    
    gap: 1rem;

    overflow-y: scroll;

    &::-webkit-scrollbar{
        width: 0;
    }
}
aside{
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-content: center;
    gap: 1rem;
    height: 50%;

    --item-code-font: 13pt;
    --item-name-font: calc(var(--item-code-font) * 0.8);
    --item-price-font: calc(var(--item-code-font) * 0.7);

    >div:first-child{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    >div:nth-child(4){
        margin-top: auto;
        height: 4rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        >button{
            height: 100%;
            width: 100%;
            text-align: center;
        }
    }
    
    >div:nth-child(3){ /* -----====== cart item list container ------------- */
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: rgba(186, 186, 189, 0.25) 0px -20px 44px -12px inset,
                    rgba(249, 248, 248, 0.3) 7px -15px 126px -18px inset,
                    black 0px 9px 20px 0px inset;
        height: 100%;
        padding: 1rem 0.4rem 0.4rem 0.4rem;
        
        overflow-y: scroll;
        &::-webkit-scrollbar{
            width: 0;
        }
        
        >div{ /* --------------------item-list-container------------ */
            margin-bottom: 0.5rem;
            width: 100%;
            display: flex;
            justify-content: start;
            align-items: center;
            gap: 0.3rem;
            overflow: hidden;
            border-radius: 6px;
            
            background-color: var(--glass-bg-hard);
            
            
            >div:first-child{
                padding: 0.3rem;
                >p:first-child{
                    font-size: var(--item-code-font);
                    background-color: rgba(0, 0, 0, 0);
                    box-shadow: black -4px 18px 20px 0px;
                                /* black 0px 9px 20px 0px inset; */
                    font-weight: 900;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 13rem;
                    white-space: nowrap;
                }
                >p:last-child{
                    font-size: var(--item-name-font);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 13rem;
                    white-space: nowrap;
                }
            }
            >p:nth-child(2){
                margin-left: auto;
                font-size: var(--item-price-font);
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 6.5rem;
                white-space: nowrap;
            }
            >div:last-child{
                overflow: hidden;
                height: 3.1rem;
                aspect-ratio: 1/1;
                border: 2px solid var(--glass-bg-hard);
                >button{ 
                    background-color: var(--glass-bg-mild-soft-trans);
                    box-shadow: black -4px 18px 20px 0px;
                    /* black 0px 9px 20px 0px inset; */
                    border-radius: 0 5px 5px 0;
                    height: 100%;
                    font-size: 15pt;
                    aspect-ratio: 1/1;
                    text-align: center;
                    &:hover{
                        background-color: var(--glass-bg-mild-soft);
                        color: var(--glass-bg-hard);
                        cursor: pointer;
                    }
                }
            }
        }
    }
}

#main{      /* design */
    --border-rad: 20px;
    >h1{
        border-radius: var(--border-rad) var(--border-rad) 0 0;
    }
    >section{
        backdrop-filter: blur(15px);
        overflow: hidden;
        border: 3px solid black;
        border: 3px solid var(--glass-bg-hard-soft);
        box-shadow: rgba(186, 186, 189, 0.25) 0px -20px 44px -12px inset,
                    rgba(249, 248, 248, 0.3) 7px -15px 126px -18px inset,
                    black -4px 18px 20px 0px,
                    black 0px 9px 20px 0px inset;
        border-radius: 0 0 var(--border-rad) var(--border-rad);
    }
}

#main{
    width: 100dvw;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    --items-w-mx: 65rem;
    --items-w-mn: 65rem;
    --items-h: 37rem;
    h1{
        background-color: var(--glass-bg-hard-soft);
        max-width: var(--items-w-mx);
        min-width: var(--items-w-mn);
        text-align: center;
    }
    section{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        max-width: var(--items-w-mx);
        min-width: var(--items-w-mn);
        height: var(--items-h);
        
        main{
            width: 65%;
            height: 100%;
        }
        aside{
            height: 100%;
            flex-grow: 1;

            >*:last-child{
                >button{
                    font-size: 15pt;
                    box-shadow: rgba(249, 248, 248, 0.3) 4px 0px 10px 0px inset,
                    rgba(186, 186, 189, 0.25) 0px 9px 20px 0px inset;
                    
                    &:hover{
                        cursor: pointer;
                        color: var(--glass-bg-mild-soft-trans);
                        box-shadow: rgba(186, 186, 189, 0.25) 0px -20px 44px -12px inset,
                        rgba(249, 248, 248, 0.3) 7px -15px 126px -18px inset,
                        black 4px 0px 10px 0px inset,
                        black 0px 9px 20px 0px inset;
                        
                        &:active{
                            color: var(--glass-bg-light);
                            box-shadow: rgba(249, 248, 248, 0.3) 4px 0px 10px 0px inset,
                                        rgba(186, 186, 189, 0.25) 0px 9px 20px 0px inset;
                        }
                    }
                }
            }
        }
    }
}

#dash{
    height: 3rem;
    aspect-ratio: 1/1;
    background-color: var(--glass-bg-hard);
    border: 1ps solid blue;
    border-radius: 10px;
    
    position: absolute;
    top: 10px;
    right: 10px;

    font-size: 20pt;
    text-align: center;
    display: grid;
    place-content: center;
    
    &:hover{
        cursor: pointer;
        background-color: var(--glass-bg-soft);
        color: var(--glass-bg-mild-soft-trans);
        
        &:active{
            color: var(--glass-bg-light);
            background-color: var(--glass-bg-hard-trans);
        }
    }
}
</style>