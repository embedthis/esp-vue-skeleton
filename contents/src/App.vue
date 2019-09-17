<template>
    <v-app>
        <v-app-bar dark color="secondary" app>
            <v-toolbar-title class="headline text-uppercase">
                <span class="font-weight-light">{{title}}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-content>
            <v-container fluid>
                <router-view />
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import {Vue, Component, Prop} from 'vue-property-decorator'

@Component()
export default class App extends Vue {
    title = null

    mounted() {
        this.title = 'esp-vue-skeleton'
    }
}
</script>

<style lang="scss">
body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: $font-size-root;
    .v-content {
        padding: 74px 20px 20px 20px !important;
    }
}
</style>
