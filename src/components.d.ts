export {
}

declare module 'vue' {
    export interface GlobalComponents {
        PulseLoader: typeof import('vue-spinner/src/PulseLoader.vue').default;
    }
}
