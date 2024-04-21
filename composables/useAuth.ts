import type {UserData} from "~/utils/types";

export const useAuth = () => {
    return useFetch<UserData>("/api/userdata", {timeout: 2000})
}
