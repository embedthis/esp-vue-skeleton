<template>
    <div class="${MODEL}-edit">
        <h1>{{id ? "Edit" : "Create"}} ${UMODEL}</h1>
        <v-form name="${UMODEL}Form" ref="form">
            <v-sheet elevation="4" max-width="600" class="mt-4 pa-4">
                <v-row><v-col class="pt-0"><vu-validate ref="validate" /></v-col></v-row>
                <v-row>
                    <v-col>
                        <vu-input-group v-model="${MODEL}" :schema="schema"></vu-input-group>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn small class="mr-2" color="accent" type="submit" @click.prevent="save()">OK</v-btn>
                        <v-btn small class="mr-2" type="cancel" :to="`/${MODEL}`">Cancel</v-btn>
                        <v-btn small dark color="red" v-if="id" @click.prevent="remove(${MODEL}.id)">Delete</v-btn>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-form>
    </div>
</template>

<script>
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import ${UMODEL} from './${UMODEL}'

@Component()
export default class ${UMODEL}Edit extends Vue {
    id = null
    ${MODEL} = null
    schema = null

    async mounted() {
        this.id = this.$route.params.id
        if (this.id == 'add') {
            this.${MODEL} = await ${UMODEL}.init()
        } else {
            this.${MODEL} = await ${UMODEL}.get({id: this.id})
        }
        this.schema = this.${MODEL}._schema_
    }

    async save() {
        let validate = this.$refs.validate
        /*
            This will first validate the form using client side rules defined in VuValidate.Rules
         */
        if (await validate.form(this)) {
            try {
                await ${UMODEL}.update(this.${MODEL})
                this.navigate('/${MODEL}')
            } catch (err) {
                /*
                    If server side update failed, then examine why and apply field level errors to the form
                 */
                await validate.exception(this, err)
            }
        }
    }

    async remove() {
        await ${UMODEL}.remove({id: this.id})
        this.navigate('/${MODEL}')
    }
}
</script>
