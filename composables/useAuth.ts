import {defineStore} from "pinia";

export const useAuth = defineStore('auth', () => {
    const {data, pending, error} = useFetch<UserData>('/api/userdata', {timeout: 1000})
    return { data, pending, error }
})
type UserData = {
    id: number,
    username: string,
    global_name: string,
    avatar: string,
}
