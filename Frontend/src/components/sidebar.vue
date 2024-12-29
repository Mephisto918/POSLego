<script setup>
import { RouterLink, useRoute } from 'vue-router';
import {ref} from 'vue';
import { onMounted, computed} from 'vue';
import axios from 'axios';
import defaultDp from '../assets/imgs/stock.jpg';
import { userStore } from '@/stores/userStore';
import { apiStore } from '@/stores/api';

import profileEditModal from '@/components/profEdit.vue'

const showProfEdit = ref(false);

const storeUser = userStore();
const api = apiStore();
const emit = defineEmits(['pageName']);

let userId = ref('');
const isTheCurrentUrl = (url)=>{
    const currentUrl = useRoute();
    return currentUrl.path === url;
}

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    userImage: {
        type: String,
        default: defaultDp
    }
});

const user = ref({
    id: '',
    name: '',
    username: '',
    password: ''
});
const route = useRoute();
const userImage = computed(() => props.userImage || defaultDp);
userId.value = route.params.id;

function profileSettings(){
    !showProfEdit.value ? showProfEdit.value = true : showProfEdit.value = false;
}

onMounted(async()=>{
    const userId = storeUser.id();
    try {
        const response = await axios.get(api.api+'users/'+userId);
        const {id, name, username, password} = response.data;
    } catch (error) {
        console.log('58 - ', error);
    }
    
})

</script>

<template>
    <section>
        <div @click="profileSettings" id="prof" >
            <div id="profile">
                <img :src="userImage" alt="">
            </div>
            <div id="profile-deatails">
                <h3 :title="name">{{ name }}</h3>
                <h4 :title="username">{{ username }}</h4>
            </div>
        </div>
        <hr>
        <div>
            <RouterLink :to="{name: 'Dashboard', params: { id: userId} }" :style="[isTheCurrentUrl(`/dashboard/${userId}`) ? 'background-color: rgba(0, 174, 255, 2.239)' : '']" @click="emit('pageName', 'Dashboard')" id="user">Dashboard</RouterLink>
            <RouterLink :to="{name: 'Users', params: { id: userId}}" :style="[isTheCurrentUrl(`/dashboard/${userId}/users`) ? 'background-color: rgba(0, 174, 255, 2.239)' : {}]" @click="emit('pageName', 'Users')" id="user">Users</RouterLink>
            <RouterLink :to="{name: 'Products', params: {id: userId}}" :style="[isTheCurrentUrl(`/dashboard/${userId}/products`) ? 'background-color: rgba(0, 174, 255, 2.239)' : {}]" @click="emit('pageName', 'Products')" id="products">Products</RouterLink>
            <RouterLink :to="{name: 'Stocks'}" :style="[isTheCurrentUrl(`/dashboard/${userId}/stocks`) ? 'background-color: rgba(0, 174, 255, 2.239)' : {}]" @click="emit('pageName', 'Stocks')" id="fileManager">Stocks</RouterLink>
            <RouterLink :to="{name: 'Sales'}" :style="[isTheCurrentUrl(`/dashboard/${userId}/sales`) ? 'background-color: rgba(0, 174, 255, 2.239)' : {}]" @click="emit('pageName', 'Sales')" id="fileManager">Sales</RouterLink>
        </div>
        <profileEditModal v-show="showProfEdit" @closeModal="profileSettings"></profileEditModal>
    </section>
</template>


<style scoped>
/* sidebar.vue css yawa */

#prof{
    position: relative;
    background-color: rgba(255,255,255, 0);
    z-index: 1;
    overflow: hidden;
    border-radius: 10px;
    
    
    &:hover::after{
        content: '';
        position: absolute;
        width: 18rem;
        height: 6rem;
        z-index: 100;
        background-color: rgba(255,255,255, 0.2);
        cursor: pointer;
    }
}

section{
    border: 1px solid var(--glass-bg-mild-soft);
    background-color: var(--glass-bg-hard-soft);
    width: 280px;
    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding: 1rem;

    >div:nth-child(1){
        display: flex;
        flex-direction: row;
        gap: 1rem;

        >#profile{
            --prof-width: 4rem;
            aspect-ratio: 1/1;

            margin-top: auto;
            margin-bottom: auto;
            margin-left: 0;
            margin-right: 0;

            >img{   
                background-position: center;
                background-size: cover;
                width: var(--prof-width);
                object-fit: cover;
                border-radius: 50%;
                aspect-ratio: 1/1;
            }
        }
    }
    >div:nth-child(3){
        /* background-color: var(--debug-blue); */
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;
        /* height: auto; */

        
        &::-webkit-scrollbar {
            display: none;
        }

        >a{
            background-color: rgba(0, 174, 255, 0.239);
            padding: 0.6rem;
            border-radius: 5px;
            
            &:hover{
                cursor: pointer;
                background-color: rgba(0, 174, 255, 2.239);
            }
        }
    }
}

#profile-deatails{
    overflow: hidden;
    white-space: nowrap;
    >h3,>h4{
        width: fit-content;
        text-overflow: clip;
    }
    >h3:hover,>h4:hover{
        cursor: pointer;
    }
    >h3{
        font-family: var(--big-text-fam);
        font-weight: calc(var(--normal-font-weight) * 1.5);
    }
    >h4{
        font-family: var(--text-fam);
        font-weight: var(--normal-font-weight);
    }
}
</style>