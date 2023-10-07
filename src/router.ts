import {createRouter, createWebHistory, useRouter} from "vue-router";
import PrivacyPolicy from "./components/PrivacyPolicy.vue";
import TermsOfService from "./components/TermsOfService.vue";
import Home from "./components/Home.vue";
import Dashboard from "./components/Dashboard.vue";
import {useAuthState} from "./state/auth.ts";
import DashboardOverview from "./components/dashboard/DashboardOverview.vue";
import DashboardLeagueOverview from "./components/dashboard/DashboardLeagueOverview.vue";
import DashboardLeague from "./components/dashboard/DashboardLeague.vue";
import LeagueOptionSelector from "./components/dashboard/league/LeagueOptionSelector.vue";
import LeagueQueuePicks from "./components/dashboard/league/LeagueQueuePicks.vue";



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
                children: [
                    {
                        path: "",
                        component: DashboardOverview
                    },
                    {
                        path: "leagues",
                        component: DashboardLeagueOverview,
                    },
                    {
                        path: "leagues/:leaguename",
                        component: DashboardLeague,
                        children: [
                            {
                                path: "",
                                component: LeagueOptionSelector
                            },
                            {
                                path: "queuepicks",
                                component: LeagueQueuePicks
                            }
                        ]
                    }
                ]
            }
        ],
    })
CustomRouter.beforeEach(async () => {
    const auth = useAuthState()
    if(!auth.loaded) {
        await auth.load()
    }
})
