<template>
    <div class="feedback" v-on-click.stop="away">
        <span :class="severityStyle">{{message}}</span>
    </div>
</template>

<script>
import {Vue, Component, Prop} from 'vue-property-decorator'
import {directive as onClick} from 'vue-clickaway'

@Component({
    directives: { onClick: onClick }
})
export default class VuFeedback extends Vue {

    message = null
    feedback = {}
    severityStyle = null

    away() {
        this.clear()
        return true
    }

    mounted() {
        Vue.prototype.$feedback = this
    }

    clear() {
        this.message = ''
        this.severity = 'info'
        this.severityStyle = ''
    }

    error(msg) {
        this.init('error', msg)
        this.severityStyle = `feedback-${this.severity}`
    }

    hasErrors() {
        return this.errors.any
    }

    init(severity, msg) {
        this.severity = severity
        this.message = msg
    }

    info(msg) {
        this.init('info', msg)
        this.severityStyle = `feedback-${this.severity}`
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
        this.severityStyle = `feedback-${this.severity}`
    }

    warn(msg) {
        this.init('warn', msg)
    }
}
</script>

<style lang="scss">
.feedback-error {
    background: #f55a4e;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -250px;
    width: 500px;
    height: 48px;
    padding: 12px 3px 3px 3px;
    color: rgba(255,255,255,0.85);
    font-weight: bold;
    font-size: 1.2em;
    text-align: center;
    z-index: 200;
    background-color: #f55a4e;
    background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #f8877e), color-stop(1, #f22d1e));
    background: -ms-linear-gradient(bottom, #f8877e, #f22d1e);
    background: -moz-linear-gradient(center bottom, #f8877e 0%, #f22d1e 100%);
    background: -o-linear-gradient(#f22d1e, #f8877e);
    font-weight: bold;
}
.feedback-error:empty {
    display: none;
}
.feedback-warn {
    background: #fbc02d;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -250px;
    width: 500px;
    height: 48px;
    padding: 12px 3px 3px 3px;
    color: rgba(255,255,255,0.85);
    font-weight: bold;
    font-size: 1.2em;
    text-align: center;
    z-index: 200;
}
.feedback-warn:empty {
    display: none;
}
.feedback-info {
    background: #3f51b5;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -250px;
    width: 500px;
    height: 48px;
    padding: 12px 3px 3px 3px;
    color: rgba(255,255,255,0.85);
    font-weight: bold;
    font-size: 1.2em;
    text-align: center;
    z-index: 200;
    top: -100px;
    animation: feedback-transition ease-in 10s;
}
.feedback-info:empty {
    display: none;
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
