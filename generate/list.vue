<template>
    <div class="${MODEL}-list">
        <h1>${UMODEL} List</h1>
        <v-row>
            <v-col cols="10">
                <v-data-table :headers="headers" :items="${MODEL}s"
                    hide-default-footer @click:row="clicked"></v-data-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn small color="accent" :to="'/${MODEL}/add'">New ${UMODEL}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {Vue, Component, Prop} from 'vue-property-decorator'
import ${UMODEL} from './${UMODEL}'

@Component()
export default class ${UMODEL}List extends Vue {
    ${MODEL}s = []
    headers = []

    async mounted() {
        this.${MODEL}s = await ${UMODEL}.list()
        let schema = this.${MODEL}s._schema_
        this.headers = []
        for (let column of schema.columns) {
            this.headers.push({text: toTitle(column), value: column})
        }
    }

    clicked(r) {
        this.navigate(`/${MODEL}/${r.id}`)
    }
}
</script>

<style lang="scss" scoped>
.post-list {
    .v-data-table th {
        font-size: 24px !important;
    }
}
</style>
