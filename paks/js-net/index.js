/*
    index.js - Wrapper around fetch with timeouts and cancel

    net.fetch(uri, {
        clear       Clear prior feedback
        feedback    If false, never emit feedback. If true, emit feedback on success. Otherwise on errors.
        body        Post body data
        log         Set to true to trace the request and response
        method      HTTP method
        nologout    Don't logout if response is 401
        noparse     Don't json parse any JSON response
        noprefix    Don't prefix the URL. Use the window.location host address.
        progress    If true, show progress bar.
        raw         If true, return the full response object (see below). If false, return just the data.
        throw       If false, do not throw on errors
    })

    Returns data unless raw is true, then returns a response object {
        data:       object|array
        error:      boolean
        message:    string
        severity:   string
        response:   FetchResponse object
    }

    Will throw an exception for all errors (non-200, timeout) by default. Set {throw:false} to suppress.
    This automatically displays progress and filters response feedback messages if required.

    Fetch doc: https://github.github.io/fetch/
 */

import Json from 'js-json'
import {NetError} from 'js-error'

export default class Net {

    static setConfig(notify, config = {}) {
        Net.config = config
        this.notify = notify
    }

    getConfig() {
        this.config = Object.assign({
            timeouts: {
                http: 30,
            },
            prefix: ''
        }, Net.config)
        this.notify = this.notify || Net.notify
    }

    async callback(reason, args) {
        if (this.notify) {
            try {
                this.notify(reason, args)
            } catch(e) {
                print(e)
            }
        }
    }

    async fetch(url, options = {}) {
        this.getConfig()
        if (options.clear) {
            this.callback('clear')
        }
        if (!url.startsWith("http")) {
            if (options.base) {
                url = options.base + '/' + url
            } else if (!options.nobase && this.config.prefix) {
                url = this.config.prefix + '/' + url
            } else {
                url = location.origin + '/' + url
            }
        }
        if (options.progress) {
            this.callback('start')
        }
        if (options.log) {
            log.trace('Fetch Request', {level: 0, options})
        }
        /*
            Issue request with timeout and retries
         */
        let state = {url, timeout: null}
        let response = await Promise.race([
            this.fetchRetry(state, options),
            this.timeout(state, this.config.timeouts.http * 1000),
        ])
        clearTimeout(state.timeoutHandle)

        return this.parseResponse(url, options, response)
    }

    async parseResponse(url, options, response) {
        let resp = {url}
        let status

        if (response) {
            status = response.status
            if (response.text) {
                let data = await response.text()
                let contentType
                if (response.headers && response.headers.get) {
                    contentType = response.headers.get('Content-Type')
                }
                if (data && contentType && contentType.indexOf('application/json') == 0 && !options.noparse) {
                    try {
                        resp = JSON.parse(data, Json.decode)
                    } catch (err) {
                        print("CANNOT DECODE", data)
                    }
                } else {
                    resp.data = data
                }
            }
            resp.response = response
        } else {
            status = 444
        }

        if (status == 401) {
            if (options.nologout !== true) {
                this.callback('logout', resp)
            }
        } else if (status != 200) {
            /* if (!(status == 0 && options.mode == 'no-cors')) */
            Object.assign(resp, {
                error: true,
                message: 'Could Not Communicate With Server',
                severity: 'error',
            })
        }

        if (options.feedback !== false && (status != 200 || resp.error)) {
            this.callback('feedback', resp)
        }
        if (options.progress) {
            this.callback('stop')
        }

        if (resp.error && options.log !== false) {
            resp.message = resp.message || (resp.feedback || {}).error
            if (status != 401) {
                console.log(resp.message)
            }
        }
        if (options.log) {
            log.trace('Fetch Response', {level: 0, resp})
        }

        if (resp.error && options.throw !== false) {
            if (status == 401) {
                this.callback('login')
            }
            throw new NetError(resp.message || 'Cannot complete operation', resp)
        }
        if (options.raw === true) {
            return resp
        }
        if (resp.data) {
            if (resp.schema) {
                Object.defineProperty(resp.data, '_schema_', {
                    enumerable: false,
                    value: resp.schema,
                })
            }
            if (resp.count) {
                Object.defineProperty(resp.data, '_count_', {
                    enumerable: false,
                    value: resp.count,
                })
            }
        }
        return resp.data
    }

    async get(url, options = {}) {
        options = Object.assign({}, options)
        options.method = 'GET'
        return await this.fetch(url, options)
    }

    async post(url, options = {}) {
        options.method = 'POST'
        return await this.fetch(url, options)
    }

    /*
        Fetch timeouts. The fetch API does not implement timeouts or cancel (Ugh!)
     */
    timeout(state, delay) {
        return new Promise(function(resolve, reject) {
            state.timeoutHandle = setTimeout(function() {
                state.timeout = true
                resolve({
                    error: true,
                    message: 'Request timed out, please retry',
                    severity: 'error',
                    status: 444,
                })
            }, delay)
        })
    }

    /*
        Issue a request with retries
     */
    async fetchRetry(state, options = {}) {
        let url = state.url
        let args = Object.assign({}, options)
        if (!args.method) {
            args.method = 'POST'
        }
        let retries = options.retries || 1
        args.mode = args.mode || 'cors'
        //  MOB - should this be universal or based on mode?
        args.credentials = 'include'

        let response
        let retry = 0
        do {
            try {
                response = await fetch(url, args)
                if (!response) {
                    throw new Error('No response')
                }
                break

            } catch(err) {
                if (state.timeout) {
                    /* Request timed out. Promise fulfilled by timeout already */
                    return
                }
                if (retries <= 0) {
                    break
                }
                console.log(`Request failed, retry ${retry}`)
            }
            retry++
        } while (--retries > 0)
        return response
    }
}
