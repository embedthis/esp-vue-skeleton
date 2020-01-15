<!--
    VuInputGroup.js - Vue input directive

    <vu-input-group v-model="value" schema="schema" fields="Array | string">
-->
<template>
    <div class="vu-input-group">
        <vu-input v-for="item in items" :key="item.name"
            v-model="value[item.name]"
            :dataType="item.dataType"
            :name="item.name"
            :label="item.label"
            :disabled="item.disabled"
            :rules="itemRules[item.name]"
        />
    </div>
</template>

<script>
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import VuInput from 'vu-input'
import VuValidate from 'vu-validate'

@Component({components: {VuInput, VuValidate}})
export default class VuInputGroup extends Vue {
    @Prop() fields
    @Prop() labels
    @Prop({default: () => (VuValidate.Rules)}) rules
    @Prop() schema
    @Prop() value

    items = []
    itemRules = {}

    setup() {
        if (Array.isArray(this.fields)) {
            this.items = this.fields.slice(0)

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
        this.items = this.items.filter(i => !i.disabled)
        this.makeRules()
    }

    makeRules() {
        let itemRules = {}
        for (let item of this.items) {
            let rules
            if (item.disabled) {
                rules = []
            } else if (item.required == false && (this.value[item.name] == null || this.value[item.name] == '')) {
                rules = []
            } else {
                rules = this.rules[item.rule || item.name] || []
            }
            itemRules[item.name] = rules
        }
        if (JSON.stringify(itemRules) != JSON.stringify(this.itemRules)) {
            this.itemRules = itemRules
        }
    }

    @Watch('value', {deep: true})
    valueChanged() {
        this.makeRules()
    }

    @Watch('fields', {deep: true, immediate: true})
    fieldsChanged() {
        this.setup()
    }

    @Watch('schema')
    schemaChanged() {
        this.setup()
    }
}
</script>
