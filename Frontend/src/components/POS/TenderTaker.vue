<script setup>

import { onMounted, ref } from 'vue';

const tenderAmount = ref(0);

const props = defineProps({
    total: Number
});

const emit = defineEmits(['closeModal', 'update:modelValue', 'tenderAm']);
function closeModal(){
    emit('closeModal');
    return emit('update:modelValue', false);
}

function tenderProcess(){
    return emit('tenderAm', tenderAmount);
}

</script>

<template>
    <div id="con">
        <div>
            <h1>PAYMENT</h1>
            <h1 @click="closeModal">
                <div class="pi pi-times"></div>
            </h1>
            <div>
                <form @submit.prevent="tenderProcess">
                    <h2>Enter Amound Tendered: </h2>
                    <input type="number" step="0.01" :min="props.total" max="99999999.99" required v-model.number="tenderAmount"> 
                    <div>
                        <button value="submit"><h3>Accept</h3></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
#con{
    position: absolute;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(128, 128, 128, 0.164);
    backdrop-filter: blur(10px);
    z-index: 100;

    display: grid;
    place-items: center;
    
    >div{
        box-shadow: rgba(186, 186, 189, 0.25) 0px -20px 44px -12px inset,
                    rgba(249, 248, 248, 0.3) 7px -15px 126px -18px inset,
                    black -4px 18px 20px 0px,
                    black 0px 9px 20px 0px inset;

        overflow: hidden;
        position: relative;
        border: 5px solid var(--glass-bg-hard);
        background-color: color-mix(in srgb, var(--glass-bg-hard) 100%, white 20%);
        border-radius: 15px;
        display: grid;
        grid-template-columns: repeat(6, 4rem);
        grid-template-rows: repeat(8, 3rem);
        grid-template-areas: 
            "a a a a a a"
            ". . . . . ."
            "c c c c c c"
            "c c c c c c"
            "c c c c c c"
            "c c c c c c"
            "c c c c c c"
            "c c c c c c"
        ;
        >h1:nth-child(1){
            background-color: var(--glass-bg-hard);
            grid-area: a;
            text-align: center;
        }
        >h1:nth-child(2){
            position: absolute;
            right: 5px;
            top: 5px;
            
            display: grid;
            place-content: center;
            >div{
                height: 2rem;
                background-color: red;
                font-size: 1rem;
                aspect-ratio: 1/1;
                cursor: pointer;
                border-radius: 50%;
                padding: 0.5rem;
                &:hover{
                    background-color: rgb(246, 86, 86);
                    &:active{
                        background-color: rgb(143, 2, 2);
                    }
                }
            }
        }
        >div{
            grid-area: c;
            
            >form{
                display: grid;
                grid-template-columns: repeat(6, 4rem);
                grid-template-rows: repeat(5, 4rem);
                place-items: center;
                grid-template-areas: 
                "a a a a a a"
                    ". b b b b ."
                    ". . . . . ."
                    ". . c c . ."
                    ". . . . . ."
                    ;
                    /* ". . . . . ." */
                >h2{
                    /* background-color: red; */
                    text-shadow: -3px 4px 4px rgba(0,0,0,1);
                    grid-area: a;
                    text-align: center;
                }
                >input{
                    grid-area: b;
                    width: 100%;
                    height: 100%;
                    padding: 0.5rem;
                    font-size: 20pt;
                    border-radius: 5px;
                }
                >intput[type="number"]::-webkit-inner-spin-button,
                 intput[type="number"]::-webkit-outer-spin-button{
                     -webkit-appearance: none;
                     -moz-appearance: textfield;
                    appearance: none;
                }
                >div{
                    grid-area: c;
                    
                    border: 1px solide white;
                    >button{
                        height: 4rem;
                        border-radius: 8px;
                        aspect-ratio: 20/9;
                        cursor: pointer;
                        background-color: red;
                        
                        &:hover{
                            background-color: rgb(246, 86, 86);
                            &:active{
                                background-color: rgb(143, 2, 2);
                            }
                        }
                        >h3{
                            font-size: 20pt;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
}
</style>