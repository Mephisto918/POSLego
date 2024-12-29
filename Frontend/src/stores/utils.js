import { defineStore } from "pinia";
import { ref } from "vue";

export const utilLib = defineStore('utilLib', () => {
    const currentDate = ()=>{
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed, so add 1
        const day = String(today.getDate()).padStart(2, '0');  // two-digit day
        const hours = String(today.getHours()).padStart(2, '0'); // Get hours in 24-hour format
        const minutes = String(today.getMinutes()).padStart(2, '0'); // Get minutes
        const seconds = String(today.getSeconds()).padStart(2, '0'); // Get seconds
        const milliseconds = String(today.getMilliseconds()).padStart(3, '0'); // Get milliseconds
    
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`; // Format: YYYY-MM-DD HH:mm:ss.SSS
    }

    function convertTo12HourFormat(time) {
        const [hours, minutes, seconds] = time.split(':');
        const hour = ((parseInt(hours) + 11) % 12 + 1); // Convert to 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
        return `${hour}:${minutes} ${ampm}`; // Return formatted string
    }
    

    return { currentDate, convertTo12HourFormat};
})
