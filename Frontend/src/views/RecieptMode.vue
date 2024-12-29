<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { apiStore } from '@/stores/api';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const toast = useToast();
import { utilLib } from '@/stores/utils';
const util = utilLib();

const productsArr = ref([]);
const cartArray = ref([]);

const api = apiStore();
const router = useRouter();

const cartData = ref({});
const simplifiedCart = ref([]);
const totalVal = ref(0);
const cartQuantity = ref(0);
const totalCartItems = ref(0);
const tendered = ref(0);
const changeVal = ref(0);
const dateForm = ref('');
const timeForm = ref('');

function sortCart(cartItems){
    cartItems.forEach(item => {
        const existingItem = simplifiedCart.value.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalItemPrice += item.price;
        } else {
            simplifiedCart.value.push({ 
                ...item, 
                quantity: 1, 
                totalItemPrice: item.price // Initialize totalItemPrice with the current item's price
            });
        }
    });
    cartQuantity.value = simplifiedCart.value.length;
    const dateObject = new Date(util.currentDate());
    dateForm.value = dateObject.toISOString().split('T')[0]; 
    timeForm.value = dateObject.toTimeString().split(' ')[0]; 
}

async function backToCart(){
    const time = timeForm.value;
    const date = dateForm.value;
    const change = changeVal.value;
    const total = totalVal.value;
    const tender = tendered.value;
    const quantity = totalCartItems.value;
    const cartItems = simplifiedCart.value
    const transact = { cartItems,quantity, tender, total, change, date, time};
    const response = await axios.post(api.api+'POS/transact', transact);
    localStorage.clear();
    router.push({ name: 'cart' });
}

onMounted(async ()=>{
    try {
        const storage = JSON.parse(localStorage.getItem('cartItems'));
        cartData.value = storage.cartItems;
        totalCartItems.value = cartData.value.length;
        sortCart(storage.cartItems);
        tendered.value = storage.tenderAm;
        totalVal.value = storage.formattedTotal;
        changeVal.value = parseFloat(parseFloat(Math.round((tendered.value - totalVal.value) * 100) / 100).toFixed(2));
    } catch (error) {
        console.log('73 - ', error);
    }
});


</script>

<template>
    <div id="main">
        <h1>&#8202</h1>
        <section>
            <div id="reciept">
                <h3>ROBINSON SUPERMARKET CORPORATION <br>
                    VAT REG TIN 000-405-340-090 <br>
                    ORMOC CENTRUM <br>
                    AVILES STREET <br>
                    ORMOC CITY
                </h3>
                <div id="items">
                    <div v-for="(item, index) in simplifiedCart" :key="index" class="item">
                        <div>
                            <p style="font-size: 13pt; font-weight: 600;">{{ item.name }}</p>
                            <p>{{ item.id }} - {{ item.price }}</p>
                        </div>
                        <div>
                            <p style="font-size: 13pt; font-weight: 600;">x {{ item.quantity }}</p>
                            <p style="font-size: 13pt; font-weight: 600;">{{ item.totalItemPrice }}</p>
                        </div>
                    </div>
                </div>
                <footer id="receipt-footer">
                    <hr style="background-color: black; margin: 0.5rem 0; border: 1px solid rgb(35, 35, 35); height: 0.5rem; width: 100%;">
                    <div style="font-size: 15pt; font-weight: bolder;"><p>TOTAL :</p>      <p>{{ totalVal }}</p></div>
                    <hr style="background-color: black; margin: 0.5rem 0; border: 1px solid rgb(35, 35, 35); height: 0.5rem; width: 100%;">
                    <div id="vat-sec">
                        <div class="foot"><p>Vatable :</p><p id="vatable">0.00</p></div>
                        <div class="foot"><p>VAT :</p><p id="vat">0.00</p></div>
                        <div class="foot"><p>VAT Exempt Sales :</p><p>0.00</p></div>
                        <div class="foot"><p>Zero Rated SAles :</p><p>0.00</p></div>
                    </div>
                    <hr style="background-color: black; margin: 0.5rem 0; border: 1px solid rgb(35, 35, 35); height: 0.5rem;width: 100%;">
                    <div style="font-size: 15pt; font-weight: bolder;"><p>TOTAL :</p>      <p id="total-amount">{{ totalVal }}</p></div>
                    <hr style="background-color: black; margin: 0.5rem 0; border: 1px solid rgb(35, 35, 35); height: 0.5rem;width: 100%;">
                    <div style="font-size: 13pt; font-weight: 600;"><p>Tendered Amount:</p><p>{{ tendered }}</p></div>
    const cartItems = cartItems.value
                    <div style="font-size: 13pt; font-weight: 600;"><p>Change:</p><p>{{ changeVal }}</p></div>
                    <hr style="background-color: black; margin: 0.5rem 0; border: 1px solid rgb(35, 35, 35); height: 0.5rem;width: 100%;">
                    <div><p>Total Items:</p><p style="font-size: 13pt; font-weight: 600;">{{ totalCartItems }}</p></div>
                    <div><p>Data:</p><p style="margin-left: 0; font-size: 13pt; font-weight: 600;">{{ dateForm }}</p><p>Time:</p><p style="margin: 0; font-size: 13pt; font-weight: 600;">{{ timeForm }}</p></div>
                </footer>
            </div>
        </section>
        <div id="nextButton">
            <button class="pi pi-arrow-right" @click="backToCart"></button>
        </div>
    </div>
