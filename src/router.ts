import {createRouter, createWebHistory} from "vue-router";
import PrivacyPolicy from "./components/PrivacyPolicy.vue";
import TermsOfService from "./components/TermsOfService.vue";
import Home from "./components/Home.vue";

export const CustomRouter =  createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: "/",
                component: Home
            },
            {
                path: "/privacy",
                component: PrivacyPolicy
            },
            {
                path: "/tos",
                component: TermsOfService
            }
        ],
    })
