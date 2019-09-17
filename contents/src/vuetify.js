/*
    vuetify.js
 */
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import './main.scss'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
    iconfont: 'mdi',
    theme: {
        options: {
            customProperties: true,
        },
        dark: false,
        themes: {
            light: {
                /*
                    These create CSS classes per property.
                    Use via CSS classes: var(--v-accent-lighten-2)
                    Can also use in class=".accent lighten-3"
                    Direct reference: this.$vuetify.theme.themes.light.primary
                 */
                "primary": "#1976D2",
                "secondary": "#707070",
                "accent": "#82B1FF",
                "error": "#FF5252",
                "info": "#2196F3",
                "success": "#4CAF50",
                "warning": "#FB8C00",
                "anchor": '#1976D2',
            }
        }
    }
})
