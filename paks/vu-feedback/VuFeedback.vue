<template>
    <div class="feedback" v-on-click.stop="away">
        <span :class="severityStyle">{{message}}</span>
    </div>
</template>

<script>
import {Vue, Component, Prop} from 'vue-property-decorator'
import {directive as onClick} from 'vue-clickaway'

@Component({directives: {onClick: onClick}})
export default class VuFeedback extends Vue {

    message = null
    feedback = {}
    severityStyle = null

    constructor() {
        super()
        app.define({feedback: this})
    }

    away() {
        this.clear()
        return true
    }

    clear() {
        this.message = ''
        this.severity = 'info'
        this.severityStyle = ''
    }

    error(msg) {
        this.init('error', msg)
    }

    hasErrors() {
        return this.errors.any
    }

    init(severity, msg) {
        setTimeout(() => {
            this.severity = severity
            this.severityStyle = `feedback-${severity}`
            this.message = msg
        }, 1)
    }

    info(msg) {
        this.init('info', msg)
    }

    /*
        Take a response from js-net {
            error: true/false
            message: error-message
            feedback: Other secondary user feedback
        }
     */
    response(resp) {
        let feedback = resp.feedback || {}
        let message = resp.message || feedback.error || feedback.info
        let severity = (resp.error || feedback.error) ? 'error' : 'info'
        this.init(severity, message)
    }

    warn(msg) {
        this.init('warn', msg)
    }
}
</script>

<style lang="scss">
.feedback {
    span {
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -200px;
        width: 400px;
        height: 48px;
        padding: 12px 3px 3px 3px;
        font-weight: bold;
        font-size: 1.2em;
        text-align: center;
        z-index: 200;
    }
    .feedback-error {
        background: #f55a4e;
        color: rgba(255,255,255,0.85);
        background-color: #f55a4e;
        background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #f8877e), color-stop(1, #f22d1e));
        background: -ms-linear-gradient(bottom, #f8877e, #f22d1e);
        background: -moz-linear-gradient(center bottom, #f8877e 0%, #f22d1e 100%);
        background: -o-linear-gradient(#f22d1e, #f8877e);
        z-index: 200;
    }
    .feedback-error:empty {
        display: none;
    }
    .feedback-warn {
        background: #fbc02d;
        color: rgba(255,255,255,0.85);
        font-size: 1.2em;
    }
    .feedback-warn:empty {
        display: none;
    }
    //  THEME
    .feedback-info {
        background: #3f51b5;
        color: rgba(255,255,255,0.85);
        top: -100px;
        animation: feedback-transition ease-in 10s;
    }
    .feedback-info:empty {
        display: none;
    }
}
@-moz-keyframes feedback-transition {
    0% {
        opacity: 1;
        top: 0px;
    }
    80% {
        opacity: 1;
        top: 0px;
    }
    90% {
        opacity: 0.5;
        top: 0px;
    }
    100% {
        opacity: 0;
        top: -100px;
    }
}
@-webkit-keyframes feedback-transition {
    0% {
        opacity: 1;
        top: 0px;
    }
    80% {
        opacity: 1;
        top: 0px;
    }
    90% {
        opacity: 0.5;
        top: 0px;
    }
    100% {
        opacity: 0;
        top: -100px;
    }
}
@-o-keyframes feedback-transition {
    0% {
        opacity: 1;
        top: 0px;
    }
    80% {
        opacity: 1;
        top: 0px;
    }
    90% {
        opacity: 0.5;
        top: 0px;
    }
    100% {
        opacity: 0;
        top: -100px;
    }
}
@keyframes feedback-transition {
    0% {
        opacity: 1;
        top: 0px;
    }
    80% {
        opacity: 1;
        top: 0px;
    }
    90% {
        opacity: 0.5;
        top: 0px;
    }
    100% {
        opacity: 0;
        top: -100px;
    }
}
</style>
