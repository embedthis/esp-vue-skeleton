<!--
    VuInputGroup.js - Vue input directive

    <vu-input-group v-model="value" schema="schema" fields="Array | string">
-->
<template>
    <div class="vu-input-group">
        <vu-input v-for="item in items" :key="item.name" :dataType="item.dataType" :name="item.name" :label="item.label" v-model="value[item.name]" />
    </div>
</template>

<script>
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import VuInput from 'vu-input'

@Component({components: {VuInput}})
export default class VuInputGroup extends Vue {
    @Prop() fields
    @Prop() labels
    @Prop() schema
    @Prop() value

    items = []

    setup() {
        if (Array.isArray(this.fields)) {
            this.items = this.fields

        } else if (this.fields) {
            let fields = this.fields
            if (typeof fields == 'string') {
                fields = fields.split(',').map(s => s.trim())
            }
            this.items = []
            for (let name of fields) {
                let def = this.schema.types[name]
                if (def) {
                    let field = {}
                    this.items.push({
                        name: name,
                        dataType: def.type,
                    })
                }
            }
        } else if (this.schema) {
            this.items = []
            for (let name of Object.keys(this.schema.types)) {
                if (name != 'id') {
                    this.items.push({name})
                }
            }
        }
        if (this.schema) {
            for (let [name, def] of Object.entries(this.schema.types)) {
                if (name != 'id') {
                    let field = this.items.find(i => i.name == name)
                    if (field) {
                        field.dataType = def.type
                    }
                }
            }
        }
        if (this.labels) {
            for (let [name,title] of Object.entries(this.labels)) {
                let field = this.items.find(i => i.name == name)
                if (field) {
                    field.label = title
                }
            }
        }
    }

    @Watch('value')
    valueChanged() {
        this.setup()
    }
}
</script>
