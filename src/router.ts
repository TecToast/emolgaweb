import {createRouter, createWebHistory, useRouter} from "vue-router";
import PrivacyPolicy from "./components/PrivacyPolicy.vue";
import TermsOfService from "./components/TermsOfService.vue";
import Home from "./components/Home.vue";
import Dashboard from "./components/Dashboard.vue";
import {useAuthState} from "./state/auth.ts";

export const CustomRouter =  createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: "/",
                component: Home
            },
            {
                path: "/privacy",
                component: PrivacyPolicy,
            },
            {
                path: "/tos",
                component: TermsOfService
            },
            {
                path: "/dashboard",
                component: Dashboard,
                beforeEnter: async () => {
                    const auth = useAuthState()
                    const router = useRouter()
                    if(!auth.userdata.loggedIn) {
                        await router.push("/")
                        return "/"
                    }
                },
            }
        ],
    })
CustomRouter.beforeEach(async () => {
    const auth = useAuthState()
    if(auth.loading) {
        await auth.load()
    }
})
