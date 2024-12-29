<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { apiStore } from '@/stores/api';
import { utilLib } from '@/stores/utils';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const toast = useToast();

const utils = utilLib();
let sales = ref([]);


const fetchData = async () => {
    try{
        const response = await axios.get(apiStore().api+'sales/all');
        sales.value = response.data.data;
    }catch(error){
        console.log('116 - ', error);
    }
}
onMounted(() => {
    fetchData();
});

</script>

<template>
    <section>
        <div id="inner">
            <table>
                <tbody>
                    <tr>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Tendered</th>
                        <th>Change</th>
                        <th>Total</th>
                    </tr>
                    <tr v-for="sale in sales" :key="sale.id">
                        <td>
                            <h4>{{ sale.date }}</h4>
                            <!-- <h5>{{ sale.time }}</h5> -->
                            <h5>{{ utils.convertTo12HourFormat(sale.time) }}</h5>
                        </td>
                        <td>{{ sale.quantity }}</td>
                        <td >
                            <h3>{{ sale.tender }}</h3>
                        </td>
                        <td>{{ sale.change }}</td>
                        <td>{{ sale.total }}</td>
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