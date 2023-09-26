import {defineStore} from "pinia";
import {ref} from "vue";
import {asyncCallWithTimeout} from "../helpers/loaders.ts";

export const useAuthState = defineStore("auth", () => {

    const loaded = ref(false)
    const error = ref(false)
    const userdata = ref<{id: number, username: string, global_name: string, avatar: string, loggedIn: boolean}>({id: 0, username: "", global_name: "", avatar: "", loggedIn: false})
    async function load() {
        await asyncCallWithTimeout(fetch("/api/userdata").then(res => res.json()).then(data => {
            if(data.id) {
                userdata.value = data
                userdata.value.loggedIn = true
            }
            loaded.value = true
        }), 5000).catch(() => {
            loaded.value = true
            error.value = true
        })
    }

    return { loaded, userdata, error, load }
});
