import { defineStore } from "pinia";
import { ref } from "vue";

export const modalLib = defineStore('modalLib', () => {
    const decisionModalToggle = ref(false);
    let userDecisionResolve;

    const modalMessage = ref({
        sign : "?",
        message:"?",
        action:"?",
        action1:"?", 
        action2:"?",
    })

    function userDecision (decision){
        decisionModalToggle.value = false;
        if(userDecisionResolve){
            userDecisionResolve(decision);
        }
    }

    function showDecisionModal(){
        decisionModalToggle.value = true;
    
        return new Promise((resolve)=>{
            userDecisionResolve = resolve;
        })
    }

    return { decisionModalToggle, userDecision, showDecisionModal, modalMessage };
})

/* to use the modal
    import decisionModal from '../decisionModal.vue';
    import { modalLib} from '@/stores/modalLogics';
    const useModalLib = modalLib();

    function handleDecision(decision){   // for the emmiter
        modalLib().userDecision(decision);
    }

    async function decisionTime(){
        //to pass message to the modal use this
        //icons sa primeicon nga gamiton nako often
        pi pi-exclamation-circle = circle exclamation mark
        pi pi-exclamation-triangle = triangle exclamation mark
        pi pi-question-circle = cicle question mark
        pi pi-question-circle = question mark
        pi pi-trash = delete
        pi pi-times = x
        useModalLib.modalMessage.sign = "pi pi-icon" // look for icon in primeicon website
        useModalLib.modalMessage.message = "message"
        useModalLib.modalMessage.action = "message"
        useModalLib.modalMessage.action1 = "message" //false
        useModalLib.modalMessage.action2 = "message" //true

        const boolDecision = await useModalLib.showDecisionModal(); // for logic after confirmation
        if(boolDecision){
            // do something
        }else{
            // do nothing
        }
    }

    // toastify boilerplate kay kapoy nag pangita
    import { useToast } from 'vue-toastification';
    import 'vue-toastification/dist/index.css';
    const toast = useToast();
    
    toast.success('Product Successfully Added', {
        duration: 3000,
        close: true,
        position: "top-right",
    });

*/
/*  // new
    <decisionModal 
        v-if="useModalLib.decisionModalToggle" 
            :sign="useModalLib.modalMessage.sign" 
            :message="useModalLib.modalMessage.message"  
            :action="useModalLib.modalMessage.action" 
            :action1="useModalLib.modalMessage.action1" 
            :action2="useModalLib.modalMessage.action2"
            @decision="handleDecision">
    </decisionModal>
    // old
    <decisionModal 
        v-if="useModalLib.decisionModalToggle" 
        sign="pi pi-exclamation-triangle" 
        message="Are you sure you want to delete this product?"  
        action="Delete" 
        action1="Cancel" 
        action2="Confirm"
        @decision="handleDecision">
    </decisionModal>

    <button @click="decisionTime>logic</button>
*/