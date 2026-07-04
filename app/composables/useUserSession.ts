import type {MeData} from "~/utils/types";

export default function() {
    // Global state to hold the user. Null means unauthenticated.
    const user = useState<MeData | null>('auth-user', () => null)
    const alreadyFetched = ref(false)

    // Function to fetch the user from Ktor
    const fetchUser = async () => {
        try {
            user.value = await useRequestFetch()<MeData>('/api/emolga/me')
        } catch (error) {
            user.value = null
        }
        alreadyFetched.value = true
    }

    const clearSession = () => {
        user.value = null
    }

    const loggedIn = computed(() => !!user.value)

    const fetchIfRequired = async () => {
        if(!alreadyFetched.value) {
            await fetchUser()
        }
    }

    return {
        user,
        loggedIn,
        fetchUser,
        clearSession,
        fetchIfRequired,
    }
}