</template>

<style scoped>
/* Reciept.vue */


#reciept{
    border-radius: 10px 10px 0 0;
    width: 32rem;
    color: #222;
    background-color: #D3D3D3;
    overflow-y: scroll;
    
    height: 100%;
    padding: 3rem 1rem 30rem 1rem;
    
    display: flex;
    flex-direction: column;
    text-align: center;

    &::-webkit-scrollbar{
        width: 0;
    }

    font-family: 'Courier New';
    >h3{
        text-shadow:  0px 0px 0px rgba(0,0,0,0);
    }
    >*:nth-child(2){ /* heading */
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        >div{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: start;
            
            --title-size: 12pt;
            --code-size: 9pt;
            >*:nth-child(1){
                text-align: start;
                display: flex;
                flex-direction: column;
                justify-content: center;
                >p{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 19rem;
                    white-space: nowrap;
                    &:nth-child(1){font-size: var(--title-size);font-weight: 900;}
                    &:nth-child(2){font-size: var(--code-size);font-weight: 900;}
                    text-shadow:  0px 0px 0px rgba(0,0,0,0);
                }
            }
            >*:nth-child(2){
                margin-left: auto;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                >p{ 
                    text-align: end;
                    width: 5rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-shadow:  0px 0px 0px rgba(0,0,0,0);
                }
                >p:nth-child(1){
                    /* border: 1px solid red; */
                    margin-right: 10px;
                }
            }
        }
    }
    >*:nth-child(3){        
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        width: 100%;
        
        >div:not(:nth-child(4)){
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: start;
            width: 100%;
            >p{text-shadow:  0px 0px 0px rgba(0,0,0,0);}
        }
        >div:nth-child(4){
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: start;
            width: 100%;
            >div{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: start;
                width: 100%;
                >p{text-shadow:  0px 0px 0px rgba(0,0,0,0);}
            }
        }
    }
}

#nextButton{
    position: absolute;
    font-size: 30pt;
    text-align: center;
    top: 0;
    right: 0;
    
    >button{
        background-color: var(--glass-bg-hard-soft);
        height: 100dvh;
        width: 4.5rem;

        &:hover{
            background-color: var(--glass-bg-mild-soft);
            color: var(--glass-bg-hard-soft-trans);
            &:active{
                background-color: var(--glass-bg-hard-soft);
                color: var(--glass-bg-mild-soft);
            }
        }
    }
}
#main{
    position: relative;
    width: 100dvw;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
        
    --items-w-mx: 65rem;
    --items-w-mn: 65rem;
    --items-h: 35rem;
    h1{
        background-color: var(--glass-bg-hard-soft);
        max-width: var(--items-w-mx);
        min-width: var(--items-w-mn);
        text-align: center;
    }
    section{
        padding: 4rem 0 0 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        max-width: var(--items-w-mx);
        min-width: var(--items-w-mn);
        height: var(--items-h);
        
        main{
            width: 40%;
            height: 100%;
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
        border: 3px solid var(--glass-bg-hard-soft);
        box-shadow: rgba(186, 186, 189, 0.25) 0px -20px 44px -12px inset,
                    rgba(249, 248, 248, 0.3) 7px -15px 126px -18px inset,
                    black -4px 18px 20px 0px,
                    black 0px 9px 20px 0px inset;
        border-radius: 0 0 var(--border-rad) var(--border-rad);
    }
}

</style>