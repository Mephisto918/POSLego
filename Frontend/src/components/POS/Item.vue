<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    product: {
        type: Object
    }
})

const p = ref(props.product.info);
const i = ref(props.product.image);

</script>

<template>
    <div id="card">
        <div>
            <p :title="p.id">{{ p.id }}</p>
            <div>
                <img :src="i.image" alt="No image">
            </div>
            <p :title="p.type">{{ p.type }}</p>
        </div>
        <hr>
        <div>
            <div>
                <p :title="p.name">{{ p.name }}</p>
            </div>
            <p :title="p.price">${{ p.price }}</p>
        </div>
    </div>
</template>

<style scoped>
#card{
    border-radius: 7px;
    overflow: hidden;
    
    height: 10rem;
    aspect-ratio: 3/4;
    display: flex;
    flex-direction: column;
    justify-content: end;
    border: 1px solid var(--glass-bg-hard-soft-trans);
    color: var(--glass-bg-mild-soft);
    
    /* --name-price-type-section-bg: var(--glass-bg-hard-soft); */
    --name-price-type-section-bg: rgba(23, 23, 23, 0);
    --upper-font-size: 10pt;
    --id: calc(var(--upper-font-size) * 0.8);
    --type: calc(var(--upper-font-size) * 0.8);

    --name-price: 11pt;
    --name-font: calc(var(--name-price) * 0.8);
    --price-font: calc(var(--name-price) * 0.8);

    box-shadow: rgba(186, 186, 189, 0.25) 0px -20px 44px -12px inset,
                rgba(249, 248, 248, 0.3) 7px -15px 126px -18px inset, 
                black -2px 8px 9px 0px, 
                black 0px 9px 20px 0px inset;

    >div{
        position: relative;
        &:nth-child(1){
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >p{
                font-weight: 900;
                padding: 0 0.2rem;
                letter-spacing: 1px;
                background-color: var(--glass-bg-hard-soft);
                position: absolute;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 6.5rem;
                white-space: nowrap;
                &:first-child{
                    padding: 0.1rem 0.1rem 0 0.1rem;
                    font-size: var(--id);
                    top: 0;
                    left: 0;
                }
                &:last-child{
                    font-size: var(--type);
                    bottom: 0;
                    right: 0;
                }
            }
            >div{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
                background-color: white;
                >img{
                    object-fit: fill;
                    height: auto;
                    width: 100%;
                }
            }
        }
        >hr{
            display: none;
        }
        &:nth-child(3){
            position: relative;

            margin-top: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            
            background-color: var(--name-price-type-section-bg);
            >div{
                >p{
                    text-align: center;
                    font-size: var(--name-font);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 6.5rem;
                    white-space: nowrap;
                }
            }
            >p{
                /* background-color: yellow; */
                font-size: var(--price-font);
            }
        }
    }
    &:hover{
        cursor: pointer;
    }
}
</style>