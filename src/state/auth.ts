import {defineStore} from "pinia";

export const useAuthState = defineStore("auth", {
    state: () => {
        return {
            loading: true,
            username: undefined as string | undefined,
            avatarUrl: undefined as string | undefined,
        }
    }
})
console.log("GuMo Auth State Loaded!")
