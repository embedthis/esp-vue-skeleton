<!--
    VuInput.js - Vue input directive

    ISSUES:
        - inputClass not working

    <vu-input v-model="value" :name="name" />
    <vu-input v-model="value" :name="name" :type="switch" />
    <vu-input v-model="value" :name="name" :dataType="number" placeholder="42" :rules="rules" />

    Attributes:
        v-model="value"
        auto="autocomplete name"
        type="type"
        dataType="dataType"
        label="Text"
        labelClass="Class"
        inputClass="Class"
        itemClass="Class"
        options="Select or radio options"
        placeholder="Placeholder"
        rules="Validation rules"

    //  MOB - could we pass in schema?

    Examples:
        options = {
            speed: {
                "1000":  "1000",
                "10000": "10000",
                "40000": "40000",
            },
            mode: {
                "Online": "Online",
                "Offline": "Offline",
            },
        }

    Expands to a dataType specific input element. This directive expects a $scope.schema to describe the dataType.
-->
<template>
    <div class="vu-input">
        <!-- error-messages messages success-messages autofocus -->
        <v-text-field
            v-if="displayType == 'label'" :type="type" disabled
            v-model="displayValue" :class="inputClass"
            :name="name" :label="displayLabel" :placeholder="placeholder" :prefix="prefix" :suffix="suffix">
        </v-text-field>

        <v-text-field
            v-if="displayType == 'text' || displayType == 'password'" :type="type"
            v-model="displayValue" :rules="displayRules" :class="inputClass" :disabled="disabled"
            :name="name" :label="displayLabel" :placeholder="placeholder" :prefix="prefix" :suffix="suffix">
        </v-text-field>

        <v-textarea
            v-if="displayType == 'textarea'"
            v-model="displayValue" :rules="displayRules" :disabled="disabled"
            :name="name" :label="displayLabel" :placeholder="placeholder">
        </v-textarea>

        <v-checkbox
            v-if="displayType == 'checkbox'"
            v-model="displayValue"
            :name="name" :label="displayLabel"
            :class="inputClass">
        </v-checkbox>

        <v-radio-group
            v-if="displayType == 'radio'"
            v-model="displayValue"
            :name="name" :label="displayLabel"
            :class="inputClass">
            <v-radio v-for="(value, name) in options"
                :label="name" :key="name" :value="value" :class="itemClass">
            </v-radio>
        </v-radio-group>

        <v-select
            v-if="displayType == 'select'"
            v-model="displayValue" :items="options"
            :name="name" :label="displayLabel"
            dense :class="inputClass">
        </v-select>

        <!-- Switch style checkbox -->
        <v-switch
            v-if="displayType == 'switch'"
            v-model="displayValue"
            :name="name" :label="displayLabel"
            :class="inputClass">
        </v-switch>
    <!--
            <v-combobox
                v-if="displayType == 'text'"
                v-model="displayValue" :options="options" :rules="displayRules"
                :name="name" :label="displayLabel"
                :class="inputClass">
            </v-combobox>

            <v-range-slider
                v-if="displayType == 'text'"
                v-model="range" :min="rangeMin" :max="rangeMax"
                label="Event Range" thumb-size="64" thumb-label="always"
                :name="name" :label="displayLabel"
        :class="inputClass">
        <template v-slot:thumb-label="props">
            <v-card class="ranges" @click.prevent="rangeBoundClick">
                <span>{{ getRange(props.value) }}</span>
            </v-card>
        </template>
    </v-range-slider>

    -->

    </div>
</template>
<script>
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'

/*
    checkbox combobox date select switch password text textarea
 */
const dataToType = {
    array: 'text',
    bool: 'switch',               //  or switch
    boolean: 'switch',            //  or switch
    date: 'date',
    number: 'text',
    int: 'text',
    double: 'text',
    object: 'text',
    string: 'text',
    text: 'textarea',
}
const dataToRules = {
    array: {},
    boolean: {},
    date: {},
    number: {},
    object: {},
    string: {},
}

@Component({components: {}})
export default class VuInput extends Vue {
    @Prop({type: String}) auto
    @Prop({type: String, default: 'text'}) name
    @Prop({type: String}) dataType
    @Prop(Boolean) disabled
    @Prop({type: String, default: ''}) inputClass
    @Prop({type: String, default: ''}) itemClass
    @Prop({type: String}) label
    @Prop({type: String, default: ''}) labelClass
    @Prop() options
    @Prop({type: String}) placeholder
    @Prop({type: String}) prefix
    @Prop({type: Array, default: () => []}) rules
    @Prop({type: String}) suffix
    @Prop({type: String}) type
    @Prop() value

    displayLabel = null
    displayValue = null
    displayRules = []
    displayType = null
    reverseOptions = null

    updated(v) {
        this.emit = this.reverseOptions ? this.reverseOptions[this.displayValue] : this.displayValue
        this.$emit('input', this.emit)
    }

    @Watch('value', {immediate: true, deep: true})
    prep() {
        if (this.value == this.emit && this.displayType) {
            return
        }
        this.setup()
        let dataType = this.dataType ||  this.getType(this.value)
        this.displayType = this.type || dataToType[dataType]
        this.displayRules = this.rules || dataToRules[dataType]
        this.displayLabel = this.label || this.makeTitle(this.name)

        if (this.dataType == 'date' || this.value instanceof Date) {
            /* Convert to RFC3399 date as required for HTML5 date input controls */
            this.displayValue = Date.parse(this.value);
        } else {
            if (this.reverseOptions) {
                this.displayValue = this.options[this.value]
            } else {
                this.displayValue = this.value
            }
        }
    }

    setup() {
        // let bool = { "true": true, "false": false }
        if (this.type == 'switch' && this.options && !this.reverseOptions) {
            this.reverseOptions = {}
            for (let [key,value] of Object.entries(this.options)) {
                this.reverseOptions['' + value] = key
            }
        }
    }

    getType(value) {
        if (typeof value == 'boolean') {
            return 'boolean'
        } else if (typeof value == 'string') {
            return 'string'
        } else if (typeof value == 'number') {
            return 'number'
        } else if (value == 'date' || value instanceof Date) {
            return 'date'
        } else if (Array.isArray(value)) {
            return 'array'
        } else if (typeof value == 'object') {
            return 'object'
        }
        return 'string'
    }

    /*
        Split pascal case letters into separate words
     */
    makeTitle(str) {
        str = str.replace(/[A-Z][a-zA-Z0-9$_]*/g, ' $&');
        let words = str.split(/[ \.]/g)
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
        }
        return words.join(' ')
    }
}
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
    margin-top: 0;
}
</style>

<style lang="scss">
.vu-input {
    .readonly {
        .v-input__slot::after {
            width: 0 !important;
            opacity: 0 !important;
            color: red;
        }
    }
    .v-input--is-disabled > .v-input__control > .v-input__slot:before {
        border: none;
        border: 1px solid #E8E8E8FF !important;

    }
    .theme--light.v-input--is-disabled .v-label {
        color: $text-color !important;
    }
    textarea {
        background: #F2F2F2;
    }
}
</style>
