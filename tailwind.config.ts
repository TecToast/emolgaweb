import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                'lightning-yellow': {
                    '50': '#fffbeb',
                    '100': '#fff4c6',
                    '200': '#ffe688',
                    '300': '#ffd44a',
                    '400': '#ffc126',
                    '500': '#f99d07',
                    '600': '#dd7602',
                    '700': '#b75206',
                    '800': '#943e0c',
                    '900': '#7a330d',
                    '950': '#461a02',
                },

            }
        }
    }
}
