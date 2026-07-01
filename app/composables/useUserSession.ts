import type {MeData} from "~/utils/types";

export default function() {
    // Global state to hold the user. Null means unauthenticated.
    const user = useState<MeData | null>('auth-user', () => null)

    // Function to fetch the user from Ktor
    const fetchUser = async () => {
        try {
            user.value = await useRequestFetch()<MeData>('/api/emolga/me')
        } catch (error) {
            user.value = null
        }
    }

    const clearSession = () => {
        user.value = null
    }

    const loggedIn = computed(() => !!user.value)

    return {
        user,
        loggedIn,
        fetchUser,
        clearSession
    }
}