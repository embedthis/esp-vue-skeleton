<template>
    <v-card v-if="errors.length" outlined color="grey lighten-3" class="validate">
        <!--
        <v-card-title class="headline error" primary-title>Form Errors</v-card-title>
        -->
        <v-card-text>
            <h3>Please correct the following errors</h3>
            <ul>
                <li v-for="(error, index) in errors" :key="index">{{error}}</li>
            </ul>
        </v-card-text>
    </v-card>
</template>

<script>
import {Vue, Component, Prop} from 'vue-property-decorator'

/*
    Validation rules
    More rules available at: https://github.com/vuelidate/vuelidate
 */
const Rules = {
    accessKey: [
        v => !!v || 'Missing access key',
        v => (v && v.length == 20) || 'Bad access key, should be 20 characters'
    ],
    cloud: [
        v => !!v || 'Missing cloud name',
        v => /^[^<>~`!@#$%^&\*(){}\[\]|\\\/:;,?=+]+$/.test(v) || 'Bad format for cloud name',
    ],
    email: [
        v => !!v || 'Missing email',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Bad format for email address',
    ],
    group: [
        v => !!v || 'Missing log group name',
        v => /^[a-zA-Z0-9_\-/\.]+/.test(v) || 'Bad format for log group name',
    ],
    name: [
        v => !!v || 'Missing name',
        v => /^[^<>~`!@#$%^&\*(){}\[\]|\\\/:;,?=+]+$/.test(v) || 'Bad format for name',
    ],
    password: [
        v => !!v || 'Missing password',
        v => (v && v.length >= 8) || 'Password must be at least 8 characters',
    ],
    pollPeriod: [
        v => !!v || 'Missing poll period',
        v => 5 <= v && v <= 7200 || 'Bad poll period, should be betwen 5 and 7200 seconds',
    ],
    region: [
        v => !!v || 'Missing cloud region',
        v => /^[\w]+-[\w]+-[\w]+$/.test(v) || 'Bad format for cloud region'
    ],
    required: [
        v => !!v || 'Missing field'
    ],
    resource: [
        v => !!v || 'Missing resource',
        v => (/^[\w. _/-]+$/.test(v) && v != undefined) || 'Bad format for resource',
    ],
    stream: [
        v => !!v || 'Missing log stream name',
        v => /^[a-zA-Z0-9_\-\/\.\*\[\]\$]+$/.test(v) || 'Bad format for log stream name',
    ],
    view: [
        v => !!v || 'Missing view name',
        v => /^[\w \-\_\/]+$/.test(v) || 'Bad format for view name',
    ],
}

@Component
class VuValidate extends Vue {
    errors = []
    rules = Rules

    //  MOB - can we start using schema with data types?
    /*
        Validate a form and calculate errors to aggregate and display
     */
    async check(form, obj, schema) {
        this.errors = []
        if (!form.validate()) {
            this.showErrors(form)
            return false
        }
        return true
    }

    /*
        Set a form-level error message
     */
    error(title, message) {
        if (message) {
            this.errors = [(`${title}: ${message}`)]
        } else {
            this.errors = [(`${title}`)]
        }
    }

    get hasErrors() {
        return this.errors.length > 0
    }

    /*
        Apply field errors from an exception which may contain a js-net response in details.
     */
    async exception(component, err) {
        if (err.details) {
            let fieldErrors = err.details.fieldErrors || {}
            let form = component.$refs.form
            let inputs = form.inputs
            for (let [field,value] of Object.entries(fieldErrors)) {
                let input = inputs.find(i => i.$attrs.name == field)
                if (input) {
                    input.errorBucket.push(value)
                }
            }
            await app.delay(1)
        } else {
            this.error(err.message)
        }
        this.showErrors(form)
    }

    /*
        Extact field error messages from the form input fields and add to this.errors[] which will
        be displayed at the top of the form.
     */
    showErrors(form) {
        for (let input of form.inputs) {
            if (input.errorBucket.length) {
                this.errors.push(input.errorBucket[0])
            }
        }
    }

    /*
        Validate a form and get user confirmation confirm.
        Caller can define vu-validate and vu-confirm with refs.
     */
    async form(component, rules) {
        if (rules) {
            component.rules = rules
        }
        // await app.delay(1)
        let refs = component.$refs
        if (refs.validate) {
            if (!(await refs.validate.check(component.$refs.form))) {
                return false
            }
        }
        if (refs.confirm) {
            if (!(await refs.confirm.ask(`Do you want to save changes?`, "Save Changes"))) {
                return false
            }
        }
        return true
    }
}

VuValidate.Rules = Rules

export default VuValidate


</script>

<style lang="scss" scoped>
h3 {
    color: var(--v-error-base);
    padding-bottom: 10px;
}
</style>
