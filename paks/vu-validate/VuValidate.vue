<template>
    <v-card v-if="errors.length" outlined class="validate">
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
    domain: [
        v => !!v || 'Missing domain',
        v => /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(v) || 'Bad format for domain',
    ],
    email: [
        v => !!v || 'Missing email',
        v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Bad format for email address',
    ],
    ipv4: [
        v => !!v || 'Missing IP address',
        v => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || 'Bad format for IP address',
    ],
    ipv6: [
        v => !!v || 'Missing IPv6 address',
        v => /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(v) || 'Bad format for IPv6 address',
    ],
    log: [
        v => !!v || 'Missing log name',
        v => /^[a-zA-Z0-9_\-/\.]+/.test(v) || 'Bad format for log name',
    ],
    name: [
        v => !!v || 'Missing name',
        v => /^[^<>~`!@#$%^&\*(){}\[\]|\\\/:;,?=+]+$/.test(v) || 'Bad format for name',
    ],
    password: [
        v => !!v || 'Missing password',
        v => (v && v.length >= 8 && /[A-Z]+/.test(v) && /[a-z]+/.test(v) && /[0-9]+/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v) ) || 'Password must be at least 8 characters, have upper, lower, numeric and special characters',
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
        v => !!v || 'Missing required field'
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

    constructor() {
        super()
        this.rules = Rules
    }

    /*
        Validate a form and calculate errors to aggregate and display
     */
    async check(form) {
        this.errors = []
        if (!form.validate()) {
            this.showErrors(form)
            return false
        }
        return true
    }

    clear() {
        this.errors = []
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

    async fieldError(component, field, message) {
        let form = component.$refs.form
        if (form) {
            let inputs = form.inputs
            let input = inputs.find(i => i.$attrs.name == field)
            if (input) {
                input.errorBucket.push(message)
            }
            await app.delay(1)
        }
        this.showErrors(form)
    }

    get hasErrors() {
        return this.errors.length > 0
    }

    /*
        Apply field errors from an exception which may contain a js-net response in details.
     */
    async exception(component, err) {
        let form = component.$refs.form
        if (err.details) {
            let fieldErrors = err.details.fieldErrors || {}
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
    async form(component, options = {}) {
        let refs = component.$refs
        if (refs.validate && refs.form) {
            if (!(await refs.validate.check(refs.form))) {
                return false
            }
        }
        if (options.confirm && refs.confirm) {
            let message = options.confirm || 'Do you want to make changes?'
            if (!(await refs.confirm.ask(message, {title: "Save Changes"}))) {
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
.validate {
    background-color: var(--v-error-base) !important;
    color: white !important;
    border-radius: 0 !important;
    padding-bottom: 14px;
}
h3 {
    color: white;
    padding-bottom: 10px;
}
li {
    color: white;
    font-size: 12px;
}
</style>
