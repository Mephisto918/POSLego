<script setup>
import { vAutoAnimate } from '@formkit/auto-animate';

const emit = defineEmits(['decision']);

function returnTrue() {
    emit('decision', true)
    // console.log('true'); //debugging
};
function returnFalse() {
    emit('decision', false)
    // console.log('false'); // debugging
};

defineProps({
    message: {
        type: String,
        default: ''
    },
    sign: {
        type: String,
        default: ''
    },
    action: {
        type: String,
        default: ''
    },
    action1: {
        type: String,
        default: ''
    },
    action2: {
        type: String,
        default: ''  
    }
})
</script>
        
<template>
    <Teleport to="body" v-auto-animate>
        <div id="con">
            <div>
                <div>
                    <h2>{{ action }}</h2>
                    <i :class="sign"></i>
                </div>
                <main>
                    <p>{{ message }}</p>
                    <div>
                        <button @click="returnFalse">{{ action1 }}</button>
                        <button @click="returnTrue">{{ action2 }}</button>
                    </div>
                </main>
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
    backdrop-filter: blur(10px);
    >div{
        >div{
            background-color: var(--glass-bg-soft-trans);
            color: var(--font-color-light);
            --width: 400px;
            width: var(--width);
            height: fit-content;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            position: relative;
            gap: 0.3rem;

            overflow: hidden;
            border-radius: 10px 10px 0 0;
            >i{
                /* background-color: var(--debug-green); */
                font-size: calc(var(--width) * 0.07);
                aspect-ratio: 1/1;
            }
        }
        >main{
            background-color: var(--glass-bg-hard-soft);
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            >p{
                padding: 1rem;
            }
            >div{
                width: 100%;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                >button{
                    font-size: 1.1rem;
                    border: 1px solid var(--glass-bg-soft);
                    padding: 0.3rem 0.8rem;
                    border-radius: 6px;
                    &:hover{
                        cursor: pointer;
                        color: var(--font-color-dark);
                    }
                   
                    &:nth-child(1){
                        background-color: var(--debug-green);
                        &:hover{
                            background-color: color-mix(in srgb, var(--debug-green) 70%, white 70%);
                        }
                        &:active{
                            background-color: var(--glass-bg-hard-trans);
                            color: var(--font-color-light);
                        }
                    }
                    &:nth-child(2){
                        background-color: var(--debug-red);
                        &:hover{
                            background-color: color-mix(in srgb, var(--debug-red) 70%, white 70%);
                        }
                        &:active{
                            background-color: var(--glass-bg-hard-trans);
                            color: var(--font-color-light);
                        }
                    }
                }
            }
        }
    }
}

</style>