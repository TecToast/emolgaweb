import {defineStore} from "pinia";
import {ref} from "vue";
import {asyncCallWithTimeout} from "../helpers/loaders.ts";

export const useLeagueState = defineStore("league", () => {
    const loaded = ref(false)
    const leagues = ref<{name: string, picks: {name:string, tier:string}[], isRunning: true }[]>([])
    const error = ref(false)

    async function load() {
        await asyncCallWithTimeout(fetch("/api/manage/myleagues").then(res => res.json()).then(data => {
            leagues.value = data
            loaded.value = true
        }), 5000).catch(() => {
            error.value = true
        })
    }

    return { loaded, leagues, error, load }
})

