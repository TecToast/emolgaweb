import {defineStore} from "pinia";
import {ref} from "vue";

export const useAuthState = defineStore("auth", () => {

    const loading = ref(true)
    const userdata = ref<{id: number, username: string, global_name: string, avatar: string, loggedIn: boolean}>({id: 0, username: "", global_name: "", avatar: "", loggedIn: false})
    async function load(): Promise<Boolean> {
        const res = await fetch("/api/userdata");
        console.log(res)
        const data = await res.json();
        if(data.id) {
            userdata.value = data
            userdata.value.loggedIn = true
        }
        loading.value = false
        return !!data.id;
    }

    return { loading, userdata, load }
});
