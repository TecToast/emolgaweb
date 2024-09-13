import type {League, UserData} from "~/utils/types";

export const useDiscordStore = defineStore('discord', () => {
    /*const {data: user, execute: loadUser, error, pending, status } = useFetch<UserData>('/api/userdata', {timeout: 2000, credentials: 'include'})
    const {data: leagues, execute: loadLeagues} = useFetch<League[]>('/api/manage/myleagues', {
        timeout: 2000,
        credentials: 'include',
        immediate: false
    })*/
    const user = ref<UserData | null>(null)
    const leagues = ref<League[] | null>(null)
    function loadUser() {
        // ...
    }
    function loadLeagues() {
        // ...
    }
    function shouldRequestUser() {
        // return status.value == "idle"
        return false
    }
    return {
        user,
        loadUser,
        leagues,
        loadLeagues,
        shouldRequestUser
    }
})